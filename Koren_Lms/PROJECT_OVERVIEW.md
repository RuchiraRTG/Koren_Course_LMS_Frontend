# Korean LMS Project Overview

## Purpose
A full-featured Learning Management System for Korean language courses, supporting admin, student, exam, question, and course management.

---

## Main Pages & Features

### 1. **Dashboard**
- Overview of system stats, quick links, and recent activity.
- Role-based: Admin sees system-wide stats, students see their own progress.

### 2. **Students**
- List, add, edit, and delete students.
- View student profiles, exam history, and progress.

### 3. **Courses**
- Manage courses: create, edit, delete, assign students.
- Course details: syllabus, enrolled students, related exams.

### 4. **Questions**
- Create/manage quiz questions (MCQ & Voice).
- Add options, correct answers, images, audio links, time limits, difficulty, and category.
- Edit and delete questions.
- Search/filter by text, category, difficulty, type.

### 5. **Exams**
- Create exams: select questions, set time, assign to courses/students.
- View exam results, statistics, and analytics.
- Manage exam attempts and grading.

### 6. **Settings**
- System configuration, user management, roles, and permissions.

---

## Data Flow & Architecture
- **Frontend:** React (Vite), Tailwind CSS, modular components.
- **Backend:** PHP (REST API), MySQL database.
- **API:** All CRUD operations for users, courses, questions, exams.
- **Authentication:** Session-based, role-aware.

---

## How to Fill Each Page

### **Dashboard**
- Show summary cards (total students, courses, exams, recent activity)
- Quick links to main actions
- Recent logins, exam results, or new questions

### **Students**
- Table of students (name, email, status)
- Add/Edit form (profile info, course assignment)
- View student details (progress, exam history)

### **Courses**
- Table of courses (name, description, enrolled count)
- Add/Edit form (course info, syllabus)
- Assign students to courses
- View course details (students, exams)

### **Questions**
- List of questions (search/filter)
- Add/Edit modal (all fields: text, type, options, correct answers, images, audio, etc.)
- Show correct answers, difficulty, category
- Delete/edit actions

### **Exams**
- List of exams (name, course, date, status)
- Add/Edit exam (select questions, assign students/courses, set time)
- View results (student scores, analytics)
- Manage attempts (retake, grade)

### **Settings**
- User management (add/edit/delete users, assign roles)
- System config (API keys, email settings, etc.)
- Permissions (who can do what)

---

## Best Practices
- Use modular React components for forms, tables, modals.
- Validate all inputs (frontend and backend).
- Use API endpoints for all CRUD actions.
- Handle errors and show user-friendly messages.
- Keep UI clean and responsive.
- Use role-based access for admin/student features.

---

## Getting Started
1. Start backend server (XAMPP/WAMP)
2. Start frontend (npm run dev)
3. Configure API URLs if needed
4. Log in as admin to access all features
5. Add students, courses, questions, exams as needed

---

## Troubleshooting
- If you see network errors, check backend server and API URLs.
- If you see PHP errors, check column names and database structure.
- Use browser DevTools and PHP error logs for debugging.

---

## Contact
For help, contact the project maintainer or check the README for support links.

---

**This file replaces all previous .md documentation files.**