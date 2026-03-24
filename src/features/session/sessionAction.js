import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ===============================
// Create a new session
// Sends a POST request to create a session
// Returns the created session data
// ===============================
export const addSession = createAsyncThunk(
  "session/createsession",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/session/createSession",
        data,
        { headers: { token: localStorage.getItem("token") } } // Authorization token
      );
      return res.data;
    } catch (err) {
      console.log(err);
      // Return custom error message if available, fallback otherwise
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

// ===============================
// Get a single session by its ID
// Sends a GET request and returns session details
// ===============================
export const getSession = createAsyncThunk(
  "session/getsession",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/session/sessionById/${id}`,
        { headers: { token: localStorage.getItem("token") } }
      );
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

// ===============================
// Update session details by ID
// Sends a PATCH request with form values
// Returns the updated session
// ===============================
export const updateSessionById = createAsyncThunk(
  "session/updatesession",
  async ({ sessionId, formValues }, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/session/updateSessionData/${sessionId}`,
        formValues,
        { headers: { token: localStorage.getItem("token") } }
      );
      return res.data; // Updated session
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

// ===============================
// Toggle a student's attendance in a session
// Sends a PATCH request to update attendance
// Returns updated session data
// ===============================
export const toggleStudentAttendanceSession = createAsyncThunk(
  "session/toggleStudentAttendance",
  async ({ sessionId, formData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/session/toggleStudentAttendance/${sessionId}`,
        formData,
        { headers: { token: localStorage.getItem("token") } }
      );
      return res.data; // Updated session
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

// ===============================
// Delete a session by its ID
// Sends a DELETE request
// Returns success message or deleted session info
// ===============================
export const deleteSessionById = createAsyncThunk(
  "session/deleteSessionById",
  async ({ sessionId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(
        `/session/deleteSession/${sessionId}`,
        { headers: { token: localStorage.getItem("token") } }
      );
      return res.data; // Deleted session info
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

// ===============================
// Get all sessions for a specific group
// Sends a GET request by group ID
// Returns an array of sessions
// ===============================
export const getSessionsByGroup = createAsyncThunk(
  "Group/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/session/getSessionsByGroup/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);
export const getSessionsTeacher = createAsyncThunk(
  "sessions/getSessionsTeacher",
  async (url = "", { rejectWithValue }) => {
    try {
      const res = await api.get(url, {
        headers: { token: localStorage.getItem("token") },
      });
      return res.data; // عدّل حسب response بتاعك
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sessions"
      );
    }
  }
);