import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
// Login Thunk
// const apiRequest = async (method, endpoint, data, headers = {}) => {
//     const response = await axios({
//         method,
//         url: `${api}${endpoint}`,
//         data,
//         headers,
//     });
//     return response.data;
// };
// export const login = createAsyncThunk('auth/logIn', async (userData) =>
//     apiRequest('post', 'logIn', userData)
// );

export const createExam = createAsyncThunk(
    "exam/createExam",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post(
                "/exam/createExam",
                data,
                {
                    headers: { token: localStorage.getItem("token") },
                }
            );
            return res.data;
        } catch (err) {
            // Return backend error message or fallback message
            return rejectWithValue(
                err.response?.data?.message || "Something went wrong"
            );
        }
    }
);
export const getExamBySession = createAsyncThunk(
    "exam/getExamBySession",
    async (sessionId, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/exam/oneExam/${sessionId}`,
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch exam"
            );
        }
    }
);
export const addMarkandStudentInExams = createAsyncThunk(
    "exam/addMarkandStudentInExams",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.patch(
                "/exam/addMarkandStudentInExams",
                data,
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to add students marks"
            );
        }
    }
);
export const updateStudentMarkAction = createAsyncThunk(
  "exam/updateStudentMark",
  async ({ examId, studentId, mark }, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        "/exam/updateStudentMark",
        { examId, studentId, mark },
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      // { message: "Mark updated", exam }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update mark");
    }
  }
);