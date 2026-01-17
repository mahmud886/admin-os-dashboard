-- Supabase SQL Script to Create Admin User
-- Run this in your Supabase Dashboard → SQL Editor
-- Or use Supabase CLI: supabase db execute --file scripts/create-user.sql

-- Set the email and password variables
-- Make sure these match your .env.local file
DO $$
DECLARE
  user_email TEXT := 'iqbal886mahmud@gmail.com';
  user_password TEXT := 'iqbal886mahmud';
  user_id UUID;
  encrypted_password TEXT;
BEGIN
  -- Generate a new UUID for the user
  user_id := gen_random_uuid();

  -- Encrypt the password using bcrypt
  encrypted_password := crypt(user_password, gen_salt('bf'));

  -- Insert the user into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_id,
    'authenticated',
    'authenticated',
    user_email,
    encrypted_password,
    NOW(),
    NOW(),
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (id) DO NOTHING;

  -- Output success message
  RAISE NOTICE 'User created successfully: %', user_email;

END $$;