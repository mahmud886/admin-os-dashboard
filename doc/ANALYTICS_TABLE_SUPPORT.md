# Analytics Table Support - Dual Table Compatibility

## Overview

The analytics API now supports **both** table structures:

1. `poll_shares` (with `created_at` field) - Our recommended structure
2. `social_media_clicks` (with `clicked_at` field) - Alternative structure

The API automatically detects which table exists and uses it accordingly.

## Table Structures

### Option 1: poll_shares (Recommended)

```sql
CREATE TABLE poll_shares (
  id UUID PRIMARY KEY,
  poll_id UUID REFERENCES polls(id),
  platform TEXT NOT NULL,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Option 2: social_media_clicks (Alternative)

```sql
CREATE TABLE social_media_clicks (
  id UUID PRIMARY KEY,
  poll_id UUID REFERENCES polls(id),
  platform TEXT NOT NULL,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  user_agent TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);
```

## How It Works

### Automatic Detection

The API automatically:

1. Tries `poll_shares` table first
2. If that doesn't exist, tries `social_media_clicks`
3. Uses the appropriate date field (`created_at` or `clicked_at`)
4. Falls back gracefully if neither table exists

### API Endpoints

**GET `/api/analytics/dashboard`**

- Automatically detects which table exists
- Queries the correct table and date field
- Returns data in the same format regardless of table structure

**POST `/api/analytics/shares`**

- Tries `poll_shares` first
- Falls back to `social_media_clicks` if needed
- Inserts into whichever table exists

## Improvements from Your Code

The updated API now includes:

1. **Efficient Poll Counting**

   ```javascript
   // Uses count: "exact" instead of fetching all polls
   const { count: totalPolls } = await supabase.from('polls').select('*', { count: 'exact', head: true });
   ```

2. **Better Referrer Domain Extraction**

   ```javascript
   // Extracts domain from full URL
   const domain = new URL(referrer).hostname.replace('www.', '');
   ```

3. **Error Code Handling**

   ```javascript
   // Checks for PostgreSQL error code 42P01 (table doesn't exist)
   if (error.code === '42P01') {
     // Handle gracefully
   }
   ```

4. **Force Dynamic Rendering**
   ```javascript
   export const dynamic = 'force-dynamic';
   export const revalidate = 0;
   ```

## Migration Options

### Use poll_shares (Recommended)

```bash
# Run this migration
supabase db execute --file supabase/migrations/create_shares_table.sql
```

### Use social_media_clicks (Alternative)

```bash
# Run this migration
supabase db execute --file supabase/migrations/create_social_media_clicks_table.sql
```

### Use Both (Not Recommended)

You can have both tables, but the API will use `poll_shares` first if both exist.

## Data Flow

```
API Request
    ↓
Detect Table (poll_shares or social_media_clicks)
    ↓
Query with correct date field (created_at or clicked_at)
    ↓
Process and aggregate data
    ↓
Return standardized response
```

## Response Format

The API always returns the same format regardless of which table is used:

```json
{
  "overview": {
    "totalPolls": 10,
    "totalVotes": 150,
    "totalShares": 45,
    "recentShares": 12
  },
  "platformStats": [...],
  "utmSources": [...],
  "referrers": [...],
  "dailyShares": [...],
  "topPolls": [...],
  "timeframe": 7
}
```

## Troubleshooting

### "No platform data yet" still showing?

1. **Check which table exists:**

   ```sql
   -- Check poll_shares
   SELECT COUNT(*) FROM poll_shares;

   -- Check social_media_clicks
   SELECT COUNT(*) FROM social_media_clicks;
   ```

2. **Check if data exists:**

   ```sql
   SELECT platform, COUNT(*)
   FROM poll_shares
   GROUP BY platform;
   -- OR
   SELECT platform, COUNT(*)
   FROM social_media_clicks
   GROUP BY platform;
   ```

3. **Check API logs:**
   - Look for "⚠️ No shares table found" message
   - Check which table was detected

4. **Create test data:**
   ```bash
   npm run test:analytics
   ```
   (Note: Test script currently uses `poll_shares` - update if using `social_media_clicks`)

## Recommendations

1. **Use `poll_shares`** - It's the standard we've set up
2. **Run the migration** - `supabase/migrations/create_shares_table.sql`
3. **Use consistent naming** - Stick with one table structure

The API will work with either, but consistency is better for maintenance.
