# Auth Feature Documentation

## Overview
The Auth feature manages user authentication and session state for the Teacher Manager application.

## Files
- `authSlice.js` - Redux slice defining state and reducers
- `authAction.js` - Async thunks for authentication API calls

## State Properties
- `user` - Decoded JWT user object containing user information
- `token` - JWT authentication token stored in localStorage
- `loadingLogIn` - Boolean indicating login request in progress
- `errorLogIn` - General login error message
- `errorLogInNetWork` - Network-related login errors
- `errorLogInEmail` - Email validation error message
- `errorLogInPassword` - Password validation error message

## Actions

### `login(credentials)`
**Type:** Async Thunk  
**Endpoint:** POST `/auth/login`  
**Purpose:** Authenticates user with email and password

**Parameters:**
- `email` - User's email address
- `password` - User's password

**Behavior:**
- Sends login request to backend
- On success: stores token in localStorage, decodes JWT, updates user state
- On failure: extracts field-specific validation errors
- Handles network errors separately

### `logout()`
**Type:** Synchronous Reducer  
**Purpose:** Logs out the current user

**Behavior:**
- Clears user and token from state
- Removes token from localStorage
- Resets all error and loading states

### `makeStateIsEmpityAuth()`
**Type:** Synchronous Reducer  
**Purpose:** Resets all authentication-related states

**Behavior:**
- Clears all error messages
- Resets loading states
- Useful for cleaning up after navigation or form resets

## Business Logic
- JWT tokens are validated and decoded on application initialization
- Field-level error messages are extracted from API validation responses
- Authentication state persists across browser sessions via localStorage
- Network errors are distinguished from validation errors for better UX

## API Integration
Uses the shared Axios instance with authentication headers where applicable. Login endpoint does not require prior authentication.