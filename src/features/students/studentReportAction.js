import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const generateStudentWhatsappLink = createAsyncThunk(
  "students/generateStudentWhatsappLink",
  async (studentId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `http://localhost:5000/student/report/${studentId}/whatsapp-link`,
        {
          headers: {
            token,
          },
        }
      );

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to generate report link"
      );
    }
  }
);