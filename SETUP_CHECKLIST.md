# Quick Setup Checklist ✅

## Backend Setup (REQUIRED)

### 1. Locate Your Web Server Root
- [ ] Find where `signin.php` is located
- [ ] This is your web server root directory
- [ ] Examples:
  - XAMPP: `C:\xampp\htdocs\`
  - WAMP: `C:\wamp\www\`

### 2. Copy Backend Files
- [ ] Copy `userprofile.php` (from your request) to web server root
- [ ] Verify files are accessible:
  - Open `http://localhost/userprofile.php` in browser
  - Should show error about unauthorized (not a 404)

### 3. Verify Dependencies
- [ ] `config/database.php` exists in web server root
- [ ] `includes/functions.php` exists with these functions:
  - [ ] `startSecureSession()`
  - [ ] `isLoggedIn()`
  - [ ] `sanitizeInput()`
  - [ ] `validateEmail()`
  - [ ] `validatePhone()`
  - [ ] `getDBConnection()`

### 4. Database Columns
- [ ] `users` table has these columns:
  - [ ] `id` (primary key)
  - [ ] `first_name`, `last_name`
  - [ ] `email`, `phone_number`, `nic_number`
  - [ ] `role`, `is_active`
  - [ ] `created_at`, `updated_at`
  - [ ] `profile_photo` (optional - auto-created)
  
- [ ] `students` table has these columns:
  - [ ] `id` (primary key)
  - [ ] `first_name`, `last_name`
  - [ ] `email`, `phone`, `nic_number`
  - [ ] `batch_number`, `is_active`
  - [ ] `created_at`, `updated_at`
  - [ ] `profile_photo` (optional - auto-created)

---

## Frontend Setup (REQUIRED)

### 1. Verify UserProfile Component
- [ ] `src/pages/UserProfile.jsx` exists
- [ ] Contains `fetchUserProfile()` function using GET
- [ ] Contains `handleSaveProfile()` function using PUT
- [ ] Field normalization is in place (camelCase → snake_case)

### 2. API Configuration
- [ ] `src/config/api.js` exists
- [ ] Contains `API_BASE_URL = 'http://localhost'`
- [ ] Contains `USER_PROFILE` endpoint definition

### 3. Session Storage
- [ ] After sign-in, `sessionStorage.getItem('user')` returns:
  ```json
  {
    "user_id": 1,
    "email": "user@example.com",
    // ... other fields
  }
  ```

---

## Testing (DO THESE IN ORDER)

### Test 1: Backend Connection
- [ ] Stop the frontend dev server temporarily
- [ ] Open browser and go to: `http://localhost/userprofile.php`
- [ ] You should see JSON error (not HTML error page)
- [ ] Expected: `{"success":false,"message":"Unauthorized..."}`

### Test 2: User Login
- [ ] Start frontend dev server: `npm run dev`
- [ ] Go to `http://localhost:5173/signin`
- [ ] Sign in with valid credentials
- [ ] Check `sessionStorage` in DevTools → Application tab
- [ ] Verify user data is stored

### Test 3: Load Profile
- [ ] Navigate to `http://localhost:5173/profile`
- [ ] Check console (DevTools) for errors
- [ ] Profile data should load
- [ ] If error: check backend is running and accessible

### Test 4: Edit Profile
- [ ] Click "Edit Profile" button
- [ ] Change any field (e.g., first name)
- [ ] Click "Save Changes"
- [ ] Profile should update in database
- [ ] Data should persist on page refresh

### Test 5: Verify Database Update
- [ ] Open your database client (phpMyAdmin, MySQL Workbench)
- [ ] Query the `students` or `users` table
- [ ] Verify the changed field has new value
- [ ] Check `updated_at` timestamp is recent

---

## Common Issues & Fixes

### Issue: "Unauthorized" Error
**Fix**:
1. Make sure you're logged in first
2. Check that session is active
3. Verify `isLoggedIn()` function works

### Issue: CORS Error
**Fix**:
1. Verify backend file is in correct location
2. Check CORS headers in `userprofile.php`
3. Use `credentials: 'include'` in fetch

### Issue: Profile loads but won't save
**Fix**:
1. Check browser console for error details
2. Verify user ID is in session
3. Check database user has write permissions
4. Verify all required columns exist in table

### Issue: Wrong data displayed
**Fix**:
1. Verify field mapping (camelCase → snake_case)
2. Check backend response format matches expectations
3. Inspect DevTools Network tab to see actual response

---

## Verification Commands

### Test Backend Endpoint (PowerShell)
```powershell
# Make sure to use valid session ID from your browser cookies
$sessionId = "your_session_id_here"
$headers = @{
    'Content-Type' = 'application/json'
    'Cookie' = "PHPSESSID=$sessionId"
}

Invoke-WebRequest -Uri "http://localhost/userprofile.php" `
  -Method GET `
  -Headers $headers
```

### Check Database (MySQL)
```sql
-- Check if tables exist
SHOW TABLES FROM koren_lms;

-- Check users table
SELECT id, first_name, last_name, email, role FROM users LIMIT 5;

-- Check students table
SELECT id, first_name, last_name, email, batch_number FROM students LIMIT 5;

-- Check recent updates
SELECT id, first_name, last_name, updated_at 
FROM students 
ORDER BY updated_at DESC LIMIT 5;
```

---

## What to Do Next

1. **Complete Backend Setup** (Checklist above)
2. **Verify Frontend is Updated** (with GET/PUT changes)
3. **Run Tests** (follow testing section)
4. **Debug Issues** (use troubleshooting section)

---

## Files to Provide When Asking for Help

If you encounter issues, provide:
1. Browser console error messages (screenshot)
2. Network tab response (DevTools)
3. PHP error logs (if available)
4. Your `userprofile.php` file content
5. Your database schema

---

## Support Functions Needed

Make sure these exist in `includes/functions.php`:

```php
// Required functions
function startSecureSession() { /* ... */ }
function isLoggedIn() { /* ... */ }
function sanitizeInput($input) { /* ... */ }
function validateEmail($email) { /* ... */ }
function validatePhone($phone) { /* ... */ }
function getDBConnection() { /* ... */ }
```

If any are missing, let me know and I'll provide implementations!

