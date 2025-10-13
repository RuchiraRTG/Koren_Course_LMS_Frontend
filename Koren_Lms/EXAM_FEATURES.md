# Exam Management System - Feature Documentation

## Overview
The Exam Management System allows administrators to create, manage, and configure comprehensive exams with MCQ and Voice-based questions for the Korean Language Learning Management System.

## Features Implemented

### 1. **Exam Creation**
Admins can create exams with the following configurations:

#### Basic Information
- **Exam Name**: Descriptive name for the exam (e.g., "Korean Language Test - Level 1")
- **Description**: Brief description of the exam purpose and content
- **Exam Type**: Select the type of questions allowed in the exam **(Required)**
  - **MCQ & Voice Questions**: Exam can include both MCQ and Voice questions
  - **MCQ Questions Only**: Exam will only contain MCQ questions
  - **Voice Questions Only**: Exam will only contain Voice questions

#### Exam Configuration
- **Duration**: Select exam time limit
  - 30 Minutes
  - 1 Hour
  - 2 Hours

- **Number of Questions**: Total questions in the exam
  - 20 Questions
  - 40 Questions
  - 60 Questions

- **Total Marks**: Overall marks for the exam (custom number input)

### 2. **Question Selection**
- **Mixed Question Types**: Select from both MCQ and Voice questions (or filtered by exam type)
- **Exam Type Filtering**: Questions are automatically filtered based on selected exam type
  - MCQ Only exams: Only MCQ questions shown
  - Voice Only exams: Only Voice questions shown
  - Both: All questions shown
- **Question Bank Integration**: Choose questions from the existing question bank
- **Visual Selection Interface**: 
  - Checkbox-based selection
  - Shows question text, type (MCQ/Voice), and category
  - Displays selection count vs. maximum allowed
  - Automatic MCQ and Voice question counting
- **Selection Limit**: Cannot select more questions than the configured number

### 3. **Student Eligibility**
Two methods to assign exams to students:

#### A. By Batch
- Select entire batch of students
- All students in the selected batch become eligible
- Shows total student count in batch

#### B. Individual Students
- Select specific students one by one
- **Search Functionality**: Search students by name or email
- Checkbox-based multi-select interface
- Shows student name, email, and batch
- Displays count of selected students
- Real-time search filtering

### 4. **Exam List & Management**
- **View All Exams**: Grid/card view of all created exams
- **Search Functionality**: Search exams by name
- **Exam Details Display**:
  - Exam name and description
  - Duration badge with clock icon
  - Number of questions badge
  - Total marks badge
  - Question type breakdown (MCQ count + Voice count)
  - Eligible students (batch name or individual student names)
- **Edit Exams**: Modify existing exam configurations
- **Delete Exams**: Remove exams with confirmation

## User Interface Components

### Exam Creation Modal
Large modal with scrollable content including:
- Form fields for exam details
- Collapsible question selector
- Student eligibility options
- Real-time validation and feedback

### Exam Cards
Color-coded badges showing:
- **Exam Type**: Teal (MCQ & Voice), Blue (MCQ Only), Purple (Voice Only)
- **Duration**: Blue badge with clock icon
- **Questions**: Green badge with document icon
- **Marks**: Purple badge with award icon
- **Student Eligibility**: User icon with batch/student info

## Data Structure

### Exam Object
```javascript
{
  id: number,
  examName: string,
  description: string,
  examType: 'mcq' | 'voice' | 'both', // Type of questions allowed
  duration: '30' | '60' | '120', // minutes
  numberOfQuestions: '20' | '40' | '60',
  totalMarks: number,
  eligibilityType: 'batch' | 'individual',
  selectedBatch: string, // if eligibilityType === 'batch'
  selectedStudents: number[], // if eligibilityType === 'individual'
  selectedQuestions: number[], // array of question IDs
  mcqCount: number, // count of MCQ questions
  voiceCount: number, // count of Voice questions
  createdAt: string // ISO timestamp
}
```

## Validation Rules

1. **Exam Name**: Required field
2. **Exam Type**: Required - must select MCQ Only, Voice Only, or Both
3. **Duration**: Must select one of the predefined options
4. **Number of Questions**: Must select one of the predefined options
5. **Total Marks**: Required, must be a positive number
6. **Questions**: 
   - Must select at least 1 question
   - Cannot exceed the configured number of questions
   - Questions automatically filtered by exam type
