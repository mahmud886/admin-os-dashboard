# Poll Creation Internal Server Error - Fix Documentation

## Problem

When creating a poll, users encountered an "Internal server error" with the following stack trace:
```
at handleSubmit (src/app/create-poll/page.js:125:15)
```

## Root Cause

The error was caused by a **type mismatch in date handling** in the poll creation API route.

### The Bug

In `src/lib/db-helpers.js`, the `calculatePollEndDate` function was returning a **string** (ISO format):

```javascript
export function calculatePollEndDate(startDate, durationDays) {
  const start = startDate ? new Date(startDate) : new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + parseInt(durationDays));
  return end.toISOString(); // ❌ Returns string
}
```

But in `src/app/api/polls/route.js`, the code was trying to call `.toISOString()` on the result:

```javascript
const endsAt = body.ends_at ? new Date(body.ends_at) : calculatePollEndDate(startsAt, durationDays);
// ...
ends_at: endsAt.toISOString(), // ❌ Error: strings don't have .toISOString()
```

When `body.ends_at` was not provided, `endsAt` would be a string, and calling `.toISOString()` on a string throws a `TypeError`, causing the internal server error.

## Solution

### 1. Fixed `calculatePollEndDate` to return a Date object

**File**: `src/lib/db-helpers.js`

```javascript
/**
 * Calculate poll end date from duration
 * Returns a Date object (not a string) for consistency
 */
export function calculatePollEndDate(startDate, durationDays) {
  const start = startDate ? new Date(startDate) : new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + parseInt(durationDays));
  return end; // ✅ Return Date object, not string
}
```

### 2. Added validation to ensure Date object

**File**: `src/app/api/polls/route.js`

Added a safety check to ensure `endsAt` is always a valid Date object:

```javascript
// Ensure endsAt is a Date object
if (!(endsAt instanceof Date) || isNaN(endsAt.getTime())) {
  return createErrorResponse('Invalid end date calculation', 500, 'Failed to calculate poll end date');
}
```

### 3. Updated other usage

**File**: `src/app/api/polls/[id]/route.js`

Updated the PUT route to convert the Date object to ISO string:

```javascript
const calculatedEndDate = calculatePollEndDate(startsAt, body.duration_days);
updateData.ends_at = calculatedEndDate.toISOString();
```

## Why This Error Occurred

1. **Inconsistent Return Type**: The helper function returned different types (string) than what the calling code expected (Date object)
2. **Missing Type Validation**: No validation to ensure the date was in the expected format before calling methods on it
3. **Silent Type Coercion**: JavaScript's loose typing allowed the code to compile, but failed at runtime

## What Was the Code Actually Doing vs. What It Needed to Do?

**What it was doing:**
- `calculatePollEndDate` returned an ISO string
- Code tried to call `.toISOString()` on a string
- This threw `TypeError: endsAt.toISOString is not a function`

**What it needed to do:**
- `calculatePollEndDate` should return a Date object
- Code can safely call `.toISOString()` on the Date object
- Convert to ISO string only when needed for database storage

## The Correct Mental Model

### Date Handling in JavaScript/Node.js

1. **Date Objects**: Use Date objects for calculations and manipulations
2. **ISO Strings**: Convert to ISO strings only when:
   - Storing in database (TIMESTAMPTZ fields)
   - Sending over API
   - Serializing to JSON

3. **Helper Functions**: Should return the most useful type (Date objects) and let callers convert as needed

### Best Practices

```javascript
// ✅ Good: Return Date object, let caller convert
function calculateEndDate(start, days) {
  const end = new Date(start);
  end.setDate(end.getDate() + days);
  return end; // Date object
}

// ✅ Good: Convert to ISO string when storing
const pollData = {
  ends_at: endDate.toISOString() // Convert when needed
};

// ❌ Bad: Return string from helper
function calculateEndDate(start, days) {
  return new Date(start).toISOString(); // Too specific
}
```

## Warning Signs to Look For

### Code Smells

1. **Mixed Return Types**: Helper functions returning different types (string vs. Date)
2. **Method Calls on Unknown Types**: Calling methods without type checking
3. **Inconsistent Date Handling**: Some places use Date objects, others use strings

### Patterns to Avoid

```javascript
// ❌ Bad: Inconsistent return type
function getDate() {
  return Math.random() > 0.5 ? new Date() : new Date().toISOString();
}

// ❌ Bad: No validation
const date = someFunction();
date.toISOString(); // Might fail if date is string

// ✅ Good: Consistent return type + validation
function getDate() {
  return new Date(); // Always Date object
}

const date = getDate();
if (date instanceof Date) {
  date.toISOString(); // Safe
}
```

## Testing the Fix

### Manual Testing Steps

1. Navigate to `/create-poll`
2. Fill in all required fields:
   - Select an episode
   - Enter poll title
   - Add at least 2 options
   - Set duration (optional, defaults to 7 days)
3. Click "DEPLOY LIVE" or "SAVE DRAFT"
4. Verify poll is created successfully
5. Check that poll appears in `/polls` page

### What to Verify

- ✅ Poll creation succeeds without errors
- ✅ Poll appears in the polls list
- ✅ Poll has correct start and end dates
- ✅ Poll options are created correctly
- ✅ No console errors

## Related Files Changed

1. `src/lib/db-helpers.js` - Fixed `calculatePollEndDate` return type
2. `src/app/api/polls/route.js` - Added date validation
3. `src/app/api/polls/[id]/route.js` - Updated to handle Date object

## Prevention

To prevent similar issues in the future:

1. **Type Consistency**: Keep helper function return types consistent
2. **Type Validation**: Add runtime checks for critical operations
3. **TypeScript**: Consider migrating to TypeScript for compile-time type safety
4. **Unit Tests**: Add tests for date calculation functions
5. **Code Review**: Pay attention to type conversions in date handling

## Summary

The fix involved:
- Changing `calculatePollEndDate` to return a Date object instead of a string
- Adding validation to ensure dates are valid before use
- Updating all usages to handle the Date object correctly

This ensures type consistency and prevents runtime errors when creating polls.
