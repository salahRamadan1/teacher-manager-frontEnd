import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import themeReducer from "../features/theme/themeSlice.js";
import studentSlice from "../features/students/studentSlice.js";
import groupSlice from "../features/groups/groupSlice.js";
import sessionSlice from "../features/session/sessionSlice.js";
import examSlice from "../features/exam/examSlice.js";
import dashboardReducer from"../features/dashboard/dashboardSlice.js";
import studentReportReducer from "../features/students/studentReportSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        student: studentSlice,
        group: groupSlice,
        session: sessionSlice,
        exam: examSlice,
        dashboard: dashboardReducer,
        studentReport: studentReportReducer
    },
});
