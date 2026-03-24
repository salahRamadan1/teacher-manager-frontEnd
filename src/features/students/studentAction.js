import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
 
export const addStudent = createAsyncThunk(
    "student/createStudent",
    async (data, { rejectWithValue }) => {
        

        try {
            const res = await api.post(
                "/student/createStudent",
                data,
                { headers: { token: localStorage.getItem("token") } }
            );
            return res.data;
        } catch (err) {
            // 👇 fallback
            return rejectWithValue(err.response?.data?.message || "Something went wrong");
        }
    }
);


export const getStudents = createAsyncThunk(
    "/student/getStudents",
    async (url="", { rejectWithValue }) => {
        try {
            const res = await api.get(url, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Something went wrong"
            );
        }
    }
);
export const getStudentById = createAsyncThunk(
    "student/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/student/getStudentById/${id}`, {
                headers: { token: localStorage.getItem("token") },
            });
            return res.data.student;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Something went wrong");
        }
    }
);
export const updateStudentById = createAsyncThunk(
    "student/updateStudent",
    async ({ studentId, formData }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/student/updateStudent/${studentId}`, formData, {
                headers: { token: localStorage.getItem("token") },
            });
            return res.data.student; // رجعنا الـ student الجديد
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Something went wrong");
        }
    }
);

export const fetchStudentDetails  = createAsyncThunk(
    "student/fetchStudentDetails",
    async (studentId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/student/getStudentDetails/${studentId}`, {
                headers: { token: localStorage.getItem("token") },
            });
            console.log(res);
            
            return res.data.student;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Something went wrong");
        }
    }
);