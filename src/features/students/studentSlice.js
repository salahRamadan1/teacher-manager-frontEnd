import { createSlice } from "@reduxjs/toolkit";
import { addStudent, fetchStudentDetails, getStudentById, getStudents, updateStudentById } from "./studentAction";


const studentSlice = createSlice({
    name: "student",
    initialState: {
        errorAddStudentName: null,
        errorAddStudentPhone: null,
        errorAddStudentParentPhone: null,
        errorAddStudentPayment: null,
        errorAddStudentGrade: null,
        loadingStudent: false,
        errorAddStudent: null,
        errorAddStudentNetWork: null,
        loadingSuccessfully: false,
        //************************************ */
        loadingGetStudent: false,
        errorGetStudent: null,
        errorGetStudentNetWork: null,
        students: [],
        pageStudents: 0,
        totalPages: 0,
        totalStudents: 0,
        // ************************************ */
        loadingGetStudentById: false,
        errorGetStudentById: null,
        errorGetStudentByIdNetWork: null,
        studentById: null,
        // ************************************ */
        loadingUpdateStudent: false,
        errorUpdateStudent: null,
        errorUpdateStudentNetWork: null,
        loadingSuccessfullyUpdate: false,
        // ************************************ */
        errorUpdateStudentGrade: null,
        errorUpdateStudentName: null,
        errorUpdateStudentPhone: null,
        errorUpdateStudentParentPhone: null,
        errorUpdateStudentPayment: null,
        // 
        student: null,
        loading: false,
        error: null,
    },
    reducers: {

        makeStateIsEmpityStudent: (state) => {
            const fields = [
                // Student
                'loadingStudent',
                'errorAddStudent',
                'errorAddStudentNetWork',
                'errorAddStudentName',
                'errorAddStudentPhone',
                'errorAddStudentParentPhone',
                'errorAddStudentPayment',
                'errorAddStudentGrade',
                'loadingSuccessfully',
                // Get Students
                'loadingGetStudent',
                'errorGetStudent',
                'errorGetStudentNetWork',

                // Get Student By Id
                'loadingGetStudentById',
                'errorGetStudentById',
                'errorGetStudentByIdNetWork',
                // Update Student
                'loadingUpdateStudent',
                'errorUpdateStudent',
                'errorUpdateStudentNetWork',
                'loadingSuccessfullyUpdate',
                // get Student By Id
                "student",
                "loading",
                "error",

            ];
            fields.forEach(field => {
                state[field] = field.startsWith('loading') ? false : null;
            });

        }
    },
    extraReducers: (builder) => {
        builder
            // Student
            .addCase(addStudent.pending, (state, action) => {
                state.loadingStudent = true
            })
            .addCase(addStudent.fulfilled, (state, action) => {
                state.loadingStudent = false;
                console.log(action);

                if (action.payload.error && Array.isArray(action.payload.error)) {
                    action.payload.error.forEach((elm) => {
                        if (elm.path[0] === 'name') state.errorAddStudentName = elm.message;
                        if (elm.path[0] === 'phone') state.errorAddStudentPhone = elm.message;
                        if (elm.path[0] === 'parentPhone') state.errorAddStudentParentPhone = elm.message;
                        if (elm.path[0] === 'payment') state.errorAddStudentPayment = elm.message;
                        if (elm.path[0] === 'grade') state.errorAddStudentGrade = elm.message;
                    });
                    return; // exit early
                }
                // 2️⃣ Student added successfully
                if (action.payload.message === 'Student created successfully') {
                    state.loadingSuccessfully = true;

                } else {
                    state.errorAddStudent = action.payload.message;
                }

            })
            .addCase(addStudent.rejected, (state, action) => {
                console.log(action);

                state.loadingStudent = false
                state.errorAddStudentNetWork = action.payload;

            })
            .addCase(getStudents.pending, (state, action) => {
                state.loadingGetStudent = true;
                state.errorGetStudent = null;
                state.errorGetStudentNetWork = null;
            })
            .addCase(getStudents.fulfilled, (state, action) => {
                console.log(action);

                state.loadingGetStudent = false;
                // Handle successful fetch if needed
                if (action.payload.message === 'Students fetched successfully' && Array.isArray(action.payload.students)) {
                    state.students = action.payload.students;
                    state.totalPages = action.payload.totalPages;
                    state.totalStudents = action.payload.totalStudents

                }

            })
            .addCase(getStudents.rejected, (state, action) => {
                state.loadingGetStudent = false;
                state.errorGetStudentNetWork = action.payload;
            })
            .addCase(getStudentById.pending, (state) => {
                state.loadingGetStudentById = true;
                state.errorGetStudentById = null;
            })
            .addCase(getStudentById.fulfilled, (state, action) => {
                state.loadingGetStudentById = false;
                state.studentById = action.payload;

            })
            .addCase(getStudentById.rejected, (state, action) => {
                state.loadingGetStudentById = false;
                state.errorGetStudentById = action.payload;
            })
            .addCase(updateStudentById.pending, (state) => {
                state.loadingUpdateStudent = true;
                state.loadingSuccessfullyUpdate = false;
                state.errorUpdateStudent = null;
            })
            .addCase(updateStudentById.fulfilled, (state, action) => {
                state.loadingUpdateStudent = false;



                if (action.payload.error && Array.isArray(action.payload.error)) {
                    action.payload.error.forEach((elm) => {
                        if (elm.path[0] === 'name') state.errorUpdateStudentName = elm.message;
                        if (elm.path[0] === 'phone') state.errorUpdateStudentPhone = elm.message;
                        if (elm.path[0] === 'parentPhone') state.errorUpdateStudentParentPhone = elm.message;
                        if (elm.path[0] === 'payment') state.errorUpdateStudentPayment = elm.message;
                        if (elm.path[0] === 'grade') state.errorUpdateStudentGrade = elm.message;
                    });
                    return; // exit early
                }

                state.loadingSuccessfullyUpdate = true; // ✅ هنا نفعّل رسالة النجاح
                state.errorUpdateStudent = null;

                // تحديث الطالب في المصفوفة لو موجود
                const index = state.students.findIndex(s => s._id === action.payload._id);
                if (index !== -1) {
                    state.students[index] = action.payload;
                }
            })
            .addCase(updateStudentById.rejected, (state, action) => {
                state.loadingUpdateStudent = false;
                state.loadingSuccessfullyUpdate = false;
                state.errorUpdateStudentNetWork = action.payload;
            })
            .addCase(fetchStudentDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.student = action.payload;
                console.log("Fetched student details:", action.payload);
                
            })
            .addCase(fetchStudentDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Request failed";
                console.log("Fetched student details:", action.payload);

            })


    },
});

export const { makeStateIsEmpityStudent } = studentSlice.actions;
export default studentSlice.reducer;