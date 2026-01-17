# How to Create User in Supabase Auth

## ❌ Problem: Cannot Update Supabase Database

Direct SQL inserts into `auth.users` are restricted in Supabase. You need to use the **Admin API** instead.

## ✅ Solution: Use Admin API (Recommended)

### Method 1: Use Node.js Script (Easiest - No dependencies)

1. **Get your Service Role Key**:
   - Go to: https://supabase.com/dashboard/project/_/settings/api
   - Scroll down to find **"service_role"** key
   - Copy the entire key (it's a long JWT token)
   - Add it to your `.env.local`:
     ```env
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - ⚠️ **WARNING**: Never commit this key to git! It has admin privileges.

2. **Run the script**:

   ```bash
   node scripts/create-user-simple.js
   ```

3. **Check output** - Should see:
   ```
   ✅ User created successfully!
      User ID: abc123...
      Email: iqbal886mahmud@gmail.com
      Confirmed: Yes
   ```

---

### Method 2: Use Dashboard UI (Alternative)

1. Go to: https://supabase.com/dashboard/project/_/auth/users
2. Click **"Add User"** button (top right)
3. Fill in the form:
   - **Email**: `iqbal886mahmud@gmail.com`
   - **Password**: `iqbal886mahmud`
   - ✅ **Auto Confirm User** (check this box - very important!)
   - Leave other fields as default
4. Click **"Create User"**

---

### Method 3: Use Supabase CLI (If installed)

If you have Supabase CLI installed:

```bash
supabase auth users create \
  --email iqbal886mahmud@gmail.com \
  --password iqbal886mahmud \
  --confirmed
```

---

## 🔍 Verify User Created

1. Go to: https://supabase.com/dashboard/project/_/auth/users
2. You should see `iqbal886mahmud@gmail.com` in the users list
3. Check that status shows **"Confirmed"** or **"Active"**

---

## 🧪 Test Login

After creating the user:

1. Restart your dev server:

   ```bash
   npm run dev
   ```

2. Go to: http://localhost:3000/login

3. Login with:
   - Email: `iqbal886mahmud@gmail.com`
   - Password: `iqbal886mahmud`

---

## ⚠️ Troubleshooting

### "SERVICE_ROLE_KEY not found"

- Make sure you copied the **service_role** key (not anon/publishable key)
- It should be a very long JWT token
- Check that it's in `.env.local` on a single line without quotes

### "User already exists"

- The user might already be created
- Check Supabase Dashboard → Authentication → Users
- If password is wrong, reset it in the dashboard

### "Invalid login credentials" after creating user

- Make sure user is **Confirmed** in Supabase Dashboard
- Verify email matches exactly: `iqbal886mahmud@gmail.com`
- Verify password matches exactly: `iqbal886mahmud`
- Check browser console for detailed errors

---

## 📝 Important Notes

- ✅ **Always use Admin API** - Never try to directly insert into `auth.users` via SQL
- ✅ **Service Role Key** has admin privileges - keep it secret!
- ✅ **Auto Confirm User** must be checked when creating via UI
- ✅ Password comparison is **case-sensitive** - must match exactly
