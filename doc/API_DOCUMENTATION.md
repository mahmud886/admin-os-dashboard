# API Documentation

Full CRUD API for Episodes and Polls with Supabase integration.

## Setup

### 1. Run Database Migration

Run the SQL migration script in your Supabase Dashboard:

```sql
-- Go to Supabase Dashboard → SQL Editor
-- Run the contents of: supabase/migrations/create_tables.sql
```

Or use Supabase CLI:

```bash
supabase db execute --file supabase/migrations/create_tables.sql
```

### 2. Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key
```

## API Endpoints

### Episodes API

#### GET /api/episodes

Get all episodes with optional filtering and pagination.

**Query Parameters:**

- `visibility` (optional): Filter by visibility status (AVAILABLE, UPCOMING, LOCKED, DRAFT, ARCHIVED)
- `access_level` (optional): Filter by access level (free, premium, vip)
- `status` (optional): Filter by status (DRAFT, PUBLISHED)
- `limit` (optional): Number of results (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**

```json
{
  "episodes": [...],
  "total": 10,
  "limit": 100,
  "offset": 0
}
```

**Example:**

```bash
GET /api/episodes?visibility=AVAILABLE&limit=10&offset=0
```

---

#### POST /api/episodes

Create a new episode.

**Authentication:** Required

**Request Body:**

```json
{
  "title": "Episode Title",
  "description": "Episode description",
  "episode_number": 1,
  "season_number": 1,
  "runtime": "42:15",
  "unique_episode_id": "EP-S01-E001",
  "visibility": "DRAFT",
  "access_level": "free",
  "release_datetime": "2024-12-31T00:00:00Z",
  "clearance_level": 1,
  "notify": false,
  "age_restricted": false,
  "thumb_image_url": "https://...",
  "banner_image_url": "https://...",
  "video_url": "https://...",
  "audio_url": "https://...",
  "additional_background_image_url": "https://...",
  "tags": ["tag1", "tag2"],
  "primary_genre": "cyberpunk",
  "secondary_genre": "sci-fi",
  "status": "DRAFT",
  "isDraft": true
}
```

**Required Fields:**

- `title`
- `episode_number`
- `season_number`
- `unique_episode_id`

**Response:**

```json
{
  "message": "Episode created successfully",
  "episode": {...}
}
```

---

#### GET /api/episodes/[id]

Get a single episode by ID.

**Response:**

```json
{
  "episode": {...}
}
```

---

#### PUT /api/episodes/[id]

Update an episode.

**Authentication:** Required

**Request Body:** (same as POST, but all fields optional)

**Response:**

```json
{
  "message": "Episode updated successfully",
  "episode": {...}
}
```

---

#### DELETE /api/episodes/[id]

Delete an episode. This will cascade delete all related polls.

**Authentication:** Required

**Response:**

```json
{
  "message": "Episode deleted successfully"
}
```

---

### Polls API

#### GET /api/polls

Get all polls with optional filtering.

**Query Parameters:**

- `episode_id` (optional): Filter by episode ID
- `status` (optional): Filter by status (DRAFT, LIVE, ENDED, ARCHIVED)
- `limit` (optional): Number of results (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**

```json
{
  "polls": [
    {
      "id": "...",
      "title": "...",
      "episodes": {...},
      "poll_options": [...]
    }
  ],
  "total": 10,
  "limit": 100,
  "offset": 0
}
```

**Example:**

```bash
GET /api/polls?episode_id=xxx&status=LIVE
```

---

#### POST /api/polls

Create a new poll with dynamic options.

**Authentication:** Required

**Request Body:**

```json
{
  "episode_id": "uuid",
  "title": "Poll Title",
  "description": "Poll description",
  "duration_days": 7,
  "status": "DRAFT",
  "starts_at": "2024-12-31T00:00:00Z",
  "ends_at": "2025-01-07T00:00:00Z",
  "isDraft": true,
  "options": [
    {
      "name": "Option 1",
      "description": "Option 1 description",
      "count": 0
    },
    {
      "name": "Option 2",
      "description": "Option 2 description",
      "count": 0
    }
  ]
}
```

**Required Fields:**

- `episode_id` (must exist in episodes table)
- `title`
- `options` (array, minimum 2 options)

**Response:**

```json
{
  "message": "Poll created successfully",
  "poll": {
    "id": "...",
    "title": "...",
    "episodes": {...},
    "poll_options": [...]
  }
}
```

---

#### GET /api/polls/[id]

Get a single poll by ID with all options.

**Response:**

```json
{
  "poll": {
    "id": "...",
    "title": "...",
    "episodes": {...},
    "poll_options": [...]
  }
}
```

---

#### PUT /api/polls/[id]

Update a poll. Can also update options by providing new options array.

**Authentication:** Required

**Request Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "duration_days": 14,
  "status": "LIVE",
  "options": [
    // New options array (will replace existing)
  ]
}
```

