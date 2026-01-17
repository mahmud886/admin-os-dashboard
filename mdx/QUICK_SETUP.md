# Quick Setup: Create Admin User

## Fastest Method (2 minutes)

### Step 1: Copy SQL Script

Open `scripts/create-user.sql` and copy its contents.

### Step 2: Run in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/_/sql
2. Click **"New Query"**
3. Paste the SQL script
4. Click **"Run"** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)

### Step 3: Verify User Created

1. Go to: https://supabase.com/dashboard/project/_/auth/users
2. You should see `admin@example.com` in the users list
3. Check that status shows **"Confirmed"** or **"Active"**

### Step 4: Test Login

1. Restart your dev server: `npm run dev`
2. Go to: http://localhost:3000/login
3. Login with:
   - Email: `iqbal886mahmud@gmail.com`
   - Password: `iqbal886mahmud`

✅ Done!

---

## Alternative: Use Dashboard UI (Visual Method)

1. Go to: https://supabase.com/dashboard/project/_/auth/users
2. Click **"Add User"** button
3. Fill in:
   - **Email**: `iqbal886mahmud@gmail.com`
   - **Password**: `iqbal886mahmud`
   - ✅ **Auto Confirm User** (check this!)
4. Click **"Create User"**

---

## Troubleshooting

**If you get an error:**

- Make sure you're using the correct Supabase project
- Check that the SQL script syntax is correct
- Verify your `.env.local` has the correct credentials

**If login still fails:**

- Verify the user email matches exactly (case-sensitive)
- Verify the password matches exactly (case-sensitive)
- Make sure user status is "Confirmed" in Supabase
- Check browser console for errors
