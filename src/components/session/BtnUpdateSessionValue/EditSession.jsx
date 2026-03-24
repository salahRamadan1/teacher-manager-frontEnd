import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, useTheme } from "@mui/material";
import { Update, School, Groups, LocationOn, Class } from "@mui/icons-material";

import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { validateUpdateValueSession } from "../../../utils/validation/sessionsValidations";
import DynamicSnackbar from "../../alerts/DynamicSnackbar";
import { getSession, updateSessionById } from "../../../features/session/sessionAction";
import { useParams } from "react-router-dom";
import { makeStateIsEmpitySession } from "../../../features/session/sessionSlice";
import { useTranslation } from "react-i18next";
export default function EditSession({ sessionById }) {
    const { t } = useTranslation();
    // =========================
    // MUI theme for colors and spacing
    // =========================
    const theme = useTheme();

    // =========================
    // Local state
    // =========================
    const [errors, setErrors] = useState({}); // Stores validation errors for form fields
    const [openDialog, setOpenDialog] = useState(false); // Controls dialog open/close state
    const [formValues, setFormValues] = useState({
        centerPrice: sessionById.centerPrice || "",
        sessionPrice: sessionById.sessionPrice || "",
        description: sessionById.description || "",
        place: sessionById.place || "",
    });

    // =========================
    // URL params & Redux
    // =========================
    const { id } = useParams(); // Get sessionId from URL
    const dispatch = useDispatch(); // Redux dispatcher

    // =========================
    // Redux state selectors
    // Tracks loading & error states for session update API
    // =========================
    const {
        loadingUpdateSession,
        errorUpdateSession,
        errorUpdateSessionNetWork,
        errorUpdateSessionPlace,
        errorUpdateSessionDescription,
        errorUpdateSessionPrice,
        errorUpdateSessionCenterPrice,
    } = useSelector((state) => state.session);

    // =========================
    // Handle form input changes
    // Updates form values and resets errors
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setErrors({}); // Clear previous validation errors
        dispatch(makeStateIsEmpitySession()); // Reset temporary Redux state
    };

    // =========================
    // Handle session update
    // Validates form, sends API request, and refreshes session
    // =========================
    const handleUpdate = async () => {
        const validationErrors = validateUpdateValueSession(formValues);

        // If validation fails, map errors by field
        if (validationErrors) {
            const errObj = {};
            validationErrors.forEach(
                (err) => (errObj[err.path] = err.message)
            );
            console.log(errObj);
            setErrors(errObj);
            return;
        }

        console.log("Updated values:", formValues);

        // Dispatch API call to update session
        const res = await dispatch(updateSessionById({ sessionId: id, formValues })).unwrap();
        console.log(res);

        // If update succeeds, refresh session data and close dialog
        if (res.message === 'Session data updated successfully') {
            dispatch(getSession(id));
            handleClosedailog();
        }
    };

    // =========================
    // Open dialog and populate form with current session data
    // =========================
    const handleOpendailog = () => {
        setOpenDialog(true);
        setFormValues({
            centerPrice: sessionById.centerPrice || "",
            sessionPrice: sessionById.sessionPrice || "",
            description: sessionById.description || "",
            place: sessionById.place || "",
        });
    };

    // =========================
    // Close dialog and reset errors / temporary Redux state
    // =========================
    const handleClosedailog = () => {
        setOpenDialog(false);
        setErrors({});
        dispatch(makeStateIsEmpitySession());
    };

    // =========================
    // useEffect for any side-effects when sessionId changes
    // Currently empty, but can be used for fetching session data or resetting state
    // =========================
    useEffect(() => {

    }, [id]);


    return (
        <Box
            sx={{
                p: 3,
                borderRadius: 2,
            }}
        >
            {/* أيقونة Edit */}
            <IconButton
                aria-label={t("sessionUpdate.edit")}
                sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    bgcolor: theme.palette.mode === "dark" ? "#2c2c2c" : "#e0e0e0",
                    "&:hover": {
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.common.white,
                    },
                }}
                onClick={handleOpendailog}
            >
                <EditIcon />
            </IconButton>

            {errorUpdateSession && <DynamicSnackbar type="error" message={errorUpdateSession} />}
            {errorUpdateSessionNetWork && <DynamicSnackbar type="error" message={errorUpdateSessionNetWork} />}

            <Dialog open={openDialog} onClose={handleClosedailog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ bgcolor: theme.palette.mode === "dark" ? "#1f1f1f" : "#f5f5f5" }}>
                    {t("sessions.sessionUpdate.updateTitle")}
                </DialogTitle>

                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label={t("sessions.sessionUpdate.sessionPrice")}
                        name="sessionPrice"
                        type="number"
                        value={formValues.sessionPrice}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={!!errors.sessionPrice || !!errorUpdateSessionPrice}
                        helperText={errors.sessionPrice || errorUpdateSessionPrice}
                        InputProps={{
                            style: {
                                backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
                                color: theme.palette.text.primary,
                            },
                        }}
                        sx={{ mt: 3 }}
                    />

                    <TextField
                        label={t("sessions.sessionUpdate.centerPrice")}
                        name="centerPrice"
                        type="number"
                        value={formValues.centerPrice}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={!!errors.centerPrice || !!errorUpdateSessionCenterPrice}
                        helperText={errors.centerPrice || errorUpdateSessionCenterPrice}
                        InputProps={{
                            style: {
                                backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
                                color: theme.palette.text.primary,
                            },
                        }}
                    />

                    <TextField
                        label={t("sessions.sessionUpdate.place")}
                        name="place"
                        value={formValues.place}
                        onChange={handleChange}
                        error={!!errors.place || !!errorUpdateSessionPlace}
                        helperText={errors.place || errorUpdateSessionPlace}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            style: {
                                backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
                                color: theme.palette.text.primary,
                            },
                        }}
                    />

                    <TextField
                        label={t("sessions.sessionUpdate.description")}
                        name="description"
                        multiline
                        rows={3}
                        value={formValues.description}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={!!errors.description || !!errorUpdateSessionDescription}
                        helperText={errors.description || errorUpdateSessionDescription}
                        InputProps={{
                            style: {
                                backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
                                color: theme.palette.text.primary,
                            },
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClosedailog} color="inherit">
                        {t("sessions.sessionUpdate.cancel")}
                    </Button>

                    <Button variant="contained" onClick={handleUpdate}>
                        {loadingUpdateSession ? t("sessions.sessionUpdate.saving") : t("sessions.sessionUpdate.saveChanges")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
