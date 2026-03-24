import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    CircularProgress,
    Grid,
    Typography,
    Divider,
    Paper,
    IconButton,
    Tooltip,
    FormHelperText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { makeStateIsEmpityGroup } from '../../../../features/groups/groupSlice';
import { formatDay, formatTo12Hour } from '../../../../utils/formatTimeAndData/format';
import { getGroupById, updateGroupById } from '../../../../features/groups/groupAction';
import { validateUpdateGroup } from '../../../../utils/validation/addGroupValidation';
import DynamicSnackbar from '../../../alerts/DynamicSnackbar';
import { useTranslation } from "react-i18next";

export default function BtnUpdateGroup({ groupId }) {
    const { t } = useTranslation();

    // ==============================
    // Theme
    // ==============================
    const theme = useTheme(); // Access MUI theme for colors, spacing, and dark/light mode

    // ==============================
    // Redux
    // ==============================
    const dispatch = useDispatch(); // Dispatch actions to the Redux store

    // Extract group-related state from Redux
    const {
        loadingGetGroupById,          // Loading state when fetching group by ID
        errorGetGroupById,            // Backend error when fetching group
        errorGetGroupByIdNetWork,     // Network error when fetching group
        GroupById,                     // Fetched group data

        loadingUpdateGroup,           // Loading state when updating group
        errorUpdateGroup,             // Backend error when updating group
        errorUpdateGroupNetWork,      // Network error when updating group

        // Field-specific backend errors for form validation
        errorUpdateGroupName,
        errorUpdateGroupPrice,
        errorUpdateGroupGrade,
        errorUpdateGroupTime,
        errorUpdateGroupDay,
        errorUpdateGroupPlace,
    } = useSelector((state) => state.group);

    // ==============================
    // Local UI State
    // ==============================
    const [openDialog, setOpenDialog] = useState(false); // Dialog visibility
    const [success, setSuccess] = useState(false);       // Success feedback for update
    const [errors, setErrors] = useState({});           // Client-side validation errors

    // ==============================
    // Static Data
    // ==============================
    const grades = ["1st", "2nd", "3rd"]; // Options for grade dropdown
    const days = [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
    ]; // Options for day dropdown

    // ==============================
    // Form State
    // ==============================
    const [formData, setFormData] = useState({
        place: "",  // Group location
        name: "",   // Group name
        grade: "",  // Grade level
        time: "",   // Group time
        day: "",    // Group day
        price: 0,   // Price per session
    });

    // ==============================
    // Dialog Handlers
    // ==============================
    const handleOpen = () => setOpenDialog(true); // Open the dialog

    const handleClose = () => {
        setOpenDialog(false);   // Close dialog
        setErrors({});          // Reset validation errors
        dispatch(makeStateIsEmpityGroup()); // Reset Redux state for form
    };

    // ==============================
    // Fetch Group Data When Dialog Opens
    // ==============================
    useEffect(() => {
        if (groupId && openDialog) {
            dispatch(getGroupById(groupId)); // Fetch group info from backend
        }
    }, [groupId, openDialog, dispatch]);

    // ==============================
    // Populate Form When Group Data Arrives
    // ==============================
    useEffect(() => {
        if (GroupById) {
            setFormData({
                place: GroupById.place || "",
                name: GroupById.name || "",
                grade: GroupById.grade || "",
                time: GroupById.time || "",
                day: GroupById.day || "",
                price: GroupById.price || 0,
            });
        }
    }, [GroupById]);

    // ==============================
    // Helpers
    // ==============================
    // You can define additional helper functions here if needed

    // ==============================
    // Form Handlers
    // ==============================
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form state dynamically
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear field-specific errors when user edits
        setErrors({});
        dispatch(makeStateIsEmpityGroup()); // Reset Redux field errors
    };

    // ==============================
    // Submit Handler
    // ==============================
    const handleSubmit = async () => {
        // ==============================
        // Client-side validation
        // ==============================
        const validationErrors = validateUpdateGroup(formData);

        if (validationErrors) {
            const errObj = {};
            validationErrors.forEach(
                (err) => (errObj[err.path] = err.message)
            );
            setErrors(errObj); // Show validation errors
            return;
        }

        // ==============================
        // API request to update group
        // ==============================
        const res = await dispatch(
            updateGroupById({ groupId, formData })
        ).unwrap();

        // ==============================
        // Success feedback
        // ==============================
        if (res.message === "group updated successfully") {
            setSuccess(true);

            // Auto-close dialog after 1 second
            setTimeout(() => {
                setSuccess(false);
                handleClose();
            }, 1000);
        }
    };

    return (
        <>

            {/* // ============================== // UI: Edit Button with Tooltip  // ============================== */}
            <Tooltip title={t("groups.update.edit")}>
                <IconButton
                    color="primary" // Uses primary color from MUI theme
                    size="small"    // Small button size
                    onClick={(e) => {
                        e.currentTarget.blur(); // Remove focus to prevent outline after click
                        handleOpen();           // Call handler to open edit dialog
                    }}
                    sx={{
                        borderRadius: 1,              // Slightly rounded corners
                        transition: "all 0.2s ease",  // Smooth transition for hover effects
                        "&:hover": {
                            background: `${theme.palette.primary.main}15`, // Slightly tinted hover background
                        },
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>



            <Dialog
                open={openDialog}
                onClose={handleClose}
                container={() => document.body}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2.5,
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 20px 60px rgba(0,0,0,0.7)'
                            : '0 20px 60px rgba(0,0,0,0.3)',
                    },
                }}
            >
                {/* ============================== Header Section for Update Group Dialog============================== */}
                <Box
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, // Gradient background
                        color: '#fff',                       // White text/icons
                        p: 3,                                // Padding
                        display: 'flex',                     // Flex layout
                        justifyContent: 'space-between',     // Space between title and close button
                        alignItems: 'center',                // Vertically center content
                        borderRadius: '2.5px 2.5px 0 0',     // Rounded top corners
                    }}
                >
                    {/* Left: Icon + Title */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <EditIcon sx={{ fontSize: 28 }} />  {/* Edit icon */}
                        <Typography fontWeight="bold" fontSize="1.5rem">
                            {t("groups.update.title")}                      {/* Header text */}
                        </Typography>
                    </Box>

                    {/* Right: Close Button */}
                    <IconButton
                        onClick={handleClose}                 // Close the dialog when clicked
                        disabled={loadingGetGroupById}       // Disable button while loading
                        sx={{
                            color: '#fff',                   // White color
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, // Hover effect
                        }}
                    >
                        <CloseIcon />                        {/* Close icon */}
                    </IconButton>
                </Box>


                <DialogContent sx={{ p: 3 }}>
                    {/* Loading */}
                    {loadingGetGroupById && (<Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>  <CircularProgress /> </Box>)}
                    {success && <DynamicSnackbar type="success" message={t("groups.update.success")} />}
                    {/* Errors */}
                    {errorGetGroupById && <DynamicSnackbar type="error" message={errorGetGroupById} />}
                    {errorUpdateGroup && <DynamicSnackbar type="error" message={errorUpdateGroup} />}
                    {errorUpdateGroupNetWork && (
                        <DynamicSnackbar type="error" message={errorUpdateGroupNetWork} />
                    )}
                    {/* Form Fields */}
                    {!loadingGetGroupById && !errorGetGroupById && !errorGetGroupByIdNetWork ? <>
                        {/* ============================== Paper Container for Update Group Form============================== */}
                        <Paper
                            elevation={0}   // No shadow
                            sx={{
                                p: 3,       // Padding inside the paper
                                bgcolor: theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.05)'
                                    : 'rgba(0,0,0,0.02)', // Background adapts to theme
                                borderRadius: 2, // Rounded corners
                                border: `1px solid ${theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.1)'
                                    : 'rgba(0,0,0,0.06)'
                                    }`,
                            }}
                        >
                            <Grid container spacing={2}>
                                {/* ================== Name Field ================== */}
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        fullWidth
                                        autoFocus                         // Focus on this field initially
                                        label={`📋 ${t("groups.fields.name")}`}
                                        name="name"
                                        value={formData.name || ""}       // Controlled input
                                        onChange={handleChange}           // Update state on change
                                        disabled={loadingUpdateGroup}     // Disable while loading
                                        variant="outlined"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                                "&:hover fieldset": {
                                                    borderColor: theme.palette.primary.main, // Hover border
                                                },
                                            },
                                        }}
                                        error={!!errors?.name || !!errorUpdateGroupName} // Show error
                                        helperText={errors?.name || errorUpdateGroupName} // Show helper text
                                    />
                                </Grid>

                                {/* ================== Price Field ================== */}
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        fullWidth
                                        label={`💰 ${t("groups.fields.pricePerSession")}`}
                                        name="price"
                                        type="number"
                                        value={formData.price || ""}
                                        onChange={handleChange}
                                        disabled={loadingUpdateGroup}
                                        variant="outlined"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                                "&:hover fieldset": {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                            },
                                        }}
                                        error={!!errors?.price || !!errorUpdateGroupPrice}
                                        helperText={errors?.price || errorUpdateGroupPrice}
                                    />
                                </Grid>

                                {/* ================== Place Field ================== */}
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        fullWidth
                                        label={`📍 ${t("groups.fields.place")}`}
                                        name="place"
                                        value={formData.place || ""}
                                        onChange={handleChange}
                                        disabled={loadingUpdateGroup}
                                        variant="outlined"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                                "&:hover fieldset": {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                            },
                                        }}
                                        error={!!errors?.place || !!errorUpdateGroupPlace}
                                        helperText={errors?.place || errorUpdateGroupPlace}
                                    />
                                </Grid>

                                {/* ================== Grade Select ================== */}
                                <Grid size={{ xs: 6 }}>
                                    <FormControl
                                        fullWidth
                                        disabled={loadingUpdateGroup}
                                        error={!!errors?.grade || !!errorUpdateGroupGrade}
                                    >
                                        <InputLabel>{`🎓 ${t("groups.fields.grade")}`}</InputLabel>
                                        <Select
                                            name="grade"
                                            value={formData.grade || ""}
                                            onChange={handleChange}
                                            label="🎓 Grade"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {grades.map((grade) => (
                                                <MenuItem key={grade} value={grade}>
                                                    {grade}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {errors?.grade || errorUpdateGroupGrade}
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>

                                {/* ================== Day Select ================== */}
                                <Grid size={{ xs: 6 }}>
                                    <FormControl
                                        fullWidth
                                        disabled={loadingUpdateGroup}
                                        error={!!errors?.day || !!errorUpdateGroupDay}
                                    >
                                        <InputLabel>{`📅 ${t("groups.fields.day")}`}</InputLabel>
                                        <Select
                                            name="day"
                                            value={formData.day || ""}
                                            onChange={handleChange}
                                            label={`⏰ ${t("groups.fields.time")}`}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {days.map((day) => (
                                                <MenuItem key={day} value={day}>
                                                    {t(`groups.days.${day}`)}

                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {errors?.day || errorUpdateGroupDay}
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>

                                {/* ================== Time Field ================== */}
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        fullWidth
                                        label={`⏰ ${t("groups.fields.time")}`}

                                        name="time"
                                        type="time"
                                        value={formData.time || ""}
                                        onChange={handleChange}
                                        disabled={loadingUpdateGroup}
                                        InputLabelProps={{ shrink: true }} // Keeps label above input
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            },
                                        }}
                                        error={!!errors?.time || !!errorUpdateGroupTime}
                                        helperText={errors?.time || errorUpdateGroupTime}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* ============================== Summary Box: Shows current group details============================== */}
                        <Box
                            sx={{
                                mt: 3, // Margin top
                                p: 2.5, // Padding inside the box
                                bgcolor:
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(255,255,255,0.05)'  // Light overlay in dark mode
                                        : 'rgba(0,0,0,0.02)',       // Light overlay in light mode
                                borderRadius: 2, // Rounded corners
                                border: `1px solid ${theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.08)' // Slight border in dark mode
                                    : 'rgba(0,0,0,0.04)'       // Slight border in light mode
                                    }`,
                            }}
                        >
                            {/* Title */}
                            <Typography fontSize="0.85rem" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                                📋 {t("groups.update.summary")}

                            </Typography>

                            <Divider sx={{ mb: 2 }} /> {/* Separator */}

                            {/* Grid container for group fields */}
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

                                {/* Name */}
                                <Grid size={{ xs: 2, sm: 4, md: 2 }}>
                                    <Typography fontSize="0.75rem" color="text.secondary" sx={{ opacity: 0.7 }}>
                                        👤 {t("groups.fields.name")}
                                    </Typography>
                                    <Typography fontSize="0.95rem" fontWeight={700}>
                                        {formData.name || '—'} {/* Fallback if empty */}
                                    </Typography>
                                </Grid>

                                {/* Price */}
                                <Grid size={{ xs: 2, sm: 4, md: 2 }}>
                                    <Typography fontSize="0.75rem" color="text.secondary" sx={{ opacity: 0.7 }}>
                                        💰 {t("groups.fields.price")}
                                    </Typography>
                                    <Typography fontSize="0.95rem" fontWeight={700}>
                                        {formData.price || '—'}
                                    </Typography>
                                </Grid>

                                {/* Place */}
                                <Grid size={{ xs: 2, sm: 4, md: 2 }}>
                                    <Typography fontSize="0.75rem" color="text.secondary" sx={{ opacity: 0.7 }}>
                                        📍 {t("groups.fields.place")}
                                    </Typography>
                                    <Typography fontSize="0.95rem" fontWeight={700}>
                                        {formData.place || '—'}
                                    </Typography>
                                </Grid>

                                {/* Grade */}
                                <Grid size={{ xs: 2, sm: 4, md: 2 }}>
                                    <Typography fontSize="0.75rem" color="text.secondary" sx={{ opacity: 0.7 }}>
                                        🎓 {t("groups.fields.grade")}
                                    </Typography>
                                    <Typography fontSize="0.95rem" fontWeight={700}>
                                        {formData.grade || 0}
                                    </Typography>
                                </Grid>

                                {/* Students Count */}
                                <Grid size={{ xs: 2, sm: 4, md: 2 }}>
                                    <Typography fontSize="0.70rem" color="text.secondary" sx={{ opacity: 0.7 }}>
                                        🎓 {t("groups.fields.students")}
                                    </Typography>
                                    <Typography fontSize="0.95rem" fontWeight={700}>
                                        {GroupById?.studentIds?.length || 0} {/* Count of students */}
                                    </Typography>
                                </Grid>

                                {/* Day & Time */}
                                <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                                    <Typography fontSize="0.75rem" color="text.secondary" sx={{ opacity: 0.7 }}>
                                        {t("groups.fields.dayTime")}
                                    </Typography>
                                    <Typography fontSize="0.95rem" fontWeight={700}>
                                        {formData.day && formData.time
                                            ? `${formatDay(formData.day)} · ${formatTo12Hour(formData.time)}` // Formatted display
                                            : "—"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>


                    </> : ""



                    }


                </DialogContent>
                {/* ==============================  Action Buttons: Cancel & Submit============================== */}
                <Box
                    sx={{
                        p: 3, // Padding
                        display: 'flex', // Flex layout
                        justifyContent: 'flex-end', // Align buttons to the right
                        gap: 2, // Space between buttons
                        borderTop: `1px solid ${theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.1)' // Top border in dark mode
                            : 'rgba(0,0,0,0.06)'     // Top border in light mode
                            }`,
                        bgcolor:
                            theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.02)' // Background color dark mode
                                : 'rgba(0,0,0,0.01)',      // Background color light mode
                    }}
                >
                    {/* Cancel Button */}
                    <Button
                        onClick={handleClose}          // Close dialog on click
                        disabled={loadingUpdateGroup}  // Disable while loading
                        sx={{
                            textTransform: 'none',      // Keep text normal
                            fontSize: '0.95rem',        // Slightly smaller text
                            px: 3,                       // Horizontal padding
                            borderRadius: 2,             // Rounded corners
                            border: `1px solid ${theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.2)'
                                : 'rgba(0,0,0,0.2)'
                                }`,
                            '&:hover': {
                                bgcolor: `${theme.palette.primary.main}10`, // Light hover background
                            },
                        }}
                    >
                        {t("groups.actions.cancel")}
                    </Button>

                    {/* Submit / Update Button */}
                    <Button
                        onClick={handleSubmit}        // Call submit handler
                        disabled={loadingUpdateGroup}  // Disable while loading
                        variant="contained"            // MUI contained button
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`, // Gradient bg
                            color: '#fff',              // White text
                            textTransform: 'none',      // Keep text normal
                            fontSize: '0.95rem',        // Slightly smaller text
                            px: 4,                       // Horizontal padding
                            borderRadius: 2,             // Rounded corners
                            boxShadow: `0 4px 15px ${theme.palette.primary.main}40`, // Soft shadow
                            transition: 'all 0.3s ease', // Smooth hover effect
                            '&:hover': {
                                boxShadow: `0 6px 20px ${theme.palette.primary.main}60`, // Stronger shadow on hover
                                transform: 'translateY(-2px)',                               // Lift effect
                            },
                            display: 'flex',            // Flex to align loading icon and text
                            alignItems: 'center',
                            gap: 1,                     // Gap between icon and text
                        }}
                    >
                        {/* Show spinner when loading */}
                        {loadingUpdateGroup && <CircularProgress size={20} color="inherit" />}
                        {loadingUpdateGroup ? t("groups.update.updating") : `✓ ${t("groups.update.updateBtn")}`}

                    </Button>
                </Box>

            </Dialog >
        </>
    );
}
