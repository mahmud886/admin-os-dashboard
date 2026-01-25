# Analytics Dashboard Troubleshooting

## Issue: "No platform data yet", "No UTM data yet", "No referrer data yet"

If you're seeing empty states in Platform Distribution, Traffic Sources (UTM), and Top Referrers, here's how to fix it:

### Step 1: Check if poll_shares table exists

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this query:

```sql
SELECT COUNT(*) FROM poll_shares;
```

**If you get an error** saying the table doesn't exist:

- Run the migration: `supabase/migrations/create_shares_table.sql`
- Or use Supabase CLI: `supabase db execute --file supabase/migrations/create_shares_table.sql`

### Step 2: Create test data (optional)

If the table exists but has no data, you can create test data:

```bash
npm run test:analytics
```

This script will:

- Check if the table exists
- Find your first poll
- Create sample share records with platforms, UTM sources, and referrers

### Step 3: Track real shares

To track actual shares, use the `/api/analytics/shares` endpoint:

```javascript
// Example: Track a share
await fetch('/api/analytics/shares', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    poll_id: 'your-poll-id',
    platform: 'facebook',
    referrer: window.location.href,
    utm_source: new URLSearchParams(window.location.search).get('utm_source'),
    utm_medium: 'web',
    utm_campaign: 'promo',
  }),
});
```

### Step 4: Verify data in database

Check if shares exist:

```sql
SELECT platform, COUNT(*) as count
FROM poll_shares
GROUP BY platform;
```

### Common Issues

#### Issue: Table doesn't exist

**Solution**: Run the migration file `supabase/migrations/create_shares_table.sql`

#### Issue: Table exists but no data

**Solution**:

- Run `npm run test:analytics` to create test data
- Or implement share tracking in your frontend

#### Issue: Data exists but not showing

**Check**:

1. Open browser DevTools → Network tab
2. Check the `/api/analytics/dashboard` response
3. Verify `platformStats`, `utmSources`, and `referrers` arrays have data
4. Check browser console for errors

#### Issue: RLS (Row Level Security) blocking queries

**Solution**: The migration includes RLS policies. If you're still having issues:

1. Check Supabase Dashboard → Authentication → Policies
2. Verify policies for `poll_shares` table exist
3. Make sure you're authenticated when viewing the dashboard

### API Response Structure

The API should return:

```json
{
  "overview": {
    "totalPolls": 10,
    "totalVotes": 150,
    "totalShares": 45,
    "recentShares": 12
  },
  "platformStats": [
    { "platform": "facebook", "count": 20 },
    { "platform": "twitter", "count": 15 }
  ],
  "utmSources": [
    { "source": "email", "clicks": 10, "campaigns": 2 }
  ],
  "referrers": [
    { "referrer": "google.com", "count": 8 }
  ],
  "topPolls": [...],
  "dailyShares": [...]
}
```

If any of these arrays are empty, you'll see "No data yet" messages.

### Quick Test

1. **Run migration** (if not done):

   ```sql
   -- In Supabase SQL Editor
   -- Run: supabase/migrations/create_shares_table.sql
   ```

2. **Create test data**:

   ```bash
   npm run test:analytics
   ```

3. **Refresh dashboard** - you should now see data!

### Still Not Working?

1. Check browser console for errors
2. Check Network tab for API response
3. Verify Supabase connection in `.env.local`
4. Check Supabase Dashboard → Table Editor → `poll_shares` to see if data exists
