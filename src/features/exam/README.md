# Exam Feature Documentation

## Overview
The Exam feature manages exam creation, retrieval, and student marks management.

## Files
- `examSlice.js` - Redux slice for exam state management
- `examAction.js` - Async actions for exam operations

## State Properties

### Exam Creation
- `loadingExam` - Boolean for exam creation loading state
- `errorExam` - General exam creation error
- `errorExamTitle` - Title validation error
- `errorExamTotalMark` - Total mark validation error

### Exam Retrieval
- `loadingGetExam` - Boolean for exam fetching loading state
- `errorGetExam` - Exam fetch error
- `exam` - Current exam object

### Marks Management
- `loadingAddMarks` - Boolean for bulk marks addition
- `errorAddMarks` - Bulk marks addition error
- `loadingUpdateMark` - Boolean for single mark update
- `errorUpdateMark` - Single mark update error
- `successUpdateMark` - Success message for mark update

## Actions

### `createExam(examData)`
**Type:** Async Thunk  
**Endpoint:** POST `/exam/createExam`  
**Purpose:** Creates a new exam

**Parameters:**
- `title` - Exam title
- `totalMark` - Maximum marks for the exam
- Other exam metadata

**Behavior:**
- Validates title and totalMark fields
- Extracts field-specific validation errors
- Updates exam state on success

### `getExamBySession(sessionId)`
**Type:** Async Thunk  
**Endpoint:** GET `/exam/oneExam/{sessionId}`  
**Purpose:** Retrieves exam associated with a specific session

**Parameters:**
- `sessionId` - ID of the session

**Behavior:**
- Fetches exam data for the given session
- Updates exam state

### `addMarkandStudentInExams(marksData)`
**Type:** Async Thunk  
**Endpoint:** PATCH `/exam/addMarkandStudentInExams`  
**Purpose:** Bulk adds marks for multiple students in an exam

**Parameters:**
- `examId` - Exam identifier
- `marks` - Array of student marks

**Behavior:**
- Adds marks for multiple students at once
- Updates exam object with new marks

### `updateStudentMarkAction(markData)`
**Type:** Async Thunk  
**Endpoint:** PATCH `/exam/updateStudentMark`  
**Purpose:** Updates a single student's mark

**Parameters:**
- `examId` - Exam identifier
- `studentId` - Student identifier
- `mark` - New mark value

**Behavior:**
- Updates specific student's mark
- Provides success/error feedback

## Business Logic
- Field-level validation errors are extracted and displayed separately
- Exam operations are authenticated and teacher-specific
- Bulk operations optimize multiple student mark entries
- Exam state is updated after successful mark modifications

## API Integration
Uses the shared Axios instance with authentication headers. All operations require valid JWT token.