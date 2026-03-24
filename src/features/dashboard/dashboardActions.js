import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
 
export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/dashboard/summary", {
        headers: { token: localStorage.getItem("token") },
      });
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Request failed";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);