**Response:**

```json
{
  "message": "Poll updated successfully",
  "poll": {...}
}
```

---

#### DELETE /api/polls/[id]

Delete a poll. This will cascade delete all related poll options.

**Authentication:** Required

**Response:**

```json
{
  "message": "Poll deleted successfully"
}
```

---

## Database Schema

### Episodes Table

- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `description` (TEXT)
- `episode_number` (INTEGER, Required)
- `season_number` (INTEGER, Required)
- `runtime` (TEXT)
- `unique_episode_id` (TEXT, Unique, Required)
- `visibility` (TEXT: AVAILABLE, UPCOMING, LOCKED, DRAFT, ARCHIVED)
- `access_level` (TEXT: free, premium, vip)
- `release_datetime` (TIMESTAMPTZ)
- `clearance_level` (INTEGER)
- `notify` (BOOLEAN)
- `age_restricted` (BOOLEAN)
- `thumb_image_url` (TEXT)
- `banner_image_url` (TEXT)
- `video_url` (TEXT)
- `audio_url` (TEXT)
- `additional_background_image_url` (TEXT)
- `tags` (TEXT[])
- `primary_genre` (TEXT)
- `secondary_genre` (TEXT)
- `status` (TEXT: DRAFT, PUBLISHED)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- `created_by` (UUID, Foreign Key to auth.users)

### Polls Table

- `id` (UUID, Primary Key)
- `episode_id` (UUID, Foreign Key to episodes, Required)
- `title` (TEXT, Required)
- `description` (TEXT)
- `duration_days` (INTEGER, Default: 7)
- `status` (TEXT: DRAFT, LIVE, ENDED, ARCHIVED)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- `starts_at` (TIMESTAMPTZ)
- `ends_at` (TIMESTAMPTZ)
- `created_by` (UUID, Foreign Key to auth.users)

### Poll Options Table

- `id` (UUID, Primary Key)
- `poll_id` (UUID, Foreign Key to polls, Required)
- `name` (TEXT, Required)
- `description` (TEXT)
- `vote_count` (INTEGER, Default: 0)
- `display_order` (INTEGER, Default: 0)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## Relationships

- **Episodes → Polls**: One-to-Many (One episode can have many polls)
- **Polls → Poll Options**: One-to-Many (One poll can have many options)
- **Cascade Deletes**: Deleting an episode will delete all related polls and their options

## Authentication

All POST, PUT, DELETE endpoints require authentication. The API checks for a valid Supabase session.

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

**Common Status Codes:**

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `404`: Not Found
- `409`: Conflict (e.g., unique constraint violation)
- `500`: Internal Server Error

## Example Usage

### Create Episode

```javascript
const response = await fetch('/api/episodes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'The Beginning',
    episode_number: 1,
    season_number: 1,
    unique_episode_id: 'EP-S01-E001',
    visibility: 'DRAFT',
    tags: ['cyberpunk', 'sci-fi'],
  }),
});

const data = await response.json();
```

### Create Poll with Dynamic Options

```javascript
const response = await fetch('/api/polls', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    episode_id: 'episode-uuid',
    title: 'What should happen next?',
    description: 'Vote for the next action',
    duration_days: 7,
    options: [
      { name: 'Option A', description: 'Description A', count: 0 },
      { name: 'Option B', description: 'Description B', count: 0 },
      { name: 'Option C', description: 'Description C', count: 0 },
    ],
    isDraft: false,
  }),
});

const data = await response.json();
```

### Get Polls for Episode

```javascript
const response = await fetch(`/api/polls?episode_id=${episodeId}`);
const { polls } = await response.json();
```
