# Frontend-Backend Connection Summary

## ✅ What I've Done

### 1. Updated Frontend (`UserProfile.jsx`)
**Changes Made:**
- ✅ Changed fetch method from `POST` to `GET` (matches your backend)
- ✅ Added data normalization (camelCase → snake_case)
- ✅ Changed update method to `PUT` instead of separate file
- ✅ Properly handles both users and students tables
- ✅ Includes fallback to stored session data if API fails

**Key Functions:**
```javascript
// Fetch profile using GET
fetchUserProfile() → GET /userprofile.php

// Save profile using PUT
handleSaveProfile() → PUT /userprofile.php
```

### 2. Updated API Configuration (`src/config/api.js`)
**Changes Made:**
- ✅ Added `USER_PROFILE: 'http://localhost/userprofile.php'`
- ✅ Ready for centralized API endpoint management

### 3. Created Documentation
**Files Created:**
- ✅ `FRONTEND_BACKEND_INTEGRATION.md` - Complete integration guide
- ✅ `SETUP_CHECKLIST.md` - Step-by-step setup and testing

---

## 🔄 Data Flow Diagram

```
USER LOGS IN
    ↓
Session created: $_SESSION['user_id'], $_SESSION['user_type']
Session data stored: sessionStorage.setItem('user', JSON.stringify(userData))
    ↓
USER NAVIGATES TO /profile
    ↓
UserProfile.jsx fetches: GET /userprofile.php
    ↓
Backend: 
  1. Checks isLoggedIn() ✓
  2. Gets user_type from $_SESSION
  3. Queries appropriate table (users or students)
  4. Returns camelCase JSON
    ↓
Frontend:
  1. Normalizes camelCase → snake_case
  2. Updates component state
  3. Renders profile UI
    ↓
USER EDITS & CLICKS SAVE
    ↓
UserProfile.jsx sends: PUT /userprofile.php
  Body: { firstName, lastName, email, phone }
    ↓
Backend:
  1. Validates input
  2. Updates database
  3. Returns updated profile (camelCase)
    ↓
Frontend:
  1. Normalizes response
  2. Updates state
  3. Updates sessionStorage
  4. Shows success
    ↓
DATABASE UPDATED ✓
```

---

## 📋 Required Backend Files

