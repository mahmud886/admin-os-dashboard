#!/usr/bin/env node

/**
 * Simple script to create admin user in Supabase Auth using Admin API
 *
 * Usage:
 *   node scripts/create-user-simple.js
 *
 * Make sure you have SUPABASE_SERVICE_ROLE_KEY in your .env.local
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env.local manually (no dependencies needed)
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ ERROR: .env.local file not found');
    process.exit(1);
  }

  const envFile = fs.readFileSync(envPath, 'utf8');
  const env = {};

  envFile.split('\n').forEach((line) => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts
          .join('=')
          .trim()
          .replace(/^["']|["']$/g, '');
      }
    }
  });

  return env;
}

const env = loadEnv();

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const userEmail = env.NEXT_PUBLIC_STATIC_ADMIN_EMAIL || 'iqbal886mahmud@gmail.com';
const userPassword = env.NEXT_PUBLIC_STATIC_ADMIN_PASSWORD || 'iqbal886mahmud';

if (!supabaseUrl) {
  console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is not set in .env.local');
  console.error('\n📝 To get your service role key:');
  console.error('   1. Go to: https://supabase.com/dashboard/project/_/settings/api');
  console.error('   2. Scroll down to find "service_role" key');
  console.error('   3. Copy the service_role key (it starts with "eyJ..." or similar)');
  console.error('   4. Add it to .env.local as:');
  console.error('      SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
  console.error('\n⚠️  WARNING: Service role key has admin privileges. Never commit it to git!');
  process.exit(1);
}

// Extract project URL from Supabase URL
const projectUrl = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
const apiUrl = `https://${projectUrl}.supabase.co/auth/v1/admin/users`;

async function createUser() {
  console.log('\n🔄 Creating user in Supabase Auth...');
  console.log(`   Email: ${userEmail}`);
  console.log(`   URL: ${apiUrl}`);

  const postData = JSON.stringify({
    email: userEmail,
    password: userPassword,
    email_confirm: true,
    user_metadata: {},
  });

  const options = {
    hostname: `${projectUrl}.supabase.co`,
    port: 443,
    path: '/auth/v1/admin/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ User created successfully!');
            console.log(`   User ID: ${response.id}`);
            console.log(`   Email: ${response.email}`);
            console.log(`   Confirmed: ${response.email_confirmed_at ? 'Yes' : 'No'}`);
            resolve(response);
          } else if (res.statusCode === 422 && data.includes('already registered')) {
            console.log('✅ User already exists in Supabase Auth');
            console.log('\n💡 If login still fails, try:');
            console.log('   1. Verify the password in Supabase Dashboard matches');
            console.log('   2. Check that the user is confirmed');
            console.log('   3. Try resetting the password in Supabase Dashboard');
            resolve(null);
          } else {
            console.error('❌ ERROR:', response.message || response.error_description || data);
            console.error(`   Status Code: ${res.statusCode}`);
            reject(new Error(response.message || data));
          }
        } catch (err) {
          console.error('❌ ERROR parsing response:', err.message);
          console.error('   Response:', data);
          reject(err);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ ERROR:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

createUser()
  .then(() => {
    console.log('\n✅ Done! You can now try logging in.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed to create user:', error.message);
    process.exit(1);
  });
