# Frontend-Backend Integration Guide: User Profile

## Overview

This document explains how the frontend (`UserProfile.jsx`) connects to the backend (`userprofile.php`) to fetch and update user profile data.

## Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React)                 │
│    localhost:5173/profile                │
│                                          │
│  ┌─────────────────────────────────────┐│
│  │      UserProfile.jsx                 ││
│  │  - Fetches user profile data         ││
│  │  - Displays profile information      ││
│  │  - Handles profile edits             ││
│  │  - Sends updates to backend          ││
│  └─────────────────────────────────────┘│
└──────────────┬──────────────────────────┘
               │
               │ HTTP Requests (GET, PUT)
               │ CORS: credentials: 'include'
               │
               ▼
┌─────────────────────────────────────────┐
│       Backend (PHP)                      │
│    localhost/userprofile.php             │
│                                          │
│  ┌─────────────────────────────────────┐│
│  │   GET: Fetch Profile                 ││
│  │   - Checks session authentication    ││
│  │   - Queries users or students table  ││
│  │   - Returns camelCase JSON response  ││
│  │                                      ││
│  │   PUT: Update Profile                ││
│  │   - Validates input data             ││
│  │   - Updates database record          ││
│  │   - Returns updated profile          ││
│  └─────────────────────────────────────┘│
└──────────────┬──────────────────────────┘
               │
               │ Database Queries
               │
               ▼
┌─────────────────────────────────────────┐
│       MySQL Database                     │
│    koren_lms                             │
│                                          │
│  - users table                           │
│  - students table                        │
└─────────────────────────────────────────┘
```

## Data Flow

### 1. Fetching User Profile (GET)

#### Frontend Request
```javascript
// UserProfile.jsx - fetchUserProfile()
const response = await fetch('http://localhost/userprofile.php', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include'  // Include session cookies
});
```

#### Backend Processing (userprofile.php - handleGetProfile)
1. Checks if user is logged in via session
2. Gets `user_id` and `user_type` from `$_SESSION`
3. Queries appropriate table:
   - If `user_type === 'student'` → Query `students` table
   - Otherwise → Query `users` table
4. Returns profile data in camelCase format

#### Backend Response
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "0771234567",
    "nicNumber": "199512345678",
    "batchNumber": "BATCH-2024-01",
    "profilePhoto": "uploads/images/profiles/profile_1_1234567890.jpg",
    "userType": "student",
    "role": "student",
    "createdAt": "2025-10-15 20:53:48",
    "updatedAt": "2025-10-15 21:01:51",
    "isActive": true
  }
}
```

#### Frontend Processing
1. Receives response and validates `success` flag
2. **Normalizes** camelCase → snake_case:
   ```javascript
   const normalizedData = {
     id: data.data.id,
     first_name: data.data.firstName,
     last_name: data.data.lastName,
     email: data.data.email,
     phone: data.data.phone,
     nic_number: data.data.nicNumber,
     // ... etc
   };
   ```
3. Updates component state
4. Renders profile UI with normalized data

---

### 2. Updating User Profile (PUT)

#### Frontend Request
```javascript
// UserProfile.jsx - handleSaveProfile()
const updatePayload = {
  firstName: editData.first_name,
  lastName: editData.last_name,
  email: editData.email,
  phone: editData.phone
};

const response = await fetch('http://localhost/userprofile.php', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(updatePayload)
});
```

#### Backend Processing (userprofile.php - handlePutProfile)
1. Checks if user is logged in
2. Gets JSON input from request body
3. Validates input data:
   - Email format validation
   - Phone format validation
4. Updates appropriate table based on `user_type`
5. Sets `updated_at` timestamp
6. Fetches and returns updated profile

#### Backend Response
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe Updated",
    "email": "john.updated@example.com",
    "phone": "0771234568",
    "nicNumber": "199512345678",
    "batchNumber": "BATCH-2024-01",
    "profilePhoto": "uploads/images/profiles/profile_1_1234567890.jpg",
    "userType": "student",
    "role": "student",
    "createdAt": "2025-10-15 20:53:48",
    "updatedAt": "2025-10-15 21:05:30",
    "isActive": true
  }
}
```

#### Frontend Processing
1. Normalizes response data (camelCase → snake_case)
2. Updates component state
3. Exits edit mode
4. Updates sessionStorage with new data
5. Displays success feedback

---

## Field Mapping

### Database → Backend Response → Frontend State

| Database Table | Backend Field | Backend Response | Frontend State |
|---|---|---|---|
| first_name | first_name | firstName | first_name |
| last_name | last_name | lastName | last_name |
| email | email | email | email |
| phone / phone_number | phone | phone | phone |
| nic_number | nic_number | nicNumber | nic_number |
| batch_number | batch_number | batchNumber | batch_number |
| profile_photo | profile_photo | profilePhoto | profile_photo |
| created_at | created_at | createdAt | created_at |
| updated_at | updated_at | updatedAt | updated_at |
| is_active | is_active | isActive | is_active |
| role | role | role | role |

---

## Setup Instructions

### Step 1: Backend Setup
1. Copy `userprofile.php` to your web server root:
   - XAMPP: `C:\xampp\htdocs\`
   - WAMP: `C:\wamp\www\`
   - Other: Your web server's document root

2. Ensure `config/database.php` is in the same directory with database credentials

3. Ensure `includes/functions.php` exists with:
   - `startSecureSession()` function
   - `isLoggedIn()` function
   - `sanitizeInput()` function
   - `validateEmail()` function
   - `validatePhone()` function

### Step 2: Frontend Setup
1. Ensure `UserProfile.jsx` is in `src/pages/`
2. Check that `src/config/api.js` includes `USER_PROFILE` endpoint
3. Verify session data is stored in `sessionStorage` with `'user'` key containing:
   ```javascript
   {
     user_id: 1,
     email: "user@example.com",
     // ... other user data
   }
   ```

### Step 3: Database Requirements

#### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20),
    nic_number VARCHAR(20),
    profile_photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active TINYINT(1) DEFAULT 1,
    role VARCHAR(20) DEFAULT 'user'
);
```

