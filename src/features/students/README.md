# Students Feature Documentation

## Overview
The Students feature manages student records, including creation, updates, listing, and report generation for parent communication.

## Files
- `studentSlice.js` - Main student state management
- `studentAction.js` - Student CRUD operations
- `studentReportSlice.js` - Report generation state
- `studentReportAction.js` - Report-related actions

## State Properties

### Main Student State (studentSlice.js)
#### Creation/Update
- `errorAddStudentName` - Name validation error
- `errorAddStudentPhone` - Phone validation error
- `errorAddStudentParentPhone` - Parent phone validation error
- `errorAddStudentPayment` - Payment validation error
- `errorAddStudentGrade` - Grade validation error
- `loadingStudent` - Operation loading state
- `errorAddStudent` - General error
- `loadingSuccessfully` - Success state

#### Student List
- `loadingGetStudent` - List fetch loading
- `errorGetStudent` - List fetch error
- `students` - Array of students
- `pageStudents` - Current page number
- `totalPages` - Total pages available
- `totalStudents` - Total student count

#### Single Student
- `loadingGetStudentById` - Single student fetch loading
- `errorGetStudentById` - Single student fetch error
- `studentById` - Current student object

#### Update States
- `loadingUpdateStudent` - Update loading
- `errorUpdateStudent` - Update error
- `loadingSuccessfullyUpdate` - Update success

#### Student Details
- `student` - Detailed student object
- `loading` - Details loading
- `error` - Details error

### Student Report State (studentReportSlice.js)
- `loadingGenerateWhatsapp` - Report link generation loading
- `errorGenerateWhatsapp` - Report generation error
- `successGenerateWhatsapp` - Report generation success
- `whatsappLink` - Generated WhatsApp shareable link
- `reportLink` - Direct report document link

## Actions

### Student CRUD Operations

#### `addStudent(studentData)`
**Type:** Async Thunk  
**Endpoint:** POST `/student/createStudent`  
**Purpose:** Creates a new student record

**Parameters:**
- `name`, `phone`, `parentPhone`, `payment`, `grade`

**Behavior:**
- Validates all required fields
- Extracts field-specific validation errors

#### `getStudents(params)`
**Type:** Async Thunk  
**Endpoint:** GET `/student/students` (with pagination)  
**Purpose:** Retrieves paginated list of students

#### `getStudentById(studentId)`
**Type:** Async Thunk  
**Endpoint:** GET `/student/getStudentById/{id}`  
**Purpose:** Retrieves single student by ID

#### `updateStudentById(studentData)`
**Type:** Async Thunk  
**Endpoint:** PATCH `/student/updateStudent/{studentId}`  
**Purpose:** Updates student information

#### `fetchStudentDetails(studentId)`
**Type:** Async Thunk  
**Endpoint:** GET `/student/getStudentDetails/{studentId}`  
**Purpose:** Retrieves detailed student information

### Report Operations

#### `generateStudentWhatsappLink(studentId)`
**Type:** Async Thunk  
**Endpoint:** GET `/student/report/{studentId}/whatsapp-link`  
**Purpose:** Generates WhatsApp-shareable report link for parent communication

**Behavior:**
- Creates both WhatsApp link and direct report link
- Links are stored in state for UI access

#### `clearStudentReportState()`
**Type:** Synchronous Reducer  
**Purpose:** Clears report-related state

**Behavior:**
- Resets all report loading, error, and link states

## Business Logic
- Students can belong to only one group (enforced at group level)
- Comprehensive field validation with specific error messages
- Report generation integrates with WhatsApp for parent communication
- Pagination support for large student lists
- Teacher-specific data isolation

## API Integration
Uses the shared Axios instance with authentication headers. All operations are scoped to the authenticated teacher.