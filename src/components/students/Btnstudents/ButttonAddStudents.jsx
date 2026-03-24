import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Stack,
    Typography,
    MenuItem,
    CircularProgress,
    Alert,
    Divider,
    Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { validateAddStudent } from "../../../utils/validation/addStudentValidation";
import { makeStateIsEmpityStudent } from "../../../features/students/studentSlice";
import { useSearchParams } from "react-router-dom";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    useMediaQuery,
} from "@mui/material";
import { addStudent, getStudents } from "../../../features/students/studentAction";
import DynamicSnackbar from "../../alerts/DynamicSnackbar";
import { buildStudentsUrl } from "../../../utils/studentsUrl/buildUrl";
import { useTranslation } from "react-i18next";

export default function ButttonAddStudents() {
    const { t } = useTranslation();

    // ================== Theme & Media Queries ==================
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // ================== Redux Dispatch ==================
    const dispatch = useDispatch();

    // ================== Local State ==================
    const [open, setOpen] = useState(false); // Dialog open/close
    const [successfully, setSuccessfully] = useState(false); // Success message
    const [formData, setFormData] = useState({
        name: "",
        grade: "",
        phone: "",
        parentPhone: "",
        payment: "",
    }); // Form fields
    const [errors, setErrors] = useState({}); // Frontend validation errors

    // ================== Redux State ==================
    const {
        errorAddStudentName,
        errorAddStudentPhone,
        errorAddStudentParentPhone,
        errorAddStudentPayment,
        errorAddStudentGrade,
        loadingStudent,
        errorAddStudent,
        errorAddStudentNetWork,
    } = useSelector((state) => state.student);

    // ================== URL for fetching students ==================
    const [searchParams] = useSearchParams();
    const url = buildStudentsUrl(searchParams);

    // ================== Handlers ==================

    // Open dialog
    const handleOpen = () => setOpen(true);

    // Close dialog and reset state
    const handleClose = () => {
        setOpen(false);
        dispatch(makeStateIsEmpityStudent()); // Clear Redux error state
        setFormData({ name: "", grade: "", phone: "", parentPhone: "", payment: "" }); // Reset form
        setErrors({}); // Clear frontend validation errors
    };

    // Update form state on input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: null }); // Clear specific field error
        dispatch(makeStateIsEmpityStudent()); // Clear Redux error state
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ================== Frontend Validation with Joi ==================
        const validationErrors = validateAddStudent(formData);
        if (validationErrors) {
            const errObj = {};
            validationErrors.forEach((err) => (errObj[err.path] = err.message));
            setErrors(errObj);
            return; // Stop submission if errors exist
        }

        // ================== Dispatch Add Student Action ==================
        const res = await dispatch(addStudent(formData));

        // If student added successfully
        if (res.type === "student/createStudent/fulfilled" && res.payload.message === "Student created successfully") {
            setSuccessfully(true);
            await dispatch(getStudents(url)); // Refresh students list

            // Close dialog after 1 second
            setTimeout(() => {
                setSuccessfully(false);
                handleClose();
            }, 500);
        }
    };

    return (
        <div>
            {/* Add Button */}
            <Button
                onClick={handleOpen}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    px: 3,
                    transition: "0.3s",
                    "&:hover": {
                        boxShadow: `0 8px 20px ${theme.palette.primary.main}55`,
                    },
                }}
            >
                {t("students.addStudent.title")}
            </Button>

            {/* Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: fullScreen ? 0 : 3,

                    },
                }}
            >
                {/* Header */}
                <DialogTitle
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        color: "#fff",
                        fontWeight: 700,
                        textAlign: "center",
                        py: 2,
                        marginBottom: "20px"
                    }}
                >
                    {t("students.addStudent.title")}

                </DialogTitle>
                <Divider sx={{ mb: 2 }} />

                {/* Content */}
                <DialogContent sx={{ py: 3 }}>
                    {successfully && (

                        <DynamicSnackbar type="success" message={t("students.addStudent.successAdded")}
                        />
                    )}

                    {errorAddStudent && (

                        <DynamicSnackbar type="error" message={errorAddStudent} />
                    )}
                    {errorAddStudentNetWork && (
                        <DynamicSnackbar type="error" message={errorAddStudentNetWork} />
                    )}


                    <Stack spacing={2}>
                        <TextField
                            label={`👤 ${t("students.addStudent.fields.name")}`}

                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors?.name || !!errorAddStudentName}
                            helperText={errors?.name || errorAddStudentName}
                        />

                        <TextField
                            select
                            label={`🎓 ${t("students.addStudent.fields.grade")}`}

                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors?.grade || !!errorAddStudentGrade}
                            helperText={errors?.grade || errorAddStudentGrade}
                        >
                    <MenuItem value="1st">{t("students.gradeFilter.grades.1st")}</MenuItem>
        <MenuItem value="2nd">{t("students.gradeFilter.grades.2nd")}</MenuItem>
        <MenuItem value="3rd">{t("students.gradeFilter.grades.3rd")}</MenuItem>
                        </TextField>

                        <TextField
                            label={`📞 ${t("students.addStudent.fields.phone")}`}
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors?.phone || !!errorAddStudentPhone}
                            helperText={errors?.phone || errorAddStudentPhone}
                        />

                        <TextField
                            label={`👪 ${t("students.addStudent.fields.parentPhone")}`}

                            name="parentPhone"
                            value={formData.parentPhone}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors?.parentPhone || !!errorAddStudentParentPhone}
                            helperText={errors?.parentPhone || errorAddStudentParentPhone}
                        />

                        <TextField
                            label={`💰 ${t("students.addStudent.fields.payment")}`}

                            name="payment"
                            type="number"
                            value={formData.payment}
                            onChange={handleChange}
                            fullWidth
                            inputProps={{ min: 0 }}
                            error={!!errors?.payment || !!errorAddStudentPayment}
                            helperText={errors?.payment || errorAddStudentPayment}
                        />
                    </Stack>
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? theme.palette.background.paper
                                    : theme.palette.grey[100],
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >



                        <Grid container spacing={2}>
                            {/* Location */}
                            <Grid size={6}>
                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {t("students.addStudent.fields.name")}

                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {formData.name || "—"}
                                </Typography>
                            </Grid>

                            {/* Grade */}
                            <Grid size={6}>
                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {t("students.addStudent.fields.grade")}

                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {formData.grade || "—"}
                                </Typography>
                            </Grid>

                            {/* Day */}
                            <Grid size={6}>
                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {t("students.addStudent.fields.phone")}

                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {formData.phone || "—"}
                                </Typography>
                            </Grid>

                            {/* Time */}
                            <Grid size={6}>
                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {t("students.addStudent.fields.parentPhone")}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {formData.parentPhone || "—"}
                                </Typography>
                            </Grid>
                            {/* Time */}
                            <Grid size={6}>
                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {t("students.addStudent.fields.payment")}

                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {formData.payment || "—"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>

                {/* Footer */}
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} variant="outlined" sx={{marginX:"5px"}}>
                                    {t("students.addStudent.actions.cancel")}
                        
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loadingStudent}
                        sx={{
                            px: 4,
                            fontWeight: 600,
                            borderRadius: 2,
                            background: theme.palette.primary.main,
                        }}
                    >
                        {loadingStudent
                                ? t("students.addStudent.actions.saving")
                                : t("students.addStudent.actions.addStudent")}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
