# Backend Update - Add These Lines to takeExam.php

## Find Your Frontend Port First

Check your terminal where Vite is running. You'll see something like:
```
  ➜  Local:   http://localhost:5173/
```

The port is usually **5173** but could be different.

---

## Update takeExam.php

**Replace the FIRST few lines of your `takeExam.php` with this:**

```php
<?php
// IMPORTANT: CORS headers for session/cookie support
header('Access-Control-Allow-Origin: http://localhost:5173'); // ⚠️ CHANGE PORT IF NEEDED
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true'); // ⚠️ THIS LINE IS CRITICAL!

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';

startSecureSession();
header('Content-Type: application/json');

// ... rest of your existing code continues below
```

---

## What Changed?

### Before (Your Current Code):
```php
<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';
startSecureSession();
header('Content-Type: application/json');
```

### After (New Code):
```php
<?php
// CORS headers first
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true'); // NEW LINE!

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';
startSecureSession();
header('Content-Type: application/json');
```

---

## ⚠️ Critical Points

1. **CORS headers MUST be at the very top** (before any `require` statements)
2. **Change `http://localhost:5173`** to match YOUR frontend URL
3. **Don't use `*`** - must be exact origin when using credentials
4. **The line `Access-Control-Allow-Credentials: true` is mandatory**

---

## After Making Changes

1. **Save** takeExam.php
2. **Clear browser cookies** (F12 → Application → Cookies → Delete all)
3. **Restart PHP server** if using built-in server
4. **Refresh your browser** (Ctrl+Shift+R for hard refresh)
5. **Try the exam again**

---

## Still Not Working?

### Check Session in PHP:
Add this debug line after `startSecureSession();`:
```php
error_log("Session ID: " . session_id());
error_log("Session Data: " . print_r($_SESSION, true));
```

### Check Console:
Open browser DevTools (F12) → Network tab → Look for:
- Request to `startExam` - Should set cookies
- Request to `submitAnswers` - Should send cookies

### Common Issues:
- ❌ Wrong port number in CORS header
- ❌ Using `*` instead of exact origin
- ❌ Missing `Access-Control-Allow-Credentials: true`
- ❌ CORS headers not at the top of file
- ❌ Browser blocking third-party cookies (check browser settings)
