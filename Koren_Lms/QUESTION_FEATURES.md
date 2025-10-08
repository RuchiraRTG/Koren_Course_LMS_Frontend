# Question Management System - Feature Documentation

## Overview
The enhanced Question Bank now supports comprehensive question creation with multiple question types, formats, and answer options for the Korean Language Learning Management System.

## Features Implemented

### 1. **Question Types**
- **MCQ (Multiple Choice Questions)**
  - Normal text-based questions
  - Image-based questions with image upload
- **Voice Questions**
  - Audio/voice link integration
  - Support for external audio URLs

### 2. **MCQ Question Formats**
- **Normal**: Traditional text-based questions
- **Image**: Questions that include an uploaded image

### 3. **Answer Configuration**
- **Answer Type**:
  - **Single Choice**: Only one correct answer (radio buttons)
  - **Multiple Choice**: Multiple correct answers allowed (checkboxes)
- **4 Answer Options**: Each question has exactly 4 answer choices
- **Image Answers**: Each answer option can optionally include an image

### 4. **Time Management**
- Custom time limit for each question (5-300 seconds)
- Time displayed with clock icon in question cards
- Helps control quiz pacing and difficulty

### 5. **Question Metadata**
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Categories**: Custom categories (e.g., Grammar, Vocabulary, Listening)
- **Question Description**: Detailed text description of the question

## Component Structure

### New Components Created

#### 1. **ImageUpload.jsx** (`src/components/ImageUpload.jsx`)
- Reusable image upload component
- Features:
  - Click-to-upload interface
  - Image preview
  - Remove image functionality
  - Supports PNG, JPG, GIF formats
  - Base64 encoding for easy storage

#### 2. **AudioUpload.jsx** (`src/components/AudioUpload.jsx`)
- Audio link input component
- Features:
  - URL input for audio links
  - Visual confirmation of added audio
  - Remove link functionality
  - Supports external audio hosting

### Updated Files

#### **Questions.jsx** (`src/pages/Questions.jsx`)
Enhanced with:
- New form structure for multiple question types
- Dynamic form fields based on question type
- Image upload integration for questions and answers
- Audio link management for voice questions
- Improved validation
- Enhanced question display cards with badges and indicators

## How to Use

### Creating an MCQ Question

1. **Click "Add Question"** button
2. **Select Question Type**: Choose "MCQ (Multiple Choice Question)"
3. **Select Question Format**: 
   - Choose "Normal (Text)" for text-only questions
   - Choose "Image Question" to include an image with the question
4. **Enter Question Description**: Write your question text
5. **Upload Question Image** (if Image format selected)
6. **Select Answer Type**:
   - "Single Choice" for one correct answer
   - "Multiple Choice" for multiple correct answers
7. **Set Difficulty & Category**
8. **Set Time Limit** (in seconds)
9. **Enter 4 Answer Options**:
   - Type text for each option
   - Optionally upload an image for each option
   - Check the box/radio to mark correct answer(s)
10. **Click "Add Question"**

### Creating a Voice Question

1. **Click "Add Question"** button
2. **Select Question Type**: Choose "Voice Question"
3. **Enter Question Description**: Provide context for the audio
4. **Enter Audio Link**: Paste the URL of your audio file
5. **Select Answer Type**: Single or Multiple Choice
6. **Set Difficulty & Category**
7. **Set Time Limit** (in seconds)
8. **Enter 4 Answer Options** with correct answer(s)
9. **Click "Add Question"**

## Visual Indicators

Questions display with color-coded badges:
- **Difficulty**: Green (Beginner), Yellow (Intermediate), Red (Advanced)
- **Question Type**: Blue (MCQ), Purple (Voice)
- **Image Question**: Green badge with image icon
- **Answer Type**: Orange (Single/Multiple Choice)
- **Time Limit**: Gray badge with clock icon

## Data Structure

### Question Object Structure
```javascript
{
  id: number,
  questionText: string,
  questionType: 'mcq' | 'voice',
  questionFormat: 'normal' | 'image',
  questionImage: string | null, // Base64 image data
  answerType: 'single' | 'multiple',
  options: [
    { text: string, image: string | null },
    { text: string, image: string | null },
    { text: string, image: string | null },
    { text: string, image: string | null }
  ],
  correctAnswers: number[], // Array of indices
  audioLink: string,
  timeLimit: number, // seconds
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  category: string
}
```

## Future Enhancements (Suggestions)

1. **Backend Integration**: Connect to API for persistent storage
2. **Bulk Import**: CSV/Excel import for questions
3. **Question Bank**: Group questions into question banks/pools
4. **Preview Mode**: Preview how students will see questions
5. **Statistics**: Track question performance and difficulty
6. **Audio Upload**: Direct audio file upload instead of links only
7. **Rich Text Editor**: Format questions with bold, italic, etc.
8. **Question Duplication**: Clone existing questions
9. **Tags System**: Multiple tags per question for better organization

## Notes

- All image uploads are converted to Base64 for easy handling
- Currently stores data in component state (not persistent)
- Time limits can be set between 5-300 seconds
- All fields marked with * are required
- Search functionality works across question text, category, and difficulty
