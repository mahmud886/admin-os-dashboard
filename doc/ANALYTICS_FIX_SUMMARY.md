# Analytics Dashboard Fix Summary

## Issues Fixed

### 1. **Platform Distribution, Traffic Sources, and Top Referrers showing "No data yet"**

**Root Cause:**

- The API was filtering shares by timeframe, so if there were no shares in the selected timeframe (7/14/30/90 days), these sections would be empty
- The API wasn't properly handling the case when the `poll_shares` table doesn't exist

**Fixes Applied:**

1. **API Route** (`src/app/api/analytics/dashboard/route.js`):
   - ✅ Now queries **ALL shares** (all-time) for Platform Distribution, UTM Sources, and Referrers
   - ✅ Only uses timeframe filtering for Daily Shares chart and Recent Shares count
   - ✅ Better error handling to detect if table doesn't exist
   - ✅ Improved logging for debugging

2. **Components Updated:**
   - ✅ `TrafficSources`: Fixed percentage calculation to use total UTM clicks instead of recent shares
   - ✅ `TopReferrers`: Fixed percentage calculation to use total referrer shares
   - ✅ All components show helpful empty states with instructions

## What You Need to Do

### Step 1: Run the Migration (if not done)

The `poll_shares` table must exist for analytics to work:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and run the contents of: `supabase/migrations/create_shares_table.sql`

Or use Supabase CLI:

```bash
supabase db execute --file supabase/migrations/create_shares_table.sql
```

### Step 2: Add Test Data (Optional)

To see the analytics working immediately:

```bash
npm run test:analytics
```

This will create sample share records with:

- Multiple platforms (Facebook, Twitter, LinkedIn, etc.)
- UTM sources (email, social, direct, newsletter)
- Referrers (google.com, facebook.com, etc.)
- Data spread across the last 7 days

### Step 3: Verify It's Working

1. Refresh your dashboard
2. You should now see:
   - ✅ Platform Distribution with icons and percentages
   - ✅ Traffic Sources (UTM) with campaigns
   - ✅ Top Referrers with visit counts
   - ✅ Daily Shares chart with data

## How Share Tracking Works

### Track a Share via API

```javascript
await fetch('/api/analytics/shares', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    poll_id: 'your-poll-uuid',
    platform: 'facebook', // Required
    referrer: window.location.href, // Optional
    utm_source: 'email', // Optional
    utm_medium: 'web', // Optional
    utm_campaign: 'promo', // Optional
  }),
});
```

### Track Shares from Frontend

Add this to your poll sharing buttons:

```javascript
const trackShare = async (pollId, platform) => {
  const urlParams = new URLSearchParams(window.location.search);
  await fetch('/api/analytics/shares', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      poll_id: pollId,
      platform: platform,
      referrer: document.referrer || window.location.href,
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
    }),
  });
};
```

## Data Flow

```
User shares poll
    ↓
POST /api/analytics/shares
    ↓
Insert into poll_shares table
    ↓
GET /api/analytics/dashboard
    ↓
Query poll_shares table
    ↓
Aggregate: platformStats, utmSources, referrers
    ↓
Display in dashboard components
```

## Troubleshooting

If you still see "No data yet":

1. **Check if table exists:**

   ```sql
   SELECT COUNT(*) FROM poll_shares;
   ```

2. **Check if data exists:**

   ```sql
   SELECT * FROM poll_shares LIMIT 10;
   ```

3. **Check API response:**
   - Open browser DevTools → Network
   - Check `/api/analytics/dashboard` response
   - Look for `platformStats`, `utmSources`, `referrers` arrays

4. **Check console logs:**
   - Look for error messages in server logs
   - Check browser console for client errors

5. **Run test data script:**
   ```bash
   npm run test:analytics
   ```

## Files Changed

- ✅ `src/app/api/analytics/dashboard/route.js` - Fixed data querying logic
- ✅ `src/components/dashboard/traffic-sources.jsx` - Fixed percentage calculation
- ✅ `src/components/dashboard/top-referrers.jsx` - Fixed percentage calculation
- ✅ `scripts/test-analytics-data.js` - New test data generator
- ✅ `doc/ANALYTICS_TROUBLESHOOTING.md` - Troubleshooting guide

## Next Steps

1. ✅ Run the migration (if not done)
2. ✅ Run `npm run test:analytics` to create test data
3. ✅ Refresh dashboard to see analytics
4. ✅ Implement share tracking in your frontend when users share polls

The dashboard will now show all-time data for Platform Distribution, Traffic Sources, and Top Referrers, regardless of the selected timeframe!
