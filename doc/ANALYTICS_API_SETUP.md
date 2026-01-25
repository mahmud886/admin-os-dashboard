# Analytics API Setup Guide

## Overview

The analytics API provides endpoints for tracking poll performance, social media shares, and Google Analytics integration.

## API Endpoints

### 1. Dashboard Analytics

**GET** `/api/analytics/dashboard?timeframe=7`

Returns aggregated analytics data for the dashboard.

**Query Parameters:**

- `timeframe` (optional): Number of days to analyze (default: 7, options: 7, 14, 30, 90)

**Response:**

```json
{
  "overview": {
    "totalPolls": 10,
    "totalVotes": 150,
    "totalShares": 45,
    "recentShares": 12
  },
  "dailyShares": [
    { "date": "2024-01-15", "count": 5 },
    { "date": "2024-01-16", "count": 7 }
  ],
  "platformStats": [
    { "platform": "facebook", "count": 20 },
    { "platform": "twitter", "count": 15 }
  ],
  "utmSources": [{ "source": "email", "clicks": 10, "campaigns": 2 }],
  "referrers": [{ "referrer": "example.com", "count": 8 }],
  "topPolls": [
    {
      "id": "uuid",
      "question": "Poll title",
      "total_votes": 50,
      "created_at": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### 2. Google Analytics Status

**GET** `/api/analytics/google`

Returns Google Analytics configuration status.

**Response:**

```json
{
  "configured": true,
  "measurementId": "G-XXXXXXXXXX",
  "activeUsers": 0,
  "note": "Optional note"
}
```

### 3. Track Share

**POST** `/api/analytics/shares`

Track a poll share event.

**Request Body:**

```json
{
  "poll_id": "uuid",
  "platform": "facebook",
  "referrer": "https://example.com",
  "utm_source": "email",
  "utm_medium": "newsletter",
  "utm_campaign": "promo",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0..."
}
```

**Response:**

```json
{
  "message": "Share tracked successfully",
  "share": { ... }
}
```

## Database Setup

### Step 1: Run the Migration

Run the shares table migration in your Supabase Dashboard:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run the contents of: `supabase/migrations/create_shares_table.sql`

Or use Supabase CLI:

```bash
supabase db execute --file supabase/migrations/create_shares_table.sql
```

This creates the `poll_shares` table for tracking social media shares and UTM data.

### Step 2: Environment Variables

For Google Analytics integration, add to your `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Usage in Frontend

### Track a Share

```javascript
await fetch('/api/analytics/shares', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    poll_id: 'poll-uuid',
    platform: 'facebook',
    referrer: window.location.href,
    utm_source: new URLSearchParams(window.location.search).get('utm_source'),
    utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
    utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
  }),
});
```

### Fetch Dashboard Data

```javascript
const response = await fetch(`/api/analytics/dashboard?timeframe=7`);
const data = await response.json();
```

## Notes

- The API works even if the `poll_shares` table doesn't exist yet (returns empty data)
- Google Analytics active users requires additional API integration (placeholder for now)
- All endpoints are accessible without authentication for tracking purposes
- The dashboard endpoint aggregates data from both `polls` and `poll_shares` tables

## Future Enhancements

1. **Google Analytics Integration**: Implement actual GA Data API calls for real-time active users
2. **Caching**: Add caching layer for frequently accessed analytics data
3. **Real-time Updates**: Use Supabase real-time subscriptions for live analytics
4. **Export**: Add CSV/JSON export functionality for analytics data
