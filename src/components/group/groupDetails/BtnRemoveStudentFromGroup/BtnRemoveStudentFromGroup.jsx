import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    Box,
    Typography,
    Avatar,
    Divider,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupById, removeStudentFromGroup } from '../../../../features/groups/groupAction';
import { useParams } from 'react-router-dom';
import { makeStateIsEmpityGroup } from '../../../../features/groups/groupSlice';
import DynamicSnackbar from '../../../alerts/DynamicSnackbar';
import { useTranslation } from "react-i18next";

export default function BtnRemoveStudentFromGroup({
    student,
    groupName,
}) {
    const { t, i18n } = useTranslation();
 

    // MUI theme hook
    const theme = useTheme();

    // -------------------------
    // Component State
    // -------------------------
    const [isOpen, setIsOpen] = useState(false);        // Controls whether the confirmation dialog is open
    const [success, setSuccess] = useState(false);      // Shows a temporary success message after removing a student

    // -------------------------
    // Redux & Routing
    // -------------------------
    const dispatch = useDispatch();                     // Redux dispatch function
    const { id } = useParams();                         // Get the current group ID from URL
    const { loadingRemoveStudentFromGroup, errorRemoveStudentFromGroup } = useSelector((state) => state.group);
    // Extract loading and error state for removing a student from Redux store

    // -------------------------
    // Event Handlers
    // -------------------------

    /**
     * Open the confirmation dialog
     */
    const handleOpenDialog = () => {
        setIsOpen(true);
    };

    /**
     * Close the confirmation dialog
     * Only allows closing if the remove operation is not currently loading
     * Resets the group-related state using makeStateIsEmpityGroup
     */
    const handleCloseDialog = () => {
        if (!loadingRemoveStudentFromGroup) {
            dispatch(makeStateIsEmpityGroup());
            setIsOpen(false);
        }
    };

    /**
     * Remove a student from the current group
     * - Dispatches removeStudentFromGroup action
     * - Shows a success message if removal is successful
     * - Refreshes the group details after 1 second
     */
    const handleRemove = async () => {
        const res = await dispatch(removeStudentFromGroup({ groupId: id, studentId: student._id }));

        // Check if removal was successful
        if (res.type === "group/removeStudentFromGroup/fulfilled" && res.payload.message === 'Student removed successfully') {
            setSuccess(true);

            // Automatically hide success message and refresh group details
            setTimeout(() => {
                setSuccess(false);
                dispatch(getGroupById(id)); // Refresh group data
                handleCloseDialog();        // Close the dialog
            }, 1000);
        }
    };

    return (
        <>
            {/* ================= Delete Button ================= */}
            <Tooltip title={t("groups.removeStudent.tooltip")}>
                <IconButton color="error" size="small" onClick={handleOpenDialog}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            {/* ================= Confirmation Dialog ================= */}
            <Dialog
                open={isOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        boxShadow:
                            theme.palette.mode === "dark"
                                ? "0 8px 30px rgba(0,0,0,0.6)"
                                : "0 6px 20px rgba(0,0,0,0.15)",
                    },
                }}
            >
                {/* ================= Header ================= */}
                <Box
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                        color: theme.palette.getContrastText(theme.palette.error.main),
                        p: 2.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: "16px 16px 0 0",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <WarningIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
                            {t("groups.removeStudent.title")}
                        </Typography>
                    </Box>

                    <Button
                        onClick={handleCloseDialog}
                        disabled={loadingRemoveStudentFromGroup}
                        sx={{
                            minWidth: "auto",
                            color: theme.palette.getContrastText(theme.palette.error.main),
                            p: 0.5,
                            "&:hover": {
                                bgcolor:
                                    theme.palette.mode === "dark"
                                        ? "rgba(255,255,255,0.15)"
                                        : "rgba(0,0,0,0.08)",
                            },
                        }}
                    >
                        <CloseIcon />
                    </Button>
                </Box>

                {/* ================= Content ================= */}
                <DialogContent sx={{ p: 3 }}>
                    {errorRemoveStudentFromGroup && (
                        <DynamicSnackbar type="error" message={errorRemoveStudentFromGroup} />
                    )}

                    {success && (
                        <DynamicSnackbar type="success" message={t("groups.removeStudent.success")} />
                    )}

                    {/* Warning Box */}
                    <Box
                        sx={{
                            p: 2.5,
                            mb: 2.5,
                            borderRadius: "12px",
                            bgcolor: theme.palette.warning.main + "15",
                            border: `1.5px solid ${theme.palette.warning.main}40`,
                            display: "flex",
                            gap: 1.5,
                            alignItems: "flex-start",
                        }}
                    >
                        <WarningIcon
                            sx={{
                                color: theme.palette.warning.main,
                                fontSize: 20,
                                mt: 0.5,
                                flexShrink: 0,
                            }}
                        />
                        <Box>
                            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                                {t("groups.removeStudent.areYouSure")}
                            </Typography>
                            <Typography sx={{ fontSize: "0.9rem", opacity: 0.8 }}>
                                {t("groups.removeStudent.warningText")}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Student Card */}
                    <Box
                        sx={{
                            p: 2.5,
                            borderRadius: "12px",
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            mb: 2.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                opacity: 0.6,
                                mb: 1.5,
                                textTransform: "uppercase",
                            }}
                        >
                            👤 {t("groups.removeStudent.studentInfo")}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <Avatar
                                sx={{
                                    width: 50,
                                    height: 50,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    color: theme.palette.getContrastText(theme.palette.primary.main),
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                }}
                            >
                                {student?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
                            </Avatar>

                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ fontWeight: 600 }}>{student?.name}</Typography>
                                <Typography sx={{ fontSize: "0.85rem", opacity: 0.7 }}>
                                    {student?.phone || t("groups.dash")}
                                </Typography>
                            </Box>
                        </Box>

                        {student?.grade && (
                            <>
                                <Divider sx={{ my: 1.5 }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography sx={{ fontSize: "0.85rem", opacity: 0.7 }}>
                                        {t("groups.grade")}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            color: theme.palette.primary.main,
                                            bgcolor: theme.palette.primary.main + "15",
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: "20px",
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        {student.grade}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Box>

                    {/* Group Info */}
                    <Box>
                        <Typography sx={{ fontSize: "0.85rem", opacity: 0.6, mb: 0.5 }}>
                            📍 {t("groups.removeStudent.removingFrom")}
                        </Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                            {groupName || t("groups.removeStudent.groupFallback")}
                        </Typography>
                    </Box>
                </DialogContent>

                {/* ================= Actions ================= */}
                <Box
                    sx={{
                        p: 3,
                        display: "flex",
                        gap: 1.5,
                        justifyContent: "flex-end",
                        borderTop: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    }}
                >
                    <Button
                        onClick={handleCloseDialog}
                        disabled={loadingRemoveStudentFromGroup}
                        sx={{
                            textTransform: "none",
                            px: 3,
                            borderRadius: "8px",
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        {t("groups.actions.cancel")}
                    </Button>

                    <Button
                        onClick={handleRemove}
                        disabled={loadingRemoveStudentFromGroup}
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                            color: theme.palette.getContrastText(theme.palette.error.main),
                            textTransform: "none",
                            px: 3,
                            borderRadius: "8px",
                            boxShadow: `0 4px 15px ${theme.palette.error.main}40`,
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            "&:hover": {
                                boxShadow: `0 6px 20px ${theme.palette.error.main}60`,
                            },
                        }}
                    >
                        {loadingRemoveStudentFromGroup ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <>
                                <DeleteIcon sx={{ fontSize: 18 }} />
                                {t("groups.removeStudent.action")}
                            </>
                        )}
                    </Button>
                </Box>
            </Dialog>

        </>
    );
}