7. **Student Eligibility**:
   - If "By Batch": Must select a batch
   - If "Individual": Must select at least one student

## How to Use

### Creating an Exam

1. **Navigate to Exams**: Click "Exams" in the admin sidebar
2. **Click "Create Exam"** button
3. **Fill Exam Details**:
   - Enter exam name (required)
   - Add description (optional)
   - **Select exam type** (required): MCQ Only, Voice Only, or Both
   - Select duration (required)
   - Select number of questions (required)
   - Enter total marks (required)

4. **Select Questions**:
   - Click "Show Questions" to expand question selector
   - Questions are automatically filtered based on your exam type selection
   - Check boxes next to desired questions
   - Monitor the selection count
   - System automatically counts MCQ vs. Voice questions

5. **Configure Student Eligibility**:
   - Choose "By Batch" or "Individual Students"
   - **If By Batch**: Select batch from dropdown
   - **If Individual**: 
     - Use the search box to find students by name or email
     - Check students from the filtered list

6. **Submit**: Click "Create Exam"

### Editing an Exam

1. **Find the Exam**: Use search or scroll through exam list
2. **Click Edit Icon** (pencil icon on exam card)
3. **Modify Details**: Update any fields in the modal
4. **Save Changes**: Click "Update Exam"

### Deleting an Exam

1. **Click Delete Icon** (trash icon on exam card)
2. **Confirm Deletion** in the confirmation dialog

## Integration Notes

### Frontend Only (Current Implementation)
- All data stored in component state
- Sample data for questions and students
- No backend API calls yet

### Backend Integration (Future)
To integrate with backend:

1. **Fetch Questions**: Replace `availableQuestions` with API call to `/api/questions`
2. **Fetch Students**: Replace `availableStudents` with API call to `/api/students`
3. **Create Exam**: POST to `/api/exams` on form submit
4. **Update Exam**: PUT to `/api/exams/:id`
5. **Delete Exam**: DELETE to `/api/exams/:id`
6. **List Exams**: GET from `/api/exams`

### Recommended API Endpoints
```
GET    /api/exams              - List all exams
POST   /api/exams              - Create new exam
GET    /api/exams/:id          - Get single exam
PUT    /api/exams/:id          - Update exam
DELETE /api/exams/:id          - Delete exam
GET    /api/questions          - Get all questions
GET    /api/students           - Get all students
GET    /api/students/batches   - Get unique batches
```

## Navigation

### Admin Dashboard Menu
- **Location**: Admin sidebar
- **Icon**: ClipboardList (checklist icon)
- **Route**: `/admin/exams`
- **Order**: After Questions, before Settings

## Future Enhancements (Suggestions)

1. **Exam Scheduling**:
   - Start date/time
   - End date/time
   - Automatic exam activation/deactivation

2. **Advanced Question Selection**:
   - Filter by difficulty, category, type
   - Random question selection
   - Question pool with auto-selection

3. **Exam Settings**:
   - Shuffle questions
   - Shuffle answer options
   - Show/hide results immediately
   - Allow review after submission
   - Negative marking

4. **Student View**:
   - List of available exams for students
   - Exam taking interface
   - Timer countdown
   - Auto-submit on time expiry

5. **Results & Analytics**:
   - Automatic grading system
   - Result publication after waiting time
   - Student performance analytics
   - Leaderboard
   - Export results to CSV/PDF

6. **Notifications**:
   - Email notifications to eligible students
   - Reminder notifications before exam
   - Result publication notifications

7. **Exam Templates**:
   - Save exam configurations as templates
   - Reuse templates for future exams

8. **Bulk Operations**:
   - Duplicate exams
   - Archive old exams
   - Bulk student assignment

## Notes

- Currently uses sample/mock data for questions and students
- All exam data is stored in component state (not persistent)
- Marks field is prepared for future backend integration where actual scoring will be calculated
- Student batches are extracted from student data automatically
- Question type counting (MCQ/Voice) is automatic based on selected questions

## Related Pages

- **Questions** (`/admin/questions`): Manage the question bank
- **Students** (`/admin/students`): Manage student records and batches
- **Dashboard** (`/admin`): Overview and statistics
