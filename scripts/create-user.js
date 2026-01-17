#!/usr/bin/env node

/**
 * Script to create admin user in Supabase Auth
 *
 * Usage:
 *   node scripts/create-user.js
 *
 * Make sure you have SUPABASE_SERVICE_ROLE_KEY in your .env.local
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You need to add this to .env.local

const userEmail = process.env.NEXT_PUBLIC_STATIC_ADMIN_EMAIL || 'iqbal886mahmud@gmail.com';
const userPassword = process.env.NEXT_PUBLIC_STATIC_ADMIN_PASSWORD || 'iqbal886mahmud';

async function createUser() {
  if (!supabaseUrl) {
    console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local');
    process.exit(1);
  }

  if (!serviceRoleKey) {
    console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is not set in .env.local');
    console.error('\n📝 To get your service role key:');
    console.error('   1. Go to https://supabase.com/dashboard/project/_/settings/api');
    console.error('   2. Copy the "service_role" key (NOT the anon key)');
    console.error('   3. Add it to .env.local as: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
    console.error('\n⚠️  WARNING: Service role key has admin privileges. Never commit it to git!');
    process.exit(1);
  }

  // Create Supabase client with service role key (has admin privileges)
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('\n🔄 Creating user in Supabase Auth...');
  console.log(`   Email: ${userEmail}`);

  try {
    // Create the user
    const { data, error } = await supabase.auth.admin.createUser({
      email: userEmail,
      password: userPassword,
      email_confirm: true, // Auto-confirm the email
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ User already exists in Supabase Auth');
        console.log('\n💡 If login still fails, try:');
        console.log('   1. Check that the password matches exactly');
        console.log('   2. Verify the user is confirmed in Supabase Dashboard');
        console.log('   3. Try resetting the password in Supabase Dashboard');
      } else {
        console.error('❌ ERROR:', error.message);
        process.exit(1);
      }
    } else {
      console.log('✅ User created successfully!');
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
    }
  } catch (err) {
    console.error('❌ ERROR:', err.message);
    process.exit(1);
  }
}

createUser();
