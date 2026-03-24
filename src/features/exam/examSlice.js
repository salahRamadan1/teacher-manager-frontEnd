import { createSlice } from "@reduxjs/toolkit";

import { addMarkandStudentInExams, createExam, getExamBySession, updateStudentMarkAction } from "./examAction";

const examSlice = createSlice({
    name: "exam",
    initialState: {

        loadingExam: false,
        errorExam: null,
        errorExamnNetWork: null,
        errorExamTitle: null,
        errorExamTotalMark: null,
        // 
        exam: null,
        loadingGetExam: false,
        errorGetExam: null,
        //
        loadingUpdateMark: false,
        errorUpdateMark: null,
        successUpdateMark: false,

    },
    reducers: {

        makeStateIsEmpityExam: (state) => {
            const fields = [
                // Examn
                'loadingExam', 'errorExam', 'errorExamnNetWork', 'errorExamTitle', 'errorExamTotalMark',
            ];
            fields.forEach(field => {
                state[field] = field.startsWith('loading') ? false : null;
            });

        }
    },
    extraReducers: (builder) => {
        builder
            // Exam
            .addCase(createExam.pending, (state, action) => {
                state.loadingExam = true;
                state.errorExam = null;


            })
            .addCase(createExam.fulfilled, (state, action) => {
                state.loadingExam = false;
                console.log(action);

                // 1️⃣ Validation Errors
                if (action.payload.error && Array.isArray(action.payload.error)) {
                    action.payload.error.forEach((elm) => {
                        if (elm.path[0] === 'title') state.errorExamTitle = elm.message;
                        if (elm.path[0] === 'totalMark') state.errorExamTotalMark = elm.message;
                    });
                    return; // exit early
                }
                // 2️⃣ exam success

                if (action.payload.message === "Exam created") {
                    state.errorExamTitle = null;
                    state.errorExamTotalMark = null;
                    state.errorExam = null;
                } else {
                    // 3️⃣ exam failed with message
                    state.errorExam = action.payload.message || "exam failed";
                }
            })

            .addCase(createExam.rejected, (state, action) => {

                console.log(action);


                state.loadingExam = false;
                state.errorExamnNetWork = action.payload || "Network error ";
            })
            // 
            .addCase(getExamBySession.pending, (state) => {
                state.loadingGetExam = true;
                state.errorGetExam = null;
                state.errorGetExam = null
            })
            .addCase(getExamBySession.fulfilled, (state, action) => {
                state.loadingGetExam = false;
                state.exam = action.payload.exam;
            })
            .addCase(getExamBySession.rejected, (state, action) => {
                state.loadingGetExam = false;
                state.errorGetExam = action.payload;
            })
            // 
            .addCase(addMarkandStudentInExams.pending, (state) => {
                state.loadingAddMarks = true;
                state.errorAddMarks = null;
            })
            .addCase(addMarkandStudentInExams.fulfilled, (state, action) => {
                console.log(action);

                state.loadingAddMarks = false;
                state.exam = action.payload.populatedExam; // updated exam
                state.success = true;
            })
            .addCase(addMarkandStudentInExams.rejected, (state, action) => {
                console.log(action);

                state.loadingAddMarks = false;
                state.errorAddMarks = action.payload;
            })
            .addCase(updateStudentMarkAction.pending, (state) => {
                state.loadingUpdateMark = true;
                state.errorUpdateMark = null;
                state.successUpdateMark = false;
            })
            .addCase(updateStudentMarkAction.fulfilled, (state, action) => {
                state.loadingUpdateMark = false;
                state.successUpdateMark = true;
                state.exam = action.payload.exam; // ✅ الامتحان بعد التعديل
            })
            .addCase(updateStudentMarkAction.rejected, (state, action) => {
                state.loadingUpdateMark = false;
                state.errorUpdateMark = action.payload;
                state.successUpdateMark = false;
            })
    },
});

export const { makeStateIsEmpityExam } = examSlice.actions;
export default examSlice.reducer;