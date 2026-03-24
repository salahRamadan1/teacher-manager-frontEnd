# Features Documentation

This directory contains all Redux state management features for the Teacher Manager application. Each feature is organized as a separate module with its own slice, actions, and business logic.

## Overview

The application uses Redux Toolkit for state management, with features organized by domain:

- **Auth**: User authentication and session management
- **Dashboard**: Teacher dashboard summary data
- **Exam**: Exam creation and student marks management
- **Groups**: Group management including students and scheduling
- **Session**: Class session management with attendance
- **Students**: Student management and reporting
- **Theme**: Application theme switching (dark/light mode)

## Architecture Patterns

### State Structure
Each feature follows a consistent pattern:
- Loading states for async operations
- Error states (generic + field-specific validation errors)
- Success states and data storage
- Pagination support where applicable

### Actions
- Async thunks for API calls using `createAsyncThunk`
- Synchronous reducers for local state updates
- Authentication via JWT tokens in headers
- Field-level error extraction from API responses

### Business Rules
- Authentication required for all API calls
- Students belong to only one group
- Session scheduling prevents duplicates
- Comprehensive validation on all forms

## Detailed Feature Documentation

### 1. 🔐 AUTH Feature
**Files:** `authSlice.js`, `authAction.js`

**Purpose:** Manages user authentication and session

**State Properties:**
- `user` - Decoded JWT user object
- `token` - JWT token from localStorage
- `loadingLogIn` - Login request state
- `errorLogIn` - General login error
- `errorLogInNetWork` - Network errors
- `errorLogInEmail` - Email validation errors
- `errorLogInPassword` - Password validation errors

**Actions:**
- `login()` - Async thunk for POST `/auth/login`
- `logout()` - Clears user data and localStorage
- `makeStateIsEmpityAuth()` - Resets all states

### 2. 📊 DASHBOARD Feature
**Files:** `dashboardSlice.js`, `dashboardActions.js`

**Purpose:** Fetches and displays teacher dashboard summary

**State Properties:**
- `summary` - Dashboard data object
- `loading` - Fetch state
- `error` - Error message
- `lastFetchedAt` - Timestamp of last fetch

**Actions:**
- `fetchDashboardSummary()` - GET `/dashboard/summary`
- `clearDashboardError()` - Clears error state

### 3. 📝 EXAM Feature
**Files:** `examSlice.js`, `examAction.js`

**Purpose:** Manages exam creation, student marks, and exam retrieval

**State Properties:**
- Create exam states: `loadingExam`, `errorExam`, field-specific errors
- Get exam states: `loadingGetExam`, `errorGetExam`, `exam`
- Marks states: loading/error for add/update operations

**Actions:**
- `createExam()` - POST `/exam/createExam`
- `getExamBySession()` - GET `/exam/oneExam/{sessionId}`
- `addMarkandStudentInExams()` - PATCH `/exam/addMarkandStudentInExams`
- `updateStudentMarkAction()` - PATCH `/exam/updateStudentMark`

### 4. 👥 GROUPS Feature
**Files:** `groupSlice.js`, `groupAction.js`, `README.md`

**Purpose:** Complete group management including students and scheduling

**Business Rules:**
- A student can belong to only one group
- Students already assigned are excluded in UI
- Group ownership validated by teacherId
- Transfer removes student from old group and assigns to new

**State Properties:**
- Create/update states with field-specific validation errors
- List states with pagination: `groups[]`, `pageGroups`, `totalPages`
- Single group: `GroupById`
- Student operations: add/remove/transfer states

**Actions:**
- `addGroup()` - POST `/group/createGroup`
- `getGroups()` - GET with pagination/filters
- `getGroupById()` - GET `/group/getGroupById/{id}`
- `updateGroupById()` - PATCH `/group/updateGroupId/{groupId}`
- `addStudentsToGroup()` - PATCH `/group/addStudentsToGroup`
- `removeStudentFromGroup()` - PATCH `/group/removeStudentFromGroup`
- `transferStudent()` - PATCH `/group/transferStudentBetweenGroups`

### 5. 📅 SESSION Feature
**Files:** `sessionSlice.js`, `sessionAction.js`

**Purpose:** Manages sessions (class meetings) with attendance and scheduling

**State Properties:**
- Create/update states with validation errors
- Single session: `sessionById`
- Attendance toggle states
- Delete states
- Group sessions: `sessionsByOneGroup[]`
- List: `sessions[]`

**Actions:**
- `addSession()` - POST `/session/createSession` (prevents duplicates)
- `getSession()` - GET `/session/sessionById/{id}`
- `updateSessionById()` - PATCH `/session/updateSessionData/{sessionId}`
- `toggleStudentAttendanceSession()` - PATCH `/session/toggleStudentAttendance/{sessionId}`
- `deleteSessionById()` - DELETE `/session/deleteSession/{sessionId}`
- `getSessionsByGroup()` - GET `/session/getSessionsByGroup/{id}`
- `getSessionsTeacher()` - GET teacher's sessions

### 6. 👨‍🎓 STUDENTS Feature
**Files:** `studentSlice.js`, `studentAction.js`, `studentReportSlice.js`, `studentReportAction.js`

**Purpose:** Complete student management and reporting

**Main Student State:**
- Create/update states with field-specific errors
- List with pagination: `students[]`, `pageStudents`, etc.
- Single student: `studentById`

**Student Report State:**
- `loadingGenerateWhatsapp` - Generating report link
- `whatsappLink` - Generated WhatsApp link
- `reportLink` - Report document link

**Actions:**
- `addStudent()` - POST `/student/createStudent`
- `getStudents()` - GET with pagination
- `getStudentById()` - GET `/student/getStudentById/{id}`
- `updateStudentById()` - PATCH `/student/updateStudent/{studentId}`
- `fetchStudentDetails()` - GET `/student/getStudentDetails/{studentId}`
- `generateStudentWhatsappLink()` - GET `/student/report/{studentId}/whatsapp-link`

### 7. 🎨 THEME Feature
**Files:** `themeSlice.js`

**Purpose:** Application-wide theme switching (Dark/Light mode)

**State Properties:**
- `mode` - "light" or "dark"

**Actions:**
- `toggleTheme()` - Toggles theme and persists to localStorage

## Cross-Cutting Patterns

1. **Error Handling:**
   - Generic error + network-specific error fields
   - Field-level validation error extraction
   - Fallback error messages

2. **Authentication:**
   - JWT tokens from localStorage
   - Sent in headers for all API calls

3. **Pagination:**
   - Consistent pagination state structure
   - Page numbers, total pages, total items

4. **Loading States:**
   - Separate loading flags for different operations
   - Prevents UI conflicts during concurrent requests

## API Integration

All features use a shared Axios instance (`api`) for backend communication. Authentication is handled via JWT tokens stored in localStorage and included in request headers.