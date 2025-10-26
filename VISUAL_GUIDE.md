# Visual Integration Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    KOREN LMS SYSTEM                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  FRONTEND (React)                             │
│              localhost:5173/profile                          │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          UserProfile.jsx Component                     │ │
│  │                                                        │ │
│  │  State:                                               │ │
│  │  ├─ profileData (loaded from backend)                 │ │
│  │  ├─ editData (edited by user)                         │ │
│  │  ├─ isLoading, error, isEditing                       │ │
│  │                                                        │ │
│  │  Functions:                                           │ │
│  │  ├─ fetchUserProfile()                                │ │
│  │  │  └─ Calls: GET /userprofile.php                    │ │
│  │  │                                                    │ │
│  │  ├─ handleSaveProfile()                               │ │
│  │  │  └─ Calls: PUT /userprofile.php                    │ │
│  │  │                                                    │ │
│  │  └─ handleEditChange()                                │ │
│  │     └─ Updates editData state                         │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         src/config/api.js                             │ │
│  │                                                        │ │
│  │  API_BASE_URL = 'http://localhost'                    │ │
│  │  API_ENDPOINTS.USER_PROFILE = '.../userprofile.php'   │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              │ (credentials: 'include')
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND (PHP)                               │
│              localhost/userprofile.php                       │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Request Router                              │ │
│  │                                                        │ │
│  │  if REQUEST_METHOD == 'GET'                           │ │
│  │    └─> handleGetProfile()                             │ │
│  │                                                        │ │
│  │  if REQUEST_METHOD == 'PUT'                           │ │
│  │    └─> handlePutProfile()                             │ │
│  │                                                        │ │
│  │  if REQUEST_METHOD == 'OPTIONS'                       │ │
│  │    └─> Return 200 (CORS preflight)                    │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                                │
│     ┌────────────────────────┴────────────────────────┐      │
│     │                                                 │      │
│     ▼                                                 ▼      │
│  ┌─────────────────────────┐    ┌──────────────────────┐   │
│  │  GET /userprofile.php   │    │ PUT /userprofile.php │   │
│  │  handleGetProfile()     │    │ handlePutProfile()   │   │
│  │                         │    │                      │   │
│  │ 1. isLoggedIn()? ✓      │    │ 1. isLoggedIn()? ✓   │   │
│  │ 2. Get user_type from   │    │ 2. Validate input    │   │
│  │    $_SESSION            │    │ 3. Update database   │   │
│  │ 3. If student:          │    │ 4. Fetch updated     │   │
│  │    getStudentProfile()  │    │    profile           │   │
│  │    else:                │    │ 5. Return response   │   │
│  │    getUserProfile()     │    │                      │   │
│  │ 4. Return camelCase     │    │                      │   │
│  │    JSON response        │    │                      │   │
│  │                         │    │                      │   │
│  └─────────────────────────┘    └──────────────────────┘   │
│     ├─ Query users table           ├─ Get JSON input      │
│     └─ Query students table        └─ Call updateUser()   │
│                                       or updateStudent()   │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │     Database Connection Layer                         │ │
│  │                                                        │ │
│  │  config/database.php                                  │ │
│  │  ├─ DB_HOST, DB_USER, DB_PASS, DB_NAME               │ │
│  │  └─ getDBConnection()                                 │ │
│  │                                                        │ │
│  │  includes/functions.php                               │ │
│  │  ├─ startSecureSession()                              │ │
│  │  ├─ isLoggedIn()                                      │ │
│  │  ├─ sanitizeInput()                                   │ │
│  │  ├─ validateEmail()                                   │ │
│  │  └─ validatePhone()                                   │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              ▼
┌──────────────────────────────────────────────────────────────┐
│              MySQL Database (koren_lms)                      │
│                                                               │
│  ┌────────────────────────────┐  ┌──────────────────────┐   │
│  │    users table             │  │  students table      │   │
│  │                            │  │                      │   │
│  │ id (PK)                    │  │ id (PK)              │   │
│  │ first_name                 │  │ first_name           │   │
│  │ last_name                  │  │ last_name            │   │
│  │ email                      │  │ email                │   │
│  │ phone_number               │  │ phone                │   │
│  │ nic_number                 │  │ nic_number           │   │
│  │ profile_photo              │  │ batch_number         │   │
│  │ created_at                 │  │ profile_photo        │   │
│  │ updated_at                 │  │ created_at           │   │
│  │ is_active                  │  │ updated_at           │   │
│  │ role                        │  │ is_active            │   │
│  │                            │  │                      │   │
│  └────────────────────────────┘  └──────────────────────┘   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Fetching Profile (GET)