#### Students Table
```sql
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    nic_number VARCHAR(20),
    batch_number VARCHAR(50),
    profile_photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active TINYINT(1) DEFAULT 1
);
```

---

## Error Handling

### Frontend Error Cases

| Error | Cause | Solution |
|---|---|---|
| "Unauthorized" (401) | User not logged in | Redirect to sign-in |
| "Profile not found" (404) | User record missing | Contact support |
| CORS error | Backend not accessible | Verify backend URL and CORS headers |
| "Invalid email format" | Email validation failed | Correct email format |
| "Invalid phone number format" | Phone validation failed | Use Sri Lankan format (07XXXXXXXX) |

### Backend Error Responses

```json
{
  "success": false,
  "message": "Error message here",
  "errors": ["Error 1", "Error 2"]
}
```

---

## Session Management

### Session Variables Set by Backend
When user logs in via `signin.php`:
```php
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_email'] = $user['email'];
$_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
$_SESSION['user_role'] = $user['role'];
$_SESSION['user_type'] = 'student' or 'user';
```

### Session Check
`userprofile.php` verifies:
1. Session is started
2. `user_id` exists in session
3. User is logged in via `isLoggedIn()` check

---

## Testing

### Test 1: Fetch Profile
```bash
curl -X GET http://localhost/userprofile.php \
  -H "Content-Type: application/json" \
  -b "PHPSESSID=your_session_id"
```

### Test 2: Update Profile
```bash
curl -X PUT http://localhost/userprofile.php \
  -H "Content-Type: application/json" \
  -b "PHPSESSID=your_session_id" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "0771234567"
  }'
```

---

## Troubleshooting

### CORS Errors
**Problem**: Cross-origin request blocked
**Solution**:
1. Verify CORS headers in `userprofile.php`:
   ```php
   header('Access-Control-Allow-Origin: *');
   header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
   header('Access-Control-Allow-Headers: Content-Type');
   ```
2. Ensure credentials are included in fetch request

### Session Not Found (401)
**Problem**: Backend returns "Unauthorized"
**Solution**:
1. User must be logged in first via `signin.php`
2. Verify session data is stored correctly
3. Check that session cookies are included (`credentials: 'include'`)

### Profile Data Not Updating
**Problem**: Changes don't persist
**Solution**:
1. Check browser console for error messages
2. Verify user has edit permissions
3. Check database credentials in `config/database.php`
4. Verify appropriate table has necessary columns

### "Profile photo column not found"
**Problem**: Upload fails
**Solution**:
1. Backend automatically adds column if missing
2. If error persists, manually add column:
   ```sql
   ALTER TABLE users ADD COLUMN profile_photo VARCHAR(255);
   ALTER TABLE students ADD COLUMN profile_photo VARCHAR(255);
   ```

---

## API Documentation

### GET /userprofile.php
Fetches the logged-in user's profile

**Requirements**:
- User must be authenticated (session must exist)
- Valid session ID in cookies

**Response**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": { /* profile object */ }
}
```

### PUT /userprofile.php
Updates the logged-in user's profile

**Requirements**:
- User must be authenticated
- Valid JSON body with profile fields

**Request Body**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated profile object */ }
}
```

---

## Key Features

✅ Dual database table support (users and students)
✅ Session-based authentication
✅ Input validation and sanitization
✅ Field normalization (camelCase ↔ snake_case)
✅ Automatic column creation if missing
✅ Profile photo upload support
✅ Comprehensive error handling
✅ CORS support for development

---

## Files Involved

| File | Purpose | Location |
|---|---|---|
| `UserProfile.jsx` | Frontend component | `/src/pages/` |
| `userprofile.php` | Backend API | Web server root |
| `config/database.php` | Database connection | Web server root |
| `includes/functions.php` | Helper functions | Web server root |
| `api.js` | API configuration | `/src/config/` |

