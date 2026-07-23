import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Reads an error message out of a failed fetch Response, tolerating bodies
 * that aren't JSON (e.g. a platform-level 413/502/504 plain-text or HTML
 * page) instead of letting `res.json()` throw a confusing "Unexpected
 * token..." SyntaxError. Prefers `details` (the underlying error, e.g. a
 * Postgres/Supabase message) over the generic `error` field.
 */
export async function readApiError(res, fallback = "Request failed") {
  const raw = await res.text().catch(() => "");
  try {
    const data = JSON.parse(raw);
    return data.details || data.error || fallback;
  } catch {
    const status = `HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ""}`;
    return raw
      ? `${fallback} — ${status}: ${raw.slice(0, 200)}`
      : `${fallback} — ${status}`;
  }
}
