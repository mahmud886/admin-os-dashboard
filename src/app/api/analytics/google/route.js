/**
 * Google Analytics API Route
 * GET /api/analytics/google
 * Returns GA config, active users, total visits, and visit location (when GA4 Data API is configured).
 */

import { createErrorResponse, createResponse } from '@/lib/db-helpers';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-MG27CK781R';
const propertyId = process.env.GA4_PROPERTY_ID; // Numeric, e.g. 123456789
const hasDataApiCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

export async function GET() {
  try {
    if (!measurementId) {
      return createResponse({
        configured: false,
        measurementId: null,
        activeUsers: 0,
        totalVisits: 0,
        totalUsers: 0,
        visitLocation: [],
        note: 'Add NEXT_PUBLIC_GA_MEASUREMENT_ID to your environment variables.',
      });
    }

    const base = {
      configured: true,
      measurementId,
      activeUsers: 0,
      totalVisits: 0,
      totalUsers: 0,
      visitLocation: [],
      note: null,
    };

    if (!propertyId || !hasDataApiCredentials) {
      base.note =
        'Dashboard metrics (active users, visits, location) need GA4 Data API: set GA4_PROPERTY_ID and Google service account credentials.';
      return createResponse(base);
    }

    const ga = await fetchGA4Data();
    return createResponse({
      ...base,
      activeUsers: ga.activeUsers ?? 0,
      totalVisits: ga.totalVisits ?? 0,
      totalUsers: ga.totalUsers ?? 0,
      visitLocation: ga.visitLocation ?? [],
      sessionsLast30: ga.sessionsLast30,
      note: null,
    });
  } catch (error) {
    console.error('Google Analytics API error:', error);
    return createErrorResponse('Internal server error', 500, error.message);
  }
}

async function fetchGA4Data() {
  let BetaAnalyticsDataClient;
  try {
    const mod = await import('@google-analytics/data');
    BetaAnalyticsDataClient = mod.BetaAnalyticsDataClient;
  } catch (e) {
    console.warn('GA Data API client not available:', e.message);
    return {};
  }

  const property = `properties/${propertyId}`;
  let credentials = undefined;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    } catch (e) {
      console.warn('Invalid GOOGLE_SERVICE_ACCOUNT_KEY JSON');
    }
  }

  const client = new BetaAnalyticsDataClient(credentials ? { credentials } : {});

  const [realtimeRes, reportRes, locationRes] = await Promise.all([
    runRealtimeReport(client, property),
    runReport(client, property),
    runLocationReport(client, property),
  ]);

  const activeUsers = parseInt(realtimeRes?.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
  const totalVisits = parseInt(reportRes?.totals?.[0]?.metricValues?.[0]?.value || '0', 10);
  const totalUsers = parseInt(reportRes?.totals?.[0]?.metricValues?.[1]?.value || '0', 10);
  const sessionsLast30 = parseInt(reportRes?.totals?.[0]?.metricValues?.[0]?.value || '0', 10);

  const visitLocation = (locationRes?.rows || []).map((row) => ({
    country: row.dimensionValues?.[0]?.value || '(not set)',
    city: row.dimensionValues?.[1]?.value || '',
    users: parseInt(row.metricValues?.[0]?.value || '0', 10),
  }));

  return {
    activeUsers,
    totalVisits: sessionsLast30,
    totalUsers,
    sessionsLast30,
    visitLocation,
  };
}

async function runRealtimeReport(client, property) {
  try {
    const [res] = await client.runRealtimeReport({
      property,
      dimensions: [{ name: 'unifiedScreenName' }],
      metrics: [{ name: 'activeUsers' }],
    });
    return res;
  } catch (e) {
    console.warn('GA realtime report error:', e.message);
    return {};
  }
}

async function runReport(client, property) {
  const now = new Date();
  const end = now.toISOString().slice(0, 10).replace(/-/g, '');
  const start = new Date(now);
  start.setDate(start.getDate() - 30);
  const startStr = start.toISOString().slice(0, 10).replace(/-/g, '');

  try {
    const [res] = await client.runReport({
      property,
      dateRanges: [{ startDate: startStr, endDate: end }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
    });
    return res;
  } catch (e) {
    console.warn('GA report error:', e.message);
    return {};
  }
}

async function runLocationReport(client, property) {
  const now = new Date();
  const end = now.toISOString().slice(0, 10).replace(/-/g, '');
  const start = new Date(now);
  start.setDate(start.getDate() - 30);
  const startStr = start.toISOString().slice(0, 10).replace(/-/g, '');

  try {
    const [res] = await client.runReport({
      property,
      dateRanges: [{ startDate: startStr, endDate: end }],
      dimensions: [{ name: 'country' }, { name: 'city' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 50,
      orderBy: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    });
    return res;
  } catch (e) {
    console.warn('GA location report error:', e.message);
    return {};
  }
}
