#!/usr/bin/env node

/**
 * Test Analytics Data Script
 *
 * This script creates sample poll_shares data for testing the analytics dashboard.
 * Run this after setting up your Supabase connection.
 *
 * Usage:
 *   node scripts/test-analytics-data.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
  console.error('\nPlease check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getFirstPoll() {
  const { data, error } = await supabase.from('polls').select('id').limit(1).single();
  if (error || !data) {
    console.error('❌ No polls found. Please create at least one poll first.');
    return null;
  }
  return data.id;
}

async function createTestShares(pollId) {
  const platforms = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'reddit', 'x_share', 'ig_story'];
  const utmSources = ['email', 'social', 'direct', 'newsletter'];
  const referrers = ['google.com', 'facebook.com', 'twitter.com', 'linkedin.com', 'reddit.com'];

  const shares = [];
  const now = new Date();

  // Create shares for the last 7 days
  for (let day = 0; day < 7; day++) {
    const shareDate = new Date(now);
    shareDate.setDate(shareDate.getDate() - day);

    // Create 2-5 shares per day
    const sharesPerDay = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < sharesPerDay; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const utmSource = Math.random() > 0.5 ? utmSources[Math.floor(Math.random() * utmSources.length)] : null;
      const referrer = Math.random() > 0.3 ? referrers[Math.floor(Math.random() * referrers.length)] : null;

      shares.push({
        poll_id: pollId,
        platform: platform,
        referrer: referrer,
        utm_source: utmSource,
        utm_medium: utmSource ? 'web' : null,
        utm_campaign: utmSource ? `campaign-${Math.floor(Math.random() * 3) + 1}` : null,
        created_at: new Date(shareDate.getTime() - Math.random() * 86400000).toISOString(),
      });
    }
  }

  console.log(`📊 Creating ${shares.length} test share records...`);

  const { data, error } = await supabase.from('poll_shares').insert(shares).select();

  if (error) {
    if (error.message?.includes('does not exist')) {
      console.error('\n❌ poll_shares table does not exist!');
      console.error('   Please run the migration first:');
      console.error('   supabase/migrations/create_shares_table.sql');
      console.error('\n   Or in Supabase Dashboard → SQL Editor, run the migration file.');
    } else {
      console.error('❌ Error creating test shares:', error.message);
    }
    return false;
  }

  console.log(`✅ Successfully created ${data.length} share records!`);
  console.log('\n📈 Your analytics dashboard should now show:');
  console.log('   - Platform Distribution');
  console.log('   - Traffic Sources (UTM)');
  console.log('   - Top Referrers');
  console.log('   - Daily Shares chart');
  return true;
}

async function main() {
  console.log('🧪 Analytics Test Data Generator\n');

  // Check if table exists
  const { error: checkError } = await supabase.from('poll_shares').select('id').limit(1);
  if (checkError && checkError.message?.includes('does not exist')) {
    console.error('❌ poll_shares table does not exist!');
    console.error('\n📝 Please run the migration first:');
    console.error('   1. Go to Supabase Dashboard → SQL Editor');
    console.error('   2. Run: supabase/migrations/create_shares_table.sql');
    console.error('\n   Or use Supabase CLI:');
    console.error('   supabase db execute --file supabase/migrations/create_shares_table.sql\n');
    process.exit(1);
  }

  // Get first poll
  const pollId = await getFirstPoll();
  if (!pollId) {
    process.exit(1);
  }

  console.log(`✅ Found poll: ${pollId}\n`);

  // Create test shares
  const success = await createTestShares(pollId);

  if (success) {
    console.log('\n🎉 Test data created successfully!');
    console.log('   Refresh your dashboard to see the analytics data.');
  }
}

main().catch(console.error);