**Location:** Web server root (XAMPP: `C:\xampp\htdocs\`, WAMP: `C:\wamp\www\`)

### File 1: `userprofile.php` (You provided this ✓)
**Contains:**
- `handleGetProfile()` - Fetches profile via GET
- `handlePutProfile()` - Updates profile via PUT  
- `getStudentProfile()` - Queries students table
- `getUserProfile()` - Queries users table
- `updateStudentProfile()` - Updates student record
- `updateUserProfile()` - Updates user record
- Validation functions

### File 2: `config/database.php` (Must exist)
**Should have:**
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'your_password');
define('DB_NAME', 'koren_lms');

function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    // ...
    return $conn;
}
```

### File 3: `includes/functions.php` (Must exist)
**Should contain:**
```php
function startSecureSession() { /* ... */ }
function isLoggedIn() { /* ... */ }
function sanitizeInput($input) { /* ... */ }
function validateEmail($email) { /* ... */ }
function validatePhone($phone) { /* ... */ }
```

---

## 🎯 Field Mapping Reference

### When Frontend Sends to Backend (PUT)
```javascript
{
  firstName: "John",      // → Maps to: first_name in DB
  lastName: "Doe",        // → Maps to: last_name in DB
  email: "john@ex.com",   // → Maps to: email in DB
  phone: "0771234567"     // → Maps to: phone (students) or phone_number (users)
}
```

### When Backend Sends to Frontend (GET/PUT Response)
```php
[
  'firstName' => 'John',       // ← From: first_name in DB
  'lastName' => 'Doe',         // ← From: last_name in DB
  'email' => 'john@ex.com',    // ← From: email in DB
  'phone' => '0771234567',     // ← From: phone or phone_number in DB
  'nicNumber' => '9951234567', // ← From: nic_number in DB
  'batchNumber' => 'BATCH-01', // ← From: batch_number in DB (students only)
]
```

### Frontend Component State (After Normalization)
```javascript
{
  first_name: "John",
  last_name: "Doe",
  email: "john@ex.com",
  phone: "0771234567",
  nic_number: "9951234567",
  batch_number: "BATCH-01"
}
```

---

## 🔌 How to Connect

### Step 1: Backend Setup (5 minutes)
1. Find your web server root directory
2. Copy `userprofile.php` there
3. Verify `config/database.php` and `includes/functions.php` exist

### Step 2: Frontend Verification (2 minutes)
1. Check `UserProfile.jsx` is in `src/pages/`
2. Verify `src/config/api.js` has `USER_PROFILE` endpoint
3. Frontend is already updated ✓

### Step 3: Test Connection (5 minutes)
1. Sign in to app (creates session)
2. Navigate to `/profile`
3. Should see profile data loaded
4. Try editing and saving

---

## 🧪 Quick Test Commands

### Test 1: Check Backend Accessibility
```powershell
# In PowerShell
Invoke-WebRequest -Uri "http://localhost/userprofile.php" -Method GET
```

### Test 2: Check Session Data (Browser DevTools)
1. Open DevTools (F12)
2. Go to Application → Session Storage
3. Look for 'user' key
4. Should contain: { user_id, email, first_name, last_name, ... }

### Test 3: Check Network Requests
1. Open DevTools → Network tab
2. Navigate to profile page
3. Look for request to `userprofile.php`
4. Should be `GET` method
5. Response should be JSON with `success: true`

---

## 🚨 Common Issues

| Issue | Cause | Solution |
|---|---|---|
| CORS Error | Backend not found | Check backend file location |
| 401 Unauthorized | Not logged in | Sign in first |
| Profile not loading | Session expired | Sign in again |
| Changes not saving | PUT request failing | Check error in console |
| Wrong data shown | Normalization issue | Check field mapping |

---

## ✨ Features Now Enabled

✅ Fetch user profile from backend
✅ Display profile with proper formatting
✅ Edit profile in-place
✅ Save changes to database
✅ Update sessionStorage with new data
✅ Show success/error messages
✅ Support both users and students tables
✅ Data normalization (camelCase ↔ snake_case)
✅ Session-based authentication
✅ Graceful fallbacks if API fails

---

## 📚 Documentation Files

1. **FRONTEND_BACKEND_INTEGRATION.md**
   - Complete architecture overview
   - Detailed data flow for GET and PUT
   - Field mapping table
   - Error handling guide
   - Testing procedures

2. **SETUP_CHECKLIST.md**
   - Step-by-step backend setup
   - Frontend verification
   - Test cases (1-5)
   - Troubleshooting section
   - Verification commands

3. **This File (SUMMARY)**
   - Quick reference
   - Data flow diagram
   - Required files checklist
   - Field mapping reference

---

## 🎬 What Happens Now

### User Journey:

1. **User Logs In**
   ```
   Sign In Page → POST /signin.php → Session created → User data stored in sessionStorage
   ```

2. **User Views Profile**
   ```
   Profile Page → GET /userprofile.php → Backend fetches from users/students table → 
   Frontend normalizes data → UI renders
   ```

3. **User Edits Profile**
   ```
   Click Edit → User changes fields → Click Save → 
   PUT /userprofile.php with new data → Backend validates & updates → 
   Response with updated data → Frontend updates state & sessionStorage
   ```

4. **Database Persists Changes**
   ```
   users/students table → updated_at timestamp set → 
   Profile reflects new data on next load
   ```

---

## 🔐 Security Features

✅ Session-based authentication (no token in local storage)
✅ Input sanitization (sanitizeInput function)
✅ Email validation (validateEmail function)
✅ Phone validation (validatePhone function)
✅ Database prepared statements (no SQL injection)
✅ Credentials included in requests (httpOnly cookies)

---

## 📞 Need Help?

Provide:
1. Browser console error messages
2. Network tab request/response (DevTools)
3. Your `userprofile.php` file
4. Your database schema
5. Your `config/database.php` content

---

**Status: ✅ Ready to Test**

The frontend and backend are now properly integrated. Follow the SETUP_CHECKLIST.md to complete setup and testing!
