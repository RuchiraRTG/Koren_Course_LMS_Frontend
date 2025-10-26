# Fix for "Invalid or expired attemptToken" Error

## Problem
The PHP session is not persisting between `startExam` and `submitAnswers` requests because:
1. Frontend wasn't sending credentials (cookies)
2. Backend CORS might not allow credentials

## ✅ Frontend Fixed
Both `MockExam.jsx` and `TakeExam.jsx` now include:
```javascript
credentials: 'include'
```

## ⚠️ Backend Update Required

You MUST update your `takeExam.php` file to allow credentials in CORS.

**At the TOP of `takeExam.php`, BEFORE any other code, add:**

```php
<?php
// CORS headers for session/cookie support
header('Access-Control-Allow-Origin: http://localhost:5173'); // Your frontend URL
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true'); // THIS IS CRITICAL!

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';

startSecureSession();
header('Content-Type: application/json');
// ... rest of your code
```

## Important Notes:

1. **Replace `http://localhost:5173`** with your actual frontend URL (check your Vite dev server port)
2. **Don't use wildcard `*`** for `Access-Control-Allow-Origin` when using credentials
3. **Must specify exact origin** like `http://localhost:5173` or `http://localhost:3000`

## Alternative: Check Your Frontend Port

Run this command to see your Vite port:
```bash
npm run dev
```

Look for: `Local: http://localhost:XXXX/`

Then use that exact URL in the CORS header.

## Testing After Fix:

1. Clear browser cache and cookies
2. Restart your PHP server
3. Restart your frontend dev server
4. Try the exam flow again

## Why This Happens:

- Sessions use cookies
- Cookies need `credentials: 'include'` in fetch
- Backend must respond with `Access-Control-Allow-Credentials: true`
- Backend must specify exact origin (not `*`)

## Status:
✅ Frontend: Fixed (credentials included)
⚠️ Backend: Needs CORS update with credentials support