```
┌─────────────────────────────────────────────────────────────┐
│ USER NAVIGATES TO /profile                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ UserProfile.jsx useEffect()                                  │
│ Calls: fetchUserProfile()                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend sends GET request                                   │
│                                                              │
│ fetch('http://localhost/userprofile.php', {                │
│   method: 'GET',                                            │
│   headers: { 'Content-Type': 'application/json' },          │
│   credentials: 'include'  ← Include session cookies         │
│ })                                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend receives GET request to userprofile.php             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ handleGetProfile()                                           │
│                                                              │
│ 1. Check: isLoggedIn() == true                              │
│    ├─ Get $_SESSION['user_id']                              │
│    └─ Get $_SESSION['user_type']                            │
│                                                              │
│ 2. if user_type == 'student'                                │
│    └─> getStudentProfile($conn, $userId)                   │
│       └─ SELECT FROM students WHERE id = ?                  │
│                                                              │
│    else                                                      │
│    └─> getUserProfile($conn, $userId)                      │
│       └─ SELECT FROM users WHERE id = ?                     │
│                                                              │
│ 3. Build response array with camelCase keys:                │
│    {                                                         │
│      'id' => 1,                                              │
│      'firstName' => 'John',  ← From: first_name            │
│      'lastName' => 'Doe',    ← From: last_name             │
│      'email' => 'john@...',                                 │
│      ...                                                     │
│    }                                                         │
│                                                              │
│ 4. Return JSON response                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend Response (JSON):                                     │
│                                                              │
│ {                                                            │
│   "success": true,                                           │
│   "message": "Profile retrieved successfully",               │
│   "data": {                                                  │
│     "id": 1,                                                 │
│     "firstName": "John",                                     │
│     "lastName": "Doe",                                       │
│     "email": "john@example.com",                             │
│     "phone": "0771234567",                                   │
│     "nicNumber": "199512345678",                             │
│     "batchNumber": "BATCH-2024-01",                          │
│     "profilePhoto": "uploads/...",                           │
│     "userType": "student",                                   │
│     "role": "student",                                       │
│     "createdAt": "2025-10-15 20:53:48",                      │
│     "updatedAt": "2025-10-15 21:01:51",                      │
│     "isActive": true                                         │
│   }                                                          │
│ }                                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend receives response                                   │
│                                                              │
│ 1. Check: data.success == true                              │
│                                                              │
│ 2. Normalize data: camelCase → snake_case                   │
│    const normalizedData = {                                  │
│      id: 1,                                                  │
│      first_name: 'John',      ← From: firstName            │
│      last_name: 'Doe',        ← From: lastName             │
│      email: 'john@...',                                      │
│      phone: '0771234567',     ← From: phone               │
│      nic_number: '199512345678', ← From: nicNumber         │
│      batch_number: 'BATCH-01',   ← From: batchNumber       │
│      ...                                                     │
│    }                                                         │
│                                                              │
│ 3. Update component state:                                  │
│    setProfileData(normalizedData)                            │
│    setEditData(normalizedData)                               │
│                                                              │
│ 4. Component re-renders with profile data                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ User sees Profile Page with:                                 │
│ - First Name: John                                           │
│ - Last Name: Doe                                             │
│ - Email: john@example.com                                    │
│ - Phone: 0771234567                                          │
│ - NIC: 199512345678                                          │
│ - Batch: BATCH-2024-01                                       │
│                                                              │
│ Ready to edit or navigate away                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Updating Profile (PUT)

```
┌─────────────────────────────────────────────────────────────┐
│ USER CLICKS "EDIT PROFILE"                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ UI switches to edit mode (isEditing = true)                 │
│ Form fields become editable                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ USER MAKES CHANGES                                           │
│ e.g., changes first name from "John" to "Johnny"            │
│                                                              │
│ handleEditChange() updates editData state:                   │
│ editData = {                                                 │
│   ...previous data...,                                       │
│   first_name: 'Johnny'                                       │
│ }                                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ USER CLICKS "SAVE CHANGES"                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Calls: handleSaveProfile()                                   │
│                                                              │
│ 1. Convert snake_case → camelCase:                           │
│    const updatePayload = {                                   │
│      firstName: editData.first_name,   ← 'Johnny'           │
│      lastName: editData.last_name,                           │
│      email: editData.email,                                  │
│      phone: editData.phone                                   │
│    }                                                         │
│                                                              │
│ 2. Send PUT request with payload:                            │
│    fetch('http://localhost/userprofile.php', {              │
│      method: 'PUT',                                          │
│      headers: { 'Content-Type': 'application/json' },        │
│      credentials: 'include',                                 │
│      body: JSON.stringify(updatePayload)                     │
│    })                                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend receives PUT request                                 │
│ Body:                                                        │
│ {                                                            │
│   "firstName": "Johnny",                                     │
│   "lastName": "Doe",                                         │
│   "email": "john@example.com",                               │
│   "phone": "0771234567"                                      │
│ }                                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ handlePutProfile()                                           │
│                                                              │
│ 1. Check: isLoggedIn() == true                              │
│                                                              │
│ 2. Parse JSON input:                                         │
│    $input = json_decode(file_get_contents(...))              │
│    {                                                         │
│      'firstName' => 'Johnny',                                │
│      'lastName' => 'Doe',                                    │
│      ...                                                     │
│    }                                                         │
│                                                              │
│ 3. Validate input:                                           │
│    validateProfileUpdate($input)                             │
│    ├─ Validate email format                                  │
│    ├─ Validate phone format                                  │
│    └─ Return errors array                                    │
│                                                              │
│ 4. Get user_type from $_SESSION                              │
│                                                              │
│ 5. Call update function:                                     │
│    if user_type == 'student'                                 │
│    └─> updateStudentProfile($conn, $userId, $input)         │
│        UPDATE students SET                                   │
│        first_name = 'Johnny',  ← From: firstName            │
│        last_name = 'Doe',      ← From: lastName             │
│        email = '...',                                        │
│        phone = '...',          ← From: phone                │
│        updated_at = NOW()                                    │
│        WHERE id = $userId                                    │
│                                                              │
│ 6. Fetch updated profile:                                    │
│    $profileData = getStudentProfile($conn, $userId)          │
│                                                              │
│ 7. Return updated profile (camelCase)                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend Response (JSON):                                     │
│                                                              │
│ {                                                            │
│   "success": true,                                           │
│   "message": "Profile updated successfully",                 │
│   "data": {                                                  │
│     "id": 1,                                                 │
│     "firstName": "Johnny",   ← Updated!                     │
│     "lastName": "Doe",                                       │
│     "email": "john@example.com",                             │
│     ...                                                      │
│     "updatedAt": "2025-10-15 21:10:30"  ← New timestamp    │
│   }                                                          │
│ }                                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend receives response                                   │
│                                                              │
│ 1. Check: data.success == true                              │
│                                                              │
│ 2. Normalize response (camelCase → snake_case)               │
│                                                              │
│ 3. Update component state:                                  │
│    setProfileData(normalizedData)  ← Shows new data         │
│    setEditData(normalizedData)                               │
│                                                              │
│ 4. Exit edit mode:                                           │
│    setIsEditing(false)                                       │
│                                                              │
│ 5. Update sessionStorage:                                    │
│    sessionStorage.setItem('user',                            │
│      JSON.stringify(normalizedData)                          │
│    )                                                         │
│                                                              │
│ 6. Show success message                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ User sees updated profile:                                   │
│                                                              │
│ ✓ First Name: Johnny (UPDATED!)                             │
│ ✓ Last Name: Doe                                             │
│ ✓ Email: john@example.com                                    │
│ ✓ Phone: 0771234567                                          │
│                                                              │
│ Profile saved successfully to database!                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ ✅ DATABASE UPDATED                                          │
│                                                              │
│ students table row with id=1:                                │
│ first_name: 'Johnny' (changed from 'John')                  │
│ updated_at: 2025-10-15 21:10:30 (updated timestamp)         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
If something goes wrong at any step:

