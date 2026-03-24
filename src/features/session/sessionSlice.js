import { createSlice } from "@reduxjs/toolkit";
import {
  addSession,
  deleteSessionById,
  getSession,
  getSessionsByGroup,
  getSessionsTeacher,
  toggleStudentAttendanceSession,
  updateSessionById,
} from "./sessionAction";

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    // ================= Add Session =================
    errorAddSessionGrade: null,
    errorAddSessionPlace: null,
    errorAddSessionDescription: null,
    errorAddSessionSessionPrice: null,
    errorAddSessionCenterPrice: null,
    loadingSession: false,
    errorAddSession: null,
    errorAddSessionNetWork: null,
    messageSessionExist: null,
    sessionId: null,

    // ================= Get Session By ID =================
    errorGetSessionById: null,
    errorGetSessionByIdNetWork: null,
    loadingGetSessionById: false,
    sessionById: null,

    // ================= Update Session =================
    loadingUpdateSession: false,
    errorUpdateSession: null,
    errorUpdateSessionNetWork: null,
    errorUpdateSessionPlace: null,
    errorUpdateSessionDescription: null,
    errorUpdateSessionPrice: null,
    errorUpdateSessionCenterPrice: null,

    // ================= Toggle Attendance =================
    loadingToggleStudentAttendanceSession: false,
    errorToggleStudentAttendanceSession: null,
    errorToggleStudentAttendanceSessionNetWork: null,
    errorToggleStudentToggleAttendance: null,

    // ================= Delete Session =================
    loadingDelete: false,
    successDelete: null,
    errorDelete: null,

    // ================= Sessions By Group =================
    loadingSessionByGroupByGroup: false,
    errorGetSessionByGroup: null,
    errorGetSessionByGroupNetWork: null,
    sessionsByOneGroup: [],
    lengthSessionsByOneGroup: null,
    // 
    sessions: [],
    loading: false,
    error: null,
  },

  reducers: {
    // Reset all session-related state fields to initial/empty values
    makeStateIsEmpitySession: (state) => {
      const fields = [
        "errorAddSessionGrade",
        "errorAddSessionPlace",
        "errorAddSessionDescription",
        "errorAddSessionSessionPrice",
        "errorAddSessionCenterPrice",
        "loadingSession",
        "errorAddSession",
        "errorAddSessionNetWork",
        "messageSessionExist",
        "errorGetSessionById",
        "errorGetSessionByIdNetWork",
        "loadingGetSessionById",
        "loadingUpdateSession",
        "errorUpdateSession",
        "errorUpdateSessionNetWork",
        "errorUpdateSessionPlace",
        "errorUpdateSessionDescription",
        "errorUpdateSessionPrice",
        "errorUpdateSessionCenterPrice",
        "loadingToggleStudentAttendanceSession",
        "errorToggleStudentAttendanceSession",
        "errorToggleStudentAttendanceSessionNetWork",
        "errorToggleStudentToggleAttendance",
        "loadingDelete",
        "successDelete",
        "errorDelete",
        "loadingSessionByGroupByGroup",
        "errorGetSessionByGroup",
        "errorGetSessionByGroupNetWork",
      ];

      fields.forEach((field) => {
        state[field] = field.startsWith("loading") ? false : null;
      });
    },
  },

  extraReducers: (builder) => {
    builder
      // ================= Add Session =================
      .addCase(addSession.pending, (state) => {
        state.loadingSession = true;
      })
      .addCase(addSession.fulfilled, (state, action) => {
        state.loadingSession = false;

        // Validation errors from backend
        if (action.payload.error && Array.isArray(action.payload.error)) {
          action.payload.error.forEach((elm) => {
            if (elm.path[0] === "grade") state.errorAddSessionGrade = elm.message;
            if (elm.path[0] === "place") state.errorAddSessionPlace = elm.message;
            if (elm.path[0] === "description") state.errorAddSessionDescription = elm.message;
            if (elm.path[0] === "sessionPrice") state.errorAddSessionSessionPrice = elm.message;
            if (elm.path[0] === "centerPrice") state.errorAddSessionCenterPrice = elm.message;
          });
          return;
        }

        // Success messages
        if (action.payload.message === "Session created successfully") {
          state.loadingSuccessfully = true;
        } else if (
          action.payload.message ===
          "There is already a session scheduled today. You cannot create another session for the same day"
        ) {
          state.messageSessionExist = action.payload.message;
          state.sessionId = action.payload.sessionId;
        }
      })
      .addCase(addSession.rejected, (state, action) => {
        state.loadingSession = false;
        state.errorAddSessionNetWork = action.payload;
      })

      // ================= Get Session By ID =================
      .addCase(getSession.pending, (state) => {
        state.loadingGetSessionById = true;
        state.errorGetSessionById = null;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.loadingGetSessionById = false;
        state.sessionById = action.payload.session;
      })
      .addCase(getSession.rejected, (state, action) => {
        state.loadingGetSessionById = false;
        state.errorGetSessionByIdNetWork = action.payload;
      })

      // ================= Update Session =================
      .addCase(updateSessionById.pending, (state) => {
        state.loadingUpdateSession = true;
        state.loadingSuccessfullyUpdate = false;
        state.errorUpdateSession = null;
      })
      .addCase(updateSessionById.fulfilled, (state, action) => {
        state.loadingUpdateSession = false;

        // Backend validation errors
        if (action.payload.error && Array.isArray(action.payload.error)) {
          action.payload.error.forEach((elm) => {
            if (elm.path[0] === "place") state.errorUpdateSessionPlace = elm.message;
            if (elm.path[0] === "description") state.errorUpdateSessionDescription = elm.message;
            if (elm.path[0] === "sessionPrice") state.errorUpdateSessionPrice = elm.message;
            if (elm.path[0] === "centerPrice") state.errorUpdateSessionCenterPrice = elm.message;
          });
          return;
        }

        // Success
        if (action.payload.message === "Session data updated successfully") {
          state.loadingSuccessfullyUpdate = true;
        } else {
          state.errorUpdateSession = action.payload;
        }
      })
      .addCase(updateSessionById.rejected, (state, action) => {
        state.loadingUpdateSession = false;
        state.loadingSuccessfullyUpdate = false;
        state.errorUpdateSessionNetWork = action.payload;
      })

      // ================= Toggle Attendance =================
      .addCase(toggleStudentAttendanceSession.pending, (state) => {
        state.loadingToggleStudentAttendanceSession = true;
        state.errorToggleStudentAttendanceSession = null;
      })
      .addCase(toggleStudentAttendanceSession.fulfilled, (state, action) => {
        state.loadingToggleStudentAttendanceSession = false;
        state.errorToggleStudentAttendanceSession = null;
        state.loadingSuccessfullyUpdate = false;

        const payload = action.payload;

        // Validation errors
        if (payload?.error && Array.isArray(payload.error)) {
          payload.error.forEach((err) => {
            state.errorToggleStudentAttendanceSession = err.message;
          });
          return;
        }

        // Success
        if (payload?.session) {
          state.loadingSuccessfullyUpdate = true;
        } else if (payload?.message) {
          state.errorToggleStudentAttendanceSession = payload.message;
        } else {
          state.errorToggleStudentAttendanceSession = "Something went wrong";
        }
      })
      .addCase(toggleStudentAttendanceSession.rejected, (state, action) => {
        state.loadingToggleStudentAttendanceSession = false;
        state.loadingSuccessfullyUpdate = false;
        state.errorToggleStudentAttendanceSessionNetWork = action.payload;
      })

      // ================= Delete Session =================
      .addCase(deleteSessionById.pending, (state) => {
        state.loadingDelete = true;
        state.successDelete = null;
        state.errorDelete = null;
      })
      .addCase(deleteSessionById.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.successDelete = action.payload.message;
      })
      .addCase(deleteSessionById.rejected, (state, action) => {
        state.loadingDelete = false;
        state.errorDelete = action.payload?.message || "Something went wrong";
      })

      // ================= Get Sessions By Group =================
      .addCase(getSessionsByGroup.pending, (state) => {
        state.loadingSessionByGroupByGroup = true;
        state.errorGetSessionByGroup = null;
        state.errorGetSessionByGroupNetWork = null;
        state.sessionsByOneGroup = [];
        state.lengthSessionsByOneGroup = null;
      })
      .addCase(getSessionsByGroup.fulfilled, (state, action) => {
        state.loadingSessionByGroupByGroup = false;

        if (action.payload.message === "Session fetched successfully") {
          state.sessionsByOneGroup = action.payload.session;
          state.lengthSessionsByOneGroup = action.payload.results;
        }
      })
      .addCase(getSessionsByGroup.rejected, (state, action) => {
        state.loadingSessionByGroupByGroup = false;
        state.errorGetSessionByGroupNetWork = action.payload;
      })
      // GET SESSIONS
      .addCase(getSessionsTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSessionsTeacher.fulfilled, (state, action) => {
    

        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(getSessionsTeacher.rejected, (state, action) => {
    

        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { makeStateIsEmpitySession } = sessionSlice.actions;
export default sessionSlice.reducer;
