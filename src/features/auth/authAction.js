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

export const login = createAsyncThunk(
    "auth/login",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/login", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    }
);
