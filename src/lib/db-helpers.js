/**
 * Database helper functions for Supabase operations
 */

import { createClient } from '@/lib/supabase-server';

/**
 * Get authenticated user from Supabase session
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, error: error || new Error('Not authenticated') };
  }

  return { user, error: null };
}

/**
 * Create response helpers
 */
export function createResponse(data, status = 200) {
  return Response.json(data, { status });
}

export function createErrorResponse(message, status = 400, details = null) {
  return Response.json(
    {
      error: message,
      details,
    },
    { status }
  );
}

/**
 * Validate required fields
 */
export function validateRequiredFields(data, requiredFields) {
  const missing = [];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missing.push(field);
    }
  }
  return missing.length === 0 ? null : missing;
}

/**
 * Calculate poll end date from duration
 * Returns a Date object (not a string) for consistency
 */
export function calculatePollEndDate(startDate, durationDays) {
  const start = startDate ? new Date(startDate) : new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + parseInt(durationDays));
  return end; // Return Date object, not string
}
