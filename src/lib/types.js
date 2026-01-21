/**
 * Type definitions for Episodes and Polls
 */

// Episode visibility status
export const EpisodeVisibility = {
  AVAILABLE: 'AVAILABLE',
  UPCOMING: 'UPCOMING',
  LOCKED: 'LOCKED',
  DRAFT: 'DRAFT',
  ARCHIVED: 'ARCHIVED',
};

// Episode access levels
export const EpisodeAccessLevel = {
  FREE: 'free',
  PREMIUM: 'premium',
  VIP: 'vip',
};

// Poll status
export const PollStatus = {
  DRAFT: 'DRAFT',
  LIVE: 'LIVE',
  ENDED: 'ENDED',
  ARCHIVED: 'ARCHIVED',
};

// Episode Schema
export const EpisodeSchema = {
  id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
  title: 'text NOT NULL',
  description: 'text',
  episode_number: 'integer NOT NULL',
  season_number: 'integer NOT NULL',
  runtime: 'text', // Format: MM:SS or HH:MM:SS
  unique_episode_id: 'text UNIQUE NOT NULL',
  visibility: `text NOT NULL DEFAULT 'DRAFT' CHECK (visibility IN ('AVAILABLE', 'UPCOMING', 'LOCKED', 'DRAFT', 'ARCHIVED'))`,
  access_level: `text NOT NULL DEFAULT 'free' CHECK (access_level IN ('free', 'premium', 'vip'))`,
  release_datetime: 'timestamptz',
  clearance_level: 'integer DEFAULT 1',
  notify: 'boolean DEFAULT false',
  age_restricted: 'boolean DEFAULT false',
  thumb_image_url: 'text',
  banner_image_url: 'text',
  video_url: 'text',
  audio_url: 'text',
  additional_background_image_url: 'text',
  tags: 'text[] DEFAULT ARRAY[]::text[]',
  primary_genre: 'text',
  secondary_genre: 'text',
  status: `text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED'))`,
  created_at: 'timestamptz DEFAULT NOW()',
  updated_at: 'timestamptz DEFAULT NOW()',
  created_by: 'uuid REFERENCES auth.users(id)',
};

// Poll Schema
export const PollSchema = {
  id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
  episode_id: 'uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE',
  title: 'text NOT NULL',
  description: 'text',
  duration_days: 'integer NOT NULL DEFAULT 7', // Duration in days
  status: `text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'LIVE', 'ENDED', 'ARCHIVED'))`,
  created_at: 'timestamptz DEFAULT NOW()',
  updated_at: 'timestamptz DEFAULT NOW()',
  starts_at: 'timestamptz',
  ends_at: 'timestamptz',
  created_by: 'uuid REFERENCES auth.users(id)',
};

// Poll Option Schema
export const PollOptionSchema = {
  id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
  poll_id: 'uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE',
  name: 'text NOT NULL',
  description: 'text',
  vote_count: 'integer DEFAULT 0',
  display_order: 'integer DEFAULT 0',
  created_at: 'timestamptz DEFAULT NOW()',
  updated_at: 'timestamptz DEFAULT NOW()',
};

// Episode input type (for API requests)
export const createEpisodeInputSchema = {
  title: 'string (required)',
  description: 'string (optional)',
  episode_number: 'number (required)',
  season_number: 'number (required)',
  runtime: 'string (optional)',
  unique_episode_id: 'string (required, unique)',
  visibility: "string (optional, default: 'DRAFT')",
  access_level: "string (optional, default: 'free')",
  release_datetime: 'string (optional, ISO datetime)',
  clearance_level: 'number (optional, default: 1)',
  notify: 'boolean (optional, default: false)',
  age_restricted: 'boolean (optional, default: false)',
  thumb_image_url: 'string (optional)',
  banner_image_url: 'string (optional)',
  video_url: 'string (optional)',
  audio_url: 'string (optional)',
  additional_background_image_url: 'string (optional)',
  tags: 'array of strings (optional)',
  primary_genre: 'string (optional)',
  secondary_genre: 'string (optional)',
  status: "string (optional, default: 'DRAFT')",
};

// Poll input type (for API requests)
export const createPollInputSchema = {
  episode_id: 'uuid (required)',
  title: 'string (required)',
  description: 'string (optional)',
  duration_days: 'number (optional, default: 7)',
  status: "string (optional, default: 'DRAFT')",
  starts_at: 'string (optional, ISO datetime)',
  ends_at: 'string (optional, ISO datetime)',
  options: 'array of {name: string, description: string, vote_count: number} (required, min: 2)',
};

// Poll Option input type
export const createPollOptionInputSchema = {
  poll_id: 'uuid (required)',
  name: 'string (required)',
  description: 'string (optional)',
  vote_count: 'number (optional, default: 0)',
  display_order: 'number (optional, default: 0)',
};
