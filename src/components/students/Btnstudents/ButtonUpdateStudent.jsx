import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    CircularProgress,
    Tooltip,
    IconButton,
    Box,
    alpha,
    Divider,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";
import { makeStateIsEmpityStudent } from "../../../features/students/studentSlice";
import { updateStudentById, getStudentById } from "../../../features/students/studentAction";
import { validateUpdateStudent } from "../../../utils/validation/addStudentValidation";
import DynamicSnackbar from "../../alerts/DynamicSnackbar";
import { useTranslation } from "react-i18next";
export default function UpdateStudentDialog({ studentId }) {
    const { t } = useTranslation();
    // ==============================
    // Hooks & Redux
    // ==============================
    // Access MUI theme for styling
    const theme = useTheme();
    // Redux dispatch function to trigger actions
    const dispatch = useDispatch();

    // ==============================
    // Redux State
    // ==============================
    // Destructure student-related state from Redux store
    const {
        studentById,                // Student data fetched by ID
        loadingGetStudentById,      // Loading state for fetching student
        errorGetStudentById,        // Error state for fetching student

        loadingUpdateStudent,       // Loading state for updating student
        errorUpdateStudent,         // General error for update
        errorUpdateStudentNetWork,  // Network error for update

        // Field-specific backend errors
        errorUpdateStudentGrade,
        errorUpdateStudentName,
        errorUpdateStudentPhone,
        errorUpdateStudentParentPhone,
        errorUpdateStudentPayment,
    } = useSelector((state) => state.student);

    // ==============================
    // Local UI State
    // ==============================
    // Dialog open/close state
    const [openDialog, setOpenDialog] = useState(false);
    // Success feedback for submission
    const [success, setSuccess] = useState(false);
    // Validation errors state
    const [errors, setErrors] = useState({});
    // Disable/enable submit button
    const [disabledButton, setDisabledButton] = useState(false);

    // ==============================
    // Form State
    // ==============================
    // Controlled form data for student
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        grade: "",
        parentPhone: "",
        payment: "",
    });

    // ==============================
    // Dialog Handlers
    // ==============================
    // Open dialog
    const handleOpen = () => setOpenDialog(true);

    // Close dialog, reset errors, clear Redux state
    const handleClose = () => {
        setOpenDialog(false);
        setErrors({});
        dispatch(makeStateIsEmpityStudent());
    };

    // ==============================
    // Form Change Handler
    // ==============================
    // Update form data as user types, enable button, clear previous errors
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Enable submit button after edit
        setDisabledButton(true);

        // Clear previous errors and reset Redux state
        setErrors({});
        dispatch(makeStateIsEmpityStudent());
    };

    // ==============================
    // Fetch Student Data When Dialog Opens
    // ==============================
    // Trigger Redux action to fetch student data by ID when dialog opens
    useEffect(() => {
        if (studentId && openDialog) {
            dispatch(getStudentById(studentId));
        }
    }, [studentId, openDialog, dispatch]);

    // ==============================
    // Populate Form When Student Data Arrives
    // ==============================
    // Fill form fields with fetched student data
    useEffect(() => {
        if (studentById) {
            setFormData({
                name: studentById.name || "",
                phone: studentById.phone || "",
                grade: studentById.grade || "",
                parentPhone: studentById.parentPhone || "",
                payment: studentById.payment || "",
            });
        }
    }, [studentById]);

    // ==============================
    // Cleanup When Dialog Closes
    // ==============================
    // Reset form and Redux state when dialog closes
    useEffect(() => {
        if (!openDialog) {
            dispatch(makeStateIsEmpityStudent());
            setDisabledButton(false);
        }
    }, [openDialog, dispatch]);

    // ==============================
    // Submit Handler
    // ==============================
    // Validate form and submit update request
    const handleSubmit = async () => {
        // Run client-side validation
        const validationErrors = validateUpdateStudent(formData);

        // If validation fails, display errors
        if (validationErrors) {
            const errObj = {};
            validationErrors.forEach(
                (err) => (errObj[err.path] = err.message)
            );
            setErrors(errObj);
            return;
        }

        // Clear errors before API call
        setErrors({});

        // Dispatch Redux action to update student
        const res = await dispatch(
            updateStudentById({ studentId, formData })
        ).unwrap();

        // On success, show feedback and close dialog after 1s
        if (res.name) {
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
                handleClose();
            }, 1000);
        }
    };

    return (
        <>
            {/* زر التحديث */}
            <Tooltip title={t("students.updateDialog.tooltip")} arrow>
                <IconButton
                    color="primary"
                    size="small"
                    onClick={handleOpen}
                    sx={{
                        "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                        transition: "all 0.2s ease",
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            {/* Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle
                    sx={{
                        background: `linear-gradient(135deg,
        ${theme.palette.primary.main} 0%,
        ${theme.palette.secondary.main} 100%)`,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "1.25rem",
                        px: 3,
                        py: 2,
                    }}
                >
                    {t("students.updateDialog.title")}
                </DialogTitle>

                <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>

                    {/* Loading */}
                    {loadingGetStudentById && (
                        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {success && <DynamicSnackbar type="success" message={t("students.updateDialog.successUpdated")} />}
                    {/* Errors */}
                    {errorGetStudentById && <DynamicSnackbar type="error" message={errorGetStudentById} />}
                    {errorUpdateStudent && <DynamicSnackbar type="error" message={errorUpdateStudent} />}
                    {errorUpdateStudentNetWork && <DynamicSnackbar type="error" message={errorUpdateStudentNetWork} />}


                    {/* Form */}
                    {!loadingGetStudentById && !errorGetStudentById && (
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            {/* ==============================
        Name Field
        Full-width text input for student name
        Shows validation errors from form or backend
    ============================== */}
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label={`👤 ${t("students.updateDialog.fields.name")}`}

                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.name || !!errorUpdateStudentName}
                                    helperText={errors.name || errorUpdateStudentName}
                                />
                            </Grid>

                            {/* ==============================
        Phone Field
        Text input for student phone number
        Responsive: full-width on xs, half-width on sm
        Shows validation errors from form or backend
    ============================== */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label={`📞 ${t("students.updateDialog.fields.phone")}`}

                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.phone || !!errorUpdateStudentPhone}
                                    helperText={errors.phone || errorUpdateStudentPhone}
                                />
                            </Grid>

                            {/* ==============================
        Grade Field
        Select input for student grade
        Options: 1st, 2nd, 3rd
        Shows validation errors from form or backend
    ============================== */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label={`🎓 ${t("students.updateDialog.fields.grade")}`}

                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    error={!!errors.grade || !!errorUpdateStudentGrade}
                                    helperText={errors.grade || errorUpdateStudentGrade}
                                >
                                    <MenuItem value="1st">{t("students.gradeFilter.grades.1st")}</MenuItem>
                                    <MenuItem value="2nd">{t("students.gradeFilter.grades.2nd")}</MenuItem>
                                    <MenuItem value="3rd">{t("students.gradeFilter.grades.3rd")}</MenuItem>
                                </TextField>
                            </Grid>

                            {/* ==============================
        Parent Phone Field
        Text input for parent's phone number
        Responsive: full-width on xs, half-width on sm
        Shows validation errors from form or backend
    ============================== */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label={`👪 ${t("students.updateDialog.fields.parentPhone")}`}

                                    name="parentPhone"
                                    value={formData.parentPhone}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.parentPhone || !!errorUpdateStudentParentPhone}
                                    helperText={errors.parentPhone || errorUpdateStudentParentPhone}
                                />
                            </Grid>

                            {/* ==============================
        Payment Field
        Number input for payment amount
        Responsive: full-width on xs, half-width on sm
        Shows validation errors from form or backend
    ============================== */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label={`💰 ${t("students.updateDialog.fields.payment")}`}

                                    name="payment"
                                    value={formData.payment}
                                    onChange={handleChange}
                                    error={!!errors.payment || !!errorUpdateStudentPayment}
                                    helperText={errors.payment || errorUpdateStudentPayment}
                                />
                            </Grid>
                        </Grid>

                    )}

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        {/* ==============================
        Name Display
        Shows the student's name or "—" if empty
        Uses secondary text for label, primary text for value
    ============================== */}
                        <Grid size={6}>
                            <Typography
                                sx={{
                                    fontSize: "0.75rem",
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {t("students.updateDialog.fields.name")}
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

                        {/* ==============================
        Grade Display
        Shows the student's grade or "—" if empty
    ============================== */}
                        <Grid size={6}>
                            <Typography
                                sx={{
                                    fontSize: "0.75rem",
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {t("students.updateDialog.fields.grade")}
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

                        {/* ==============================
        Phone Display
        Shows the student's phone number or "—" if empty
    ============================== */}
                        <Grid size={6}>
                            <Typography
                                sx={{
                                    fontSize: "0.75rem",
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {t("students.updateDialog.fields.phone")}

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

                        {/* ==============================
        Parent Phone Display
        Shows the parent's phone number or "—" if empty
    ============================== */}
                        <Grid size={6}>
                            <Typography
                                sx={{
                                    fontSize: "0.75rem",
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {t("students.updateDialog.fields.parentPhone")}

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

                        {/* ==============================
        Payment Display
        Shows the payment amount or "—" if empty
    ============================== */}
                        <Grid size={6}>
                            <Typography
                                sx={{
                                    fontSize: "0.75rem",
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {t("students.updateDialog.fields.payment")}

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

                </DialogContent>

                {!loadingGetStudentById && (
                    // ==============================
                    // Dialog Action Buttons
                    // Displayed only when student data is loaded
                    // ==============================
                    <DialogActions sx={{ px: 3, pb: 2 }}>

                        {/* ==============================
            Cancel Button
            Closes the dialog without saving changes
        ============================== */}
                        <Button onClick={handleClose} variant="outlined" sx={{marginX:"5px"}}>
                            {t("students.updateDialog.actions.cancel")}
                        </Button>

                        {/* ==============================
            Save Changes Button
            Triggers form submission
            Disabled while updating or if no changes made
            Shows loading text when API request is in progress
            Styled with gradient using theme colors
        ============================== */}
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loadingUpdateStudent || !disabledButton}
                            sx={{
                                background: `linear-gradient(135deg,
                    ${theme.palette.primary.main} 0%,
                    ${theme.palette.secondary.main} 100%)`,
                                fontWeight: 600,
                            }}
                        >
                            {loadingUpdateStudent
                                ? t("students.updateDialog.actions.saving")
                                : t("students.updateDialog.actions.saveChanges")}
                        </Button>
                    </DialogActions>
                )}

            </Dialog>

        </>
    );
}
