# Session Feature Documentation

## Overview
The Session feature manages class sessions, including creation, updates, attendance tracking, and scheduling.

## Files
- `sessionSlice.js` - Redux slice for session state management
- `sessionAction.js` - Async actions for session operations

## State Properties

### Session Creation
- `errorAddSessionGrade` - Grade validation error
- `errorAddSessionPlace` - Place validation error
- `errorAddSessionDescription` - Description validation error
- `errorAddSessionSessionPrice` - Session price validation error
- `errorAddSessionCenterPrice` - Center price validation error
- `loadingSession` - Creation loading state
- `errorAddSession` - General creation error
- `messageSessionExist` - Message when session already exists
- `sessionId` - ID of created session

### Session Retrieval
- `loadingGetSessionById` - Single session fetch loading
- `errorGetSessionById` - Single session fetch error
- `sessionById` - Current session object

### Session Updates
- `loadingUpdateSession` - Update loading state
- `errorUpdateSession` - Update error
- `loadingSuccessfullyUpdate` - Update success state
- Field-specific validation errors (same as creation)

### Attendance
- `loadingToggleStudentAttendanceSession` - Attendance toggle loading
- `errorToggleStudentAttendanceSession` - Attendance toggle error

### Deletion
- `loadingDelete` - Deletion loading state
- `successDelete` - Deletion success state
- `errorDelete` - Deletion error

### Group Sessions
- `loadingSessionByGroupByGroup` - Group sessions fetch loading
- `errorGetSessionByGroup` - Group sessions fetch error
- `sessionsByOneGroup` - Array of sessions for a group
- `lengthSessionsByOneGroup` - Count of sessions

### Session List
- `sessions` - Array of all sessions
- `loading` - General loading state
- `error` - General error

## Actions

### `addSession(sessionData)`
**Type:** Async Thunk  
**Endpoint:** POST `/session/createSession`  
**Purpose:** Creates a new session

**Business Logic:** Prevents duplicate sessions on the same day

**Parameters:**
- `grade`, `place`, `description`, `sessionPrice`, `centerPrice`, etc.

**Behavior:**
- Validates all fields
- Checks for existing sessions on same day
- Returns sessionId or warning if duplicate

### `getSession(sessionId)`
**Type:** Async Thunk  
**Endpoint:** GET `/session/sessionById/{id}`  
**Purpose:** Retrieves a single session by ID

### `updateSessionById(sessionData)`
**Type:** Async Thunk  
**Endpoint:** PATCH `/session/updateSessionData/{sessionId}`  
**Purpose:** Updates session information

**Parameters:**
- `sessionId` - Session to update
- `formValues` - Updated session data

### `toggleStudentAttendanceSession(attendanceData)`
**Type:** Async Thunk  
**Endpoint:** PATCH `/session/toggleStudentAttendance/{sessionId}`  
**Purpose:** Toggles student attendance for a session

**Parameters:**
- `sessionId` - Session identifier
- `formData` - Attendance data

### `deleteSessionById(sessionId)`
**Type:** Async Thunk  
**Endpoint:** DELETE `/session/deleteSession/{sessionId}`  
**Purpose:** Deletes a session

### `getSessionsByGroup(groupId)`
**Type:** Async Thunk  
**Endpoint:** GET `/session/getSessionsByGroup/{id}`  
**Purpose:** Retrieves all sessions for a specific group

### `getSessionsTeacher(params)`
**Type:** Async Thunk  
**Endpoint:** GET `/session/sessionsTeacher` (with query params)  
**Purpose:** Retrieves all sessions for the authenticated teacher

## Business Logic
- Prevents scheduling conflicts by checking for duplicate sessions on the same day
- Supports group-specific session management
- Granular attendance tracking per student per session
- Comprehensive validation with field-specific error messages

## API Integration
Uses the shared Axios instance with authentication headers. All operations are teacher-specific and require valid JWT token.