┌────────────────────────────────────────┐
│ Frontend catch() block triggered        │
│ or data.success === false               │
└────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ Check error type:     │
        └───────────────────────┘
         /            │            \
        /             │             \
       ▼              ▼              ▼
  CORS Error      401 Error      Validation Error
       │              │              │
       ▼              ▼              ▼
 Backend not   Not logged     Invalid input
   running       in (session   (email/phone)
                 expired)
       │              │              │
       └──────────────┴──────────────┘
                    │
                    ▼
      ┌─────────────────────────────┐
      │ setError() displays message  │
      │ Fallback to stored data      │
      │ (graceful degradation)       │
      └─────────────────────────────┘
```

---

## Session Flow

```
┌─────────────────────────────────────────────────┐
│ USER SIGNS IN                                    │
└─────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────┐
    │ POST /signin.php                 │
    │ Credentials: { email, password } │
    └──────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────┐
    │ Backend creates session:         │
    │                                  │
    │ $_SESSION['user_id'] = 1         │
    │ $_SESSION['user_email'] = '...'  │
    │ $_SESSION['user_type'] = 'stud'  │
    │ $_SESSION['user_role'] = 'stud'  │
    │ $_SESSION['user_name'] = 'John'  │
    │                                  │
    │ PHPSESSID cookie sent to client  │
    └──────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────┐
    │ Frontend stores user data in:    │
    │ sessionStorage.setItem('user',   │
    │   JSON.stringify(userData)       │
    │ )                                │
    └──────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────┐
    │ User navigates to /profile       │
    │                                  │
    │ GET /userprofile.php             │
    │                                  │
    │ Browser sends:                   │
    │ - PHPSESSID cookie (from login)  │
    │ - credentials: 'include'         │
    │                                  │
    │ Backend receives:                │
    │ - Session is active              │
    │ - user_id and user_type available│
    │ - Query appropriate table        │
    │                                  │
    └──────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────┐
    │ ✓ Profile loaded successfully    │
    └──────────────────────────────────┘
```

---

## Component Render Lifecycle

```
┌─────────────────────────────────────┐
│ Component Mounts                     │
│ useEffect() triggered               │
└─────────────────────────────────────┘
                 │
                 ▼
    ┌───────────────────────────┐
    │ fetchUserProfile()        │
    │ setIsLoading(true)        │
    │ GET /userprofile.php      │
    └───────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
       ▼                 ▼
   Success            Error
        │                 │
        ▼                 ▼
  setProfileData    setError()
  setEditData       Fallback data
        │                 │
        └────────┬────────┘
                 │
                 ▼
      setIsLoading(false)
                 │
                 ▼
      ┌──────────────────────┐
      │ Component Re-renders  │
      │                      │
      │ if (!profileData)    │
      │   Show loading       │
      │   or error message   │
      │                      │
      │ else                 │
      │   Show profile UI    │
      │                      │
      └──────────────────────┘
```

---

This visual guide should help understand how all the pieces fit together!
