import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/**
 * ===============================
 * Create New Group
 * ===============================
 * Sends group data to backend to create a new group
 */
export const addGroup = createAsyncThunk(
    "Group/createGroup",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post(
                "/group/createGroup",
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

/**
 * ===============================
 * Get All Groups (with optional query)
 * ===============================
 * Used for fetching groups list (pagination / filters supported via URL)
 */
export const getGroups = createAsyncThunk(
    "Group/getGroups",
    async (url = "", { rejectWithValue }) => {
        try {
            const res = await api.get(url, {
                headers: { token: localStorage.getItem("token") },
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Something went wrong"
            );
        }
    }
);

/**
 * ===============================
 * Get Group By ID
 * ===============================
 * Fetch a single group with its students and teacher
 */
export const getGroupById = createAsyncThunk(
    "Group/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/group/getGroupById/${id}`, {
                headers: { token: localStorage.getItem("token") },
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Something went wrong"
            );
        }
    }
);

/**
 * ===============================
 * Update Group By ID
 * ===============================
 * Update group information (name, price, schedule, etc.)
 */
export const updateGroupById = createAsyncThunk(
    "group/updateGroup",
    async ({ groupId, formData }, { rejectWithValue }) => {
        try {
            const res = await api.patch(
                `/group/updateGroupId/${groupId}`,
                formData,
                {
                    headers: { token: localStorage.getItem("token") },
                }
            );
            return res.data; // Updated group
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Something went wrong"
            );
        }
    }
);

/**
 * ===============================
 * Add Students To Group
 * ===============================
 * Adds multiple existing students to a group
 * Business Rule:
 * - Students already assigned to another group are excluded in UI
 */
export const addStudentsToGroup = createAsyncThunk(
    "group/addStudentsToGroup",
    async ({ groupId, studentIds }, thunkAPI) => {
        try {
            const { data } = await api.patch(
                "/group/addStudentsToGroup",
                {
                    groupId,
                    studentIds,
                },
                {
                    headers: { token: localStorage.getItem("token") },
                }
            );
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

/**
 * ===============================
 * Remove Student From Group
 * ===============================
 * Removes a single student from a specific group
 * Also clears student's groupId in backend
 */
export const removeStudentFromGroup = createAsyncThunk(
    "group/removeStudentFromGroup",
    async ({ groupId, studentId }, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(
                "/group/removeStudentFromGroup",
                { groupId, studentId },
                {
                    headers: { token: localStorage.getItem("token") },
                }
            );
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove student"
            );
        }
    }
);

/**
 * ===============================
 * Transfer Student Between Groups
 * ===============================
 * Moves a student from one group to another
 * Used when student changes schedule or teacher
 */
export const transferStudent = createAsyncThunk(
    "group/transferStudent",
    async ({ studentId, toGroupId, fromGroupId }, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                "/group/transferStudentBetweenGroups",
                {
                    studentId,
                    toGroupId,
                    fromGroupId,
                },
                {
                    headers: { token: localStorage.getItem("token") },
                }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);
