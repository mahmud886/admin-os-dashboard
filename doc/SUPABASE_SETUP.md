# Supabase Authentication Setup Guide

## Issue: "Invalid login credentials"

This error means the static credentials validation passed, but Supabase Auth rejected the login. This usually means:

1. **The user doesn't exist in Supabase Auth**
2. **The password in Supabase doesn't match the one in `.env.local`**

## Solution: Create the User in Supabase

### Step 1: Go to Supabase Dashboard

1. Open your Supabase project: https://supabase.com/dashboard/project/_/auth/users
2. Navigate to: **Authentication** → **Users**

### Step 2: Create the User Manually

Click **"Add User"** or **"Invite User"** and fill in:

- **Email**: `iqbal886mahmud@gmail.com` (must match exactly - check your .env.local)
- **Password**: `iqbal886mahmud` (must match exactly - check your .env.local)
- **Auto Confirm User**: ✅ **Check this box** (important!)

### Step 3: Alternative Methods

### Option A: Use SQL Script (Recommended)

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy and paste the contents of `scripts/create-user.sql`
3. Click **Run** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
4. Check the output - it should say "User created successfully"

### Option B: Use Node.js Script

1. **Get your Service Role Key** (⚠️ Keep this secret!):
   - Go to: https://supabase.com/dashboard/project/_/settings/api
   - Copy the **"service_role"** key (NOT the anon/public key)
   - Add it to `.env.local`:
     ```env
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     ```

2. **Run the script**:
   ```bash
   npm install dotenv
   node scripts/create-user.js
   ```

### Option C: Use Dashboard UI (Easiest)

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add User"** or **"Invite User"**
3. Fill in:
   - **Email**: `admin@example.com`
   - **Password**: `strongpassword123`
   - ✅ **Auto Confirm User** (important!)
4. Click **Create User**

### Step 4: Verify Credentials Match

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_STATIC_ADMIN_EMAIL=iqbal886mahmud@gmail.com
NEXT_PUBLIC_STATIC_ADMIN_PASSWORD=iqbal886mahmud
```

And the user in Supabase Auth has:

- **Email**: `iqbal886mahmud@gmail.com` (exact match, case-sensitive)
- **Password**: `iqbal886mahmud` (exact match)

### Step 5: Restart Your Dev Server

After creating the user, restart your Next.js dev server:

```bash
# Stop the server (Ctrl+C) and restart:
npm run dev
```

## Troubleshooting

### Still getting errors?

1. **Check browser console** for detailed error messages
2. **Verify Supabase URL and Key** are correct in `.env.local`
3. **Ensure user is confirmed** in Supabase (check "Auto Confirm User" when creating)
4. **Try logging in directly** with Supabase Auth UI to test credentials

### Test the user exists

You can verify the user was created correctly:

1. Go to Supabase Dashboard → Authentication → Users
2. You should see `iqbal886mahmud@gmail.com` in the users list
3. Check that the user status shows as "Confirmed" or "Active"

## Notes

- The email comparison is case-insensitive in the validation code
- The password comparison is case-sensitive and must match exactly
- Supabase Auth requires the user to be confirmed/active before login works
