# Dashboard Feature Documentation

## Overview
The Dashboard feature handles fetching and displaying summary statistics for the teacher's dashboard.

## Files
- `dashboardSlice.js` - Redux slice for dashboard state management
- `dashboardActions.js` - Async actions for dashboard data fetching

## State Properties
- `summary` - Object containing dashboard summary data (stats, counts, etc.)
- `loading` - Boolean indicating if dashboard data is being fetched
- `error` - Error message if dashboard fetch fails
- `lastFetchedAt` - Timestamp of the last successful fetch (for potential caching)

## Actions

### `fetchDashboardSummary()`
**Type:** Async Thunk  
**Endpoint:** GET `/dashboard/summary`  
**Purpose:** Retrieves aggregated dashboard statistics for the authenticated teacher

**Behavior:**
- Sends authenticated request to fetch summary data
- Updates summary state on success
- Sets error state on failure
- Records fetch timestamp

### `clearDashboardError()`
**Type:** Synchronous Reducer  
**Purpose:** Clears any dashboard-related error messages

**Behavior:**
- Resets the error state to null
- Useful for dismissing error notifications

## Business Logic
- All requests are authenticated using JWT token from localStorage
- Summary data includes various teacher-specific metrics and counts
- Error handling provides user-friendly fallback messages
- Timestamp tracking enables potential future caching optimizations

## API Integration
Uses the shared Axios instance with authentication headers. Requires valid JWT token for access.