import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Initialize Supabase Admin Client
    // process.env.SUPABASE_SERVICE_ROLE_KEY must be set in .env.local
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // List users to find the email
    // Note: This approach is suitable for admin dashboards with a limited number of users.
    // For large user bases, a database function or a public profiles table is recommended.
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000, // Fetch up to 1000 users to check
    });

    if (error) {
      console.error('Error listing users:', error);
      return NextResponse.json({ error: 'Failed to check email' }, { status: 500 });
    }

    // Check if email exists (case-insensitive)
    const normalizedEmail = email.trim().toLowerCase();
    const userExists = users.some(user => user.email?.toLowerCase() === normalizedEmail);

    return NextResponse.json({ exists: userExists });

  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
