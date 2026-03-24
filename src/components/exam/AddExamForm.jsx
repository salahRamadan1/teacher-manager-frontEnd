import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Stack,
    useTheme,
    CircularProgress,
} from "@mui/material";
import AddExamMarks from "./AddExamMarks";
import { validateCreateExam } from "../../utils/validation/examValidation";
import { useDispatch, useSelector } from "react-redux";
import { createExam, getExamBySession } from "../../features/exam/examAction";
import { makeStateIsEmpityExam } from "../../features/exam/examSlice";
import DynamicSnackbar from "../alerts/DynamicSnackbar";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
const AddExamForm = ({ grade, groupId, sessionId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { id } = useParams()

    // State for exam title and total mark
    const [title, setTitle] = useState("");
    const [totalMark, setTotalMark] = useState("");

    // State to hold all form data including props (grade, groupId, sessionId)
    const [formData, setFormData] = useState({
        title: "",
        totalMark: "",
        grade: grade,
        groupId: groupId,
        sessionId: sessionId
    });

    // State to store validation errors
    const [errors, setErrors] = useState({});

    // Get Redux state for loading, errors, etc.
    const {
        loadingExam,
        errorExam,
        errorExamnNetWork,
        errorExamTitle,
        errorExamTotalMark,
        exam
    } = useSelector((state) => state.exam);

    // Update formData whenever title, totalMark, or props change
    useEffect(() => {
        setFormData({
            title,
            totalMark,
            grade,
            groupId,
            sessionId
        });
    }, [title, totalMark, grade, groupId, sessionId]);

    // Unified input change handler
    // Clears errors and optionally resets Redux state
    const handleInputChange = (field, value) => {
        setErrors({}); // Clear all errors
        dispatch(makeStateIsEmpityExam()); // Reset Redux state for exam
        if (field === "title") setTitle(value);
        if (field === "totalMark") setTotalMark(value);
    };

    // State to show success message temporarily
    const [success, setSuccess] = useState(false);

    // Form submission handler
    const onSubmit = async (e) => {
        e.preventDefault();

        // ---------- Frontend Validation ----------
        const validationErrors = validateCreateExam(formData);
        if (validationErrors) {
            // Convert validation errors to an object for easy display
            const errObj = {};
            validationErrors.forEach(err => errObj[err.path] = err.message);
            setErrors(errObj);
            console.log(errObj);
            return; // Stop submission if there are validation errors
        }

        // Dispatch the createExam Redux action
        const res = await dispatch(createExam(formData));

        if (res.payload?.message === "Exam created") {
            // Show success message briefly
            setSuccess(true);
            setTimeout(() => {
                dispatch(getExamBySession(id));
                setSuccess(false);
                setTitle('');
                setTotalMark('');
            }, 1000);
        } else {
            // If exam creation failed, reset Redux state after 2 seconds
            setTimeout(() => {
                dispatch(makeStateIsEmpityExam());
                setTitle('');
                setTotalMark('');
            }, 2000);
        }
    };


    return (
        <Box
            sx={{
                maxWidth: "100%",
                mx: "auto",
                my: 1,
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.mode === "dark" ? "#333" : "#fff",
                color: theme.palette.text.primary,
                boxShadow: 3,
            }}
        >
            {success && <DynamicSnackbar type="success" message={t("exam.created")} />}
            {errorExam && <DynamicSnackbar type="error" message={errorExam} />}
            {errorExamnNetWork && <DynamicSnackbar type="error" message={errorExamnNetWork} />}

            <form onSubmit={onSubmit}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        label={t("exam.titleLabel")}
                        value={title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        required
                        size="small"
                        sx={{ flex: 2 }}
                        error={!!errors?.title || !!errorExamTitle}
                        helperText={errors?.title || errorExamTitle}
                    />

                    <TextField
                        label={t("exam.totalMarkLabel")}
                        type="number"
                        value={totalMark}
                        onChange={(e) => handleInputChange("totalMark", e.target.value)}
                        required
                        size="small"
                        sx={{ width: 120 }}
                        error={!!errors?.totalMark || !!errorExamTotalMark}
                        helperText={errors?.totalMark || errorExamTotalMark}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ height: 40, minWidth: 120, position: "relative" }}
                        disabled={loadingExam}
                    >
                        {loadingExam ? (
                            <CircularProgress size={24} sx={{ color: "white" }} />
                        ) : (
                            t("exam.addExam")
                        )}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default AddExamForm;
