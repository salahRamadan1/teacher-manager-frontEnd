import { createSlice } from "@reduxjs/toolkit";
import {
    addGroup,
    addStudentsToGroup,
    getGroupById,
    getGroups,
    removeStudentFromGroup,
    transferStudent,
    updateGroupById
} from "./groupAction";

/**
 * =====================================
 * Group Slice
 * =====================================
 * Manages all group-related state:
 * - CRUD operations
 * - Students inside groups
 * - Loading & error states
 */
const groupSlice = createSlice({
    name: "Group",

    /**
     * =====================================
     * Initial State
     * =====================================
     */
    initialState: {
        // -------- Create Group validation errors --------
        errorAddGroupName: null,
        errorAddGroupGrade: null,
        errorAddGroupDay: null,
        errorAddGroupTime: null,
        errorAddGroupPlace: null,
        errorAddGroupPrice: null,

        // -------- Create Group states --------
        loadingGroup: false,
        errorAddGroup: null,
        errorAddGroupNetWork: null,
        loadingSuccessfully: false,

        // -------- Get Groups (list) --------
        loadingGetGroup: false,
        errorGetGroup: null,
        errorGetGroupNetWork: null,
        groups: [],
        pageGroups: 0,
        totalPages: 0,
        totalGroups: 0,

        // -------- Get Group By ID --------
        loadingGetGroupById: false,
        errorGetGroupById: null,
        errorGetGroupByIdNetWork: null,
        GroupById: null,

        // -------- Update Group --------
        loadingUpdateGroup: false,
        errorUpdateGroup: null,
        errorUpdateGroupNetWork: null,
        loadingSuccessfullyUpdate: false,

        // -------- Update Group validation errors --------
        errorUpdateGroupName: null,
        errorUpdateGroupPrice: null,
        errorUpdateGroupGrade: null,
        errorUpdateGroupTime: null,
        errorUpdateGroupDay: null,
        errorUpdateGroupPlace: null,

        // -------- Add Students to Group --------
        loadingAddStudents: false,
        errorAddStudents: null,

        // -------- Remove Student from Group --------
        loadingRemoveStudentFromGroup: false,
        errorRemoveStudentFromGroup: null,

        // -------- Transfer Student --------
        loadingTransferStuent: false,
        errorTransferStuent: null,
    },

    /**
     * =====================================
     * Synchronous Reducers
     * =====================================
     */
    reducers: {


        /**
         * Reset group-related loading & error states
         * Used when:
         * - Closing dialogs
         * - Switching pages
         * - Clearing old validation messages
         */
        makeStateIsEmpityGroup: (state) => {
            const fields = [
                // Create group
                "errorAddGroupName",
                "errorAddGroupGrade",
                "errorAddGroupDay",
                "errorAddGroupTime",
                "errorAddGroupPlace",
                "errorAddGroupPrice",
                "loadingGroup",
                "errorAddGroup",
                "errorAddGroupNetWork",
                "loadingSuccessfully",

                // Get group by id
                "loadingGetGroupById",
                "errorGetGroupById",
                "errorGetGroupByIdNetWork",

                // Update group
                "loadingUpdateGroup",
                "errorUpdateGroup",
                "errorUpdateGroupNetWork",
                "loadingSuccessfullyUpdate",

                // Update validation
                "errorUpdateGroupName",
                "errorUpdateGroupPrice",
                "errorUpdateGroupGrade",
                "errorUpdateGroupTime",
                "errorUpdateGroupDay",
                "errorUpdateGroupPlace",

                // Students
                "errorAddStudents",

                // Remove student
                "loadingRemoveStudentFromGroup",
                "errorRemoveStudentFromGroup",

                // Transfer student
                "loadingTransferStuent",
                "errorTransferStuent",
            ];

            fields.forEach((field) => {
                state[field] = field.startsWith("loading") ? false : null;
            });
        },
    },

    /**
     * =====================================
     * Extra Reducers (Async Thunks)
     * =====================================
     */
    extraReducers: (builder) => {
        builder

            /**
             * -----------------------------
             * Create Group
             * -----------------------------
             */
            .addCase(addGroup.pending, (state) => {
                state.loadingGroup = true;
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                state.loadingGroup = false;

                // Handle validation errors from backend
                if (action.payload.error && Array.isArray(action.payload.error)) {
                    action.payload.error.forEach((elm) => {
                        if (elm.path[0] === "name") state.errorAddGroupName = elm.message;
                        if (elm.path[0] === "price") state.errorAddGroupPrice = elm.message;
                        if (elm.path[0] === "place") state.errorAddGroupPlace = elm.message;
                        if (elm.path[0] === "grade") state.errorAddGroupGrade = elm.message;
                        if (elm.path[0] === "day") state.errorAddGroupDay = elm.message;
                        if (elm.path[0] === "time") state.errorAddGroupTime = elm.message;
                    });
                    return;
                }

                // Success case
                if (action.payload.message === "Group created successfully") {
                    state.loadingSuccessfully = true;
                } else {
                    state.errorAddGroup = action.payload.message;
                }
            })
            .addCase(addGroup.rejected, (state, action) => {
                state.loadingGroup = false;
                state.errorAddGroupNetWork = action.payload;
            })

            /**
             * -----------------------------
             * Get Groups List
             * -----------------------------
             */
            .addCase(getGroups.pending, (state) => {
                state.loadingGetGroup = true;
                state.errorGetGroup = null;
                state.errorGetGroupNetWork = null;
            })
            .addCase(getGroups.fulfilled, (state, action) => {
                state.loadingGetGroup = false;

                if (
                    action.payload.message === "Groups fetched successfully" &&
                    Array.isArray(action.payload.groups)
                ) {
                    state.groups = action.payload.groups;
                    state.totalPages = action.payload.totalPages;
                    state.totalGroups = action.payload.totalGroups;
                }
            })
            .addCase(getGroups.rejected, (state, action) => {
                state.loadingGetGroup = false;
                state.errorGetGroupNetWork = action.payload;
            })

            /**
             * -----------------------------
             * Get Group By ID
             * -----------------------------
             */
            .addCase(getGroupById.pending, (state) => {
                state.loadingGetGroupById = true;
                state.errorGetGroupById = null;
            })
            .addCase(getGroupById.fulfilled, (state, action) => {

                state.loadingGetGroupById = false;
                state.GroupById = action.payload.group;
            })
            .addCase(getGroupById.rejected, (state, action) => {
                state.loadingGetGroupById = false;
                state.errorGetGroupByIdNetWork = action.payload;
            })

            /**
             * -----------------------------
             * Update Group
             * -----------------------------
             */
            .addCase(updateGroupById.pending, (state) => {
                state.loadingUpdateGroup = true;
                state.loadingSuccessfullyUpdate = false;
                state.errorUpdateGroup = null;
            })
            .addCase(updateGroupById.fulfilled, (state, action) => {
                state.loadingUpdateGroup = false;

                // Validation errors
                if (action.payload.error && Array.isArray(action.payload.error)) {
                    action.payload.error.forEach((elm) => {
                        if (elm.path[0] === "name") state.errorUpdateGroupName = elm.message;
                        if (elm.path[0] === "price") state.errorUpdateGroupPrice = elm.message;
                        if (elm.path[0] === "grade") state.errorUpdateGroupGrade = elm.message;
                        if (elm.path[0] === "time") state.errorUpdateGroupTime = elm.message;
                        if (elm.path[0] === "day") state.errorUpdateGroupDay = elm.message;
                        if (elm.path[0] === "place") state.errorUpdateGroupPlace = elm.message;
                    });
                    return;
                }

                // Success update
                if (action.payload.message === "group updated successfully") {
                    state.loadingSuccessfullyUpdate = true;

                    // Update group in list if exists
                    const index = state.groups.findIndex(
                        (g) => g._id === action.payload.group._id
                    );
                    if (index !== -1) {
                        state.groups[index] = action.payload.group;
                    }
                }
            })
            .addCase(updateGroupById.rejected, (state, action) => {
                state.loadingUpdateGroup = false;
                state.loadingSuccessfullyUpdate = false;
                state.errorUpdateGroupNetWork = action.payload;
            })

            /**
             * -----------------------------
             * Add Students To Group
             * -----------------------------
             */
            .addCase(addStudentsToGroup.pending, (state) => {
                state.loadingAddStudents = true;
            })
            .addCase(addStudentsToGroup.fulfilled, (state, action) => {
                console.log(action);

                state.loadingAddStudents = false;
                state.groupDetails = action.payload.populatedGroup;
            })
            .addCase(addStudentsToGroup.rejected, (state, action) => {
                state.loadingAddStudents = false;
                state.errorAddStudents = action.payload;
            })

            /**
             * -----------------------------
             * Remove Student From Group
             * -----------------------------
             */
            .addCase(removeStudentFromGroup.pending, (state) => {
                state.loadingRemoveStudentFromGroup = true;
                state.errorRemoveStudentFromGroup = null;
            })
            .addCase(removeStudentFromGroup.fulfilled, (state, action) => {
                console.log(action);

                state.loadingRemoveStudentFromGroup = false;
            })
            .addCase(removeStudentFromGroup.rejected, (state, action) => {
                state.loadingRemoveStudentFromGroup = false;
                state.errorRemoveStudentFromGroup = action.payload;
            })

            /**
             * -----------------------------
             * Transfer Student Between Groups
             * -----------------------------
             */
            .addCase(transferStudent.pending, (state) => {
                state.loadingTransferStuent = true;
                state.errorTransferStuent = null;
            })
            .addCase(transferStudent.fulfilled, (state) => {
                state.loadingTransferStuent = false;
            })
            .addCase(transferStudent.rejected, (state, action) => {
                state.loadingTransferStuent = false;
                state.errorTransferStuent = action.payload;
            });
    },
});

export const { makeStateIsEmpityGroup } = groupSlice.actions;
export default groupSlice.reducer;
