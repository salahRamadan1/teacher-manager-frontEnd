import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardSummary } from "./dashboardActions";

const initialState = {
  summary: null,
  loading: false,
  error: null,
  lastFetchedAt: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Request failed";
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;

export const selectDashboard = (s) => s.dashboard;

export default dashboardSlice.reducer;