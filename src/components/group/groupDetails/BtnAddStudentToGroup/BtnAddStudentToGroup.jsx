import React, { useEffect, useState } from 'react';
import PeopleIcon from '@mui/icons-material/People';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    TextField,
    Box,
    Typography,
    Divider,
    Checkbox,
    Avatar,
    Chip,
    IconButton,
    Paper,
    useTheme,
    Grid,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    PersonAdd as PersonAddIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Grade as GradeIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getStudents } from '../../../../features/students/studentAction';
import { NavLink, useParams } from 'react-router-dom';
import { addStudentsToGroup, getGroupById } from '../../../../features/groups/groupAction';
import { makeStateIsEmpityGroup } from '../../../../features/groups/groupSlice';
import DynamicSnackbar from '../../../alerts/DynamicSnackbar';
import { useTranslation } from "react-i18next";

export default function BtnAddStudentToGroup({ onAddStudent, grade }) {
    const { t } = useTranslation();
    // =========================
    // Theme
    // =========================

    // MUI theme hook (used for colors, dark/light mode styles, etc.)
    const theme = useTheme();


    // =========================
    // Component State
    // =========================

    // Controls whether the "Add Students" dialog is open or closed
    const [openDialog, setOpenDialog] = useState(false);

    // Used to show success feedback after adding students
    const [success, setSuccess] = useState(false);

    // Local search input used for filtering students on the UI
    const [searchQuery, setSearchQuery] = useState('');

    // Current page number for pagination
    const [page, setPage] = useState(1);

    // Keyword sent to backend for searching students
    const [keyword, setKeyword] = useState('');

    // Get current group ID from the URL params
    const { id } = useParams();

    // Stores IDs of selected students to be added to the group
    const [selectedStudents, setSelectedStudents] = useState([]);


    // =========================
    // Redux
    // =========================

    // Redux dispatch function
    const dispatch = useDispatch();

    // Students state from Redux store
    const {
        loadingGetStudent,          // Loading state for fetching students
        errorGetStudent,            // Backend error
        errorGetStudentNetWork,     // Network error
        totalPages,                 // Total number of pages (pagination)
        students,                   // Students list
        totalStudents,              // Total number of students
    } = useSelector((state) => state.student);

    // Group-related state (adding students)
    const {
        loadingAddStudents,         // Loading state while adding students
        errorAddStudents,           // Error while adding students
    } = useSelector((state) => state.group);


    // =========================
    // Derived Data
    // =========================

    // Filter students locally:
    // 1. Exclude students already assigned to a group
    // 2. Search by name or phone number
    const filteredStudents = students.filter(
        (student) =>
            !student.groupId && // Exclude students already in another group
            (
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.phone.includes(searchQuery)
            )
    );


    // Helper function: Get initials from student full name
    // Example: "Ahmed Salah" → "AS"
    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };


    // =========================
    // Event Handlers
    // =========================

    // Open dialog and reset related states
    const handleOpenDialog = () => {
        setOpenDialog(true);
        setSelectedStudents([]); // Clear previously selected students
        setSearchQuery('');      // Reset local search input
        fetchStudents();         // Fetch students for the current group
    };

    // Close dialog and reset selections
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStudents([]); // Clear selected students on close
        dispatch(makeStateIsEmpityGroup()); // Reset group-related redux state
    };

    // Toggle student selection (select / unselect)
    const handleStudentToggle = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId) // Remove if already selected
                : [...prev, studentId]                  // Add if not selected
        );

        // Clear previous group state errors/messages
        dispatch(makeStateIsEmpityGroup());
    };

    // Add selected existing students to the group
    const handleAddExistingStudents = async () => {
        if (selectedStudents.length === 0) return;

        const res = await dispatch(
            addStudentsToGroup({
                groupId: id,
                studentIds: selectedStudents,
            })
        );

        // Show success feedback if request succeeded
        if (
            res.type === "group/addStudentsToGroup/fulfilled" &&
            res.payload.message === "Students added successfully"
        ) {
            setSuccess(true);

            // Close dialog and refresh group data after short delay
            setTimeout(() => {
                setSuccess(false);
                dispatch(getGroupById(id));
                handleCloseDialog();
            }, 1000);
        }
    };


    // =========================
    // Data Fetching
    // =========================

    // Fetch students from backend with pagination and filters
    const fetchStudents = () => {
        let url = `/student/getStudents?page=${page}&groupId=${id}`;

        // Optional search keyword
        if (keyword) url += `&keyword=${keyword}`;

        // Optional grade filter
        if (grade) url += `&grade=${grade}`;

        dispatch(getStudents(url));
    };

    // Re-fetch students whenever page, keyword, dialog state, or grade changes
    useEffect(() => {
        if (openDialog) fetchStudents();
    }, [page, keyword, openDialog, grade]);


    return (
        <>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
                sx={(theme) => ({
                    my: 3,
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderRadius: 2.5,
                    boxShadow: 4,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    color: theme.palette.primary.contrastText,
                    backgroundColor: theme.palette.mode === 'light'
                        ? theme.palette.primary.main
                        : theme.palette.primary.light,
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'light'
                            ? theme.palette.primary.dark
                            : theme.palette.primary.main,
                        boxShadow: 6,
                    },
                    '&:active': {
                        transform: 'scale(0.97)',
                    },
                })}
            >
                {t("groups.addStudents.openBtn")}
            </Button>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                {/* Dialog Header */}
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Title with Icon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonAddIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight={700}>
                            {t("groups.addStudents.title")}
                        </Typography>
                    </Box>

                    {/* Close Button */}
                    <IconButton onClick={handleCloseDialog} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Divider />

                {/* Alerts Section */}
                {success && <DynamicSnackbar type="success" message={t("groups.addStudents.success")} />}
                {errorGetStudent && <DynamicSnackbar type="error" message={errorGetStudent} />}
                {errorGetStudentNetWork && <DynamicSnackbar type="error" message={errorGetStudentNetWork} />}
                {errorAddStudents && <DynamicSnackbar type="error" message={errorAddStudents} />}

                <DialogContent sx={{ py: 2 }}>


                    <Stack spacing={2}>
                        {/* Search Field */}
                        <TextField
                            fullWidth
                            label={t("groups.addStudents.searchLabel")}
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(1); // Reset page when searching
                            }}
                        />

                        {!loadingGetStudent ? (
                            <>
                                {/* Pagination Controls */}
                                {students.length > 0 && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mt: 2,
                                            alignItems: "center",
                                        }}
                                    >
                                        <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>{t("groups.prev")}</Button>
                                        <Typography>  {t("groups.pageOf", { page, totalPages })}</Typography>
                                        <Button disabled={totalPages && page === totalPages} onClick={() => setPage(p => p + 1)}>{t("groups.next")}</Button>
                                    </Box>
                                )}

                                {/* Students Grid */}
                                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => {
                                            const isSelected = selectedStudents.includes(student._id);

                                            return (
                                                <Grid size={{ xs: 12, sm: 4, md: 6 }} key={student._id}>
                                                    <Card
                                                        sx={{
                                                            height: '100%',
                                                            borderRadius: 2,
                                                            transition: 'all 0.3s ease',
                                                            cursor: 'pointer',
                                                            border: isSelected
                                                                ? `2px solid ${theme.palette.success.main}`
                                                                : `1px solid ${theme.palette.divider}`,
                                                            bgcolor: isSelected ? 'action.selected' : 'background.paper',
                                                            '&:hover': {
                                                                transform: 'translateY(-4px)',
                                                                boxShadow:
                                                                    theme.palette.mode === 'dark'
                                                                        ? '0 8px 24px rgba(255,255,255,0.1)'
                                                                        : '0 8px 24px rgba(0,0,0,0.12)',
                                                            },
                                                        }}
                                                        onClick={() => handleStudentToggle(student._id)}
                                                    >
                                                        <CardContent sx={{ pb: 1 }}>
                                                            <Stack spacing={2}>
                                                                {/* Avatar + Name */}
                                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                                    <Avatar
                                                                        sx={{
                                                                            width: 50,
                                                                            height: 50,
                                                                            bgcolor: theme.palette.primary.main,
                                                                            fontSize: '1.2rem',
                                                                            fontWeight: 700,
                                                                        }}
                                                                    >
                                                                        {getInitials(student.name)}
                                                                    </Avatar>
                                                                    <Box flex={1}>
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            fontWeight={700}
                                                                            sx={{
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                whiteSpace: 'nowrap',
                                                                            }}
                                                                        >
                                                                            {student.name}
                                                                        </Typography>

                                                                        {/* Grade Chip */}
                                                                        {student.grade && (
                                                                            <Chip
                                                                                icon={<GradeIcon />}
                                                                                label={`Grade ${student.grade}`}
                                                                                size="small"
                                                                                variant="outlined"
                                                                                sx={{ mt: 0.5 }}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </Box>

                                                                <Divider />

                                                                {/* Contact Info */}
                                                                <Stack spacing={1}>
                                                                    {student.email && (
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <EmailIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                                                                            <Typography variant="caption" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                                {student.email}
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                    {student.phone && (
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <PhoneIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                                                                            <Typography variant="caption" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                                {student.phone}
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                </Stack>
                                                            </Stack>
                                                        </CardContent>

                                                        {/* Card Actions */}
                                                        <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                                                                {t("groups.addStudents.clickToSelect")}
                                                            </Typography>
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onChange={() => handleStudentToggle(student._id)}
                                                                color="success"
                                                                onClick={(e) => e.stopPropagation()} // Prevent toggle on card click
                                                            />
                                                        </CardActions>
                                                    </Card>
                                                </Grid>
                                            );
                                        })
                                    ) : (
                                        // Empty State
                                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 4,
                                                    textAlign: "center",
                                                    borderRadius: 3,
                                                    bgcolor: "background.paper",
                                                    border: "1px dashed",
                                                    borderColor: "divider",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        mx: "auto",
                                                        mb: 2,
                                                        borderRadius: "50%",
                                                        bgcolor: "action.hover",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <PersonAddIcon sx={{ fontSize: 32, color: "primary.main" }} />
                                                </Box>

                                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                                    {t("groups.addStudents.emptyTitle")}
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {t("groups.addStudents.emptySubtitle")}
                                                </Typography>
                                                <NavLink to={'/students'}>
                                                    <Button variant="contained" startIcon={<PersonAddIcon />}>
                                                        {t("groups.addStudents.goToStudentsBtn")}
                                                    </Button>
                                                </NavLink>
                                            </Paper>
                                        </Grid>
                                    )}
                                </Grid>

                                {/* Selected Count */}
                                {selectedStudents.length > 0 && (
                                    <Chip
                                        label={t("groups.addStudents.selectedCount", { count: selectedStudents.length })}
                                        color="primary"
                                        variant="filled"
                                    />
                                )}
                            </>
                        ) : (
                            // Loading State
                            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                                <CircularProgress />
                            </Box>
                        )}
                    </Stack>
                </DialogContent>

                <Divider />

                {/* Dialog Actions */}
                <DialogActions
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    {/* Available Students Info */}
                   <Tooltip title={t("groups.addStudents.availableTooltip")} arrow>
                        <Chip
                            icon={<PeopleIcon />}
                            label={
                                totalStudents > 0
                                    ? t("groups.addStudents.availableCount", { count: filteredStudents.length })
                                    : t("groups.addStudents.noAvailable")
                            }
                            color={totalStudents > 0 ? "info" : "warning"}
                            variant={totalStudents > 0 ? "outlined" : "filled"}
                            sx={{
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 1,
                            }}
                        />
                    </Tooltip>

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {/* Cancel Button */}
                        <Button
                            onClick={handleCloseDialog}
                            variant="outlined"
                            color="inherit"
                        >
                            {t("groups.actions.cancel")}
                        </Button>

                        {/* Add Selected Students Button */}
                        <Button
                            onClick={handleAddExistingStudents}
                            disabled={
                                selectedStudents.length === 0 ||
                                loadingAddStudents ||
                                totalStudents === 0
                            }
                            startIcon={
                                loadingAddStudents ? (
                                    <CircularProgress size={18} color="inherit" />
                                ) : (
                                    <AddIcon />
                                )
                            }
                            sx={(theme) => ({
                                textTransform: "none",
                                px: 3,
                                py: 1.2,
                                borderRadius: 2,
                                fontWeight: 600,
                                background: `linear-gradient(135deg,
          ${theme.palette.primary.main},
          ${theme.palette.primary.dark}
        )`,
                                color: theme.palette.getContrastText(theme.palette.primary.main),
                                boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
                                "&:hover": {
                                    boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
                                    background: `linear-gradient(135deg,
            ${theme.palette.primary.dark},
            ${theme.palette.primary.main}
          )`,
                                },
                                "&.Mui-disabled": {
                                    background: theme.palette.action.disabledBackground,
                                    color: theme.palette.action.disabled,
                                    boxShadow: "none",
                                },
                            })}
                        >
                            {loadingAddStudents
                                ? t("groups.adding")
                                : t("groups.addStudents.addSelected", { count: selectedStudents.length })}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

        </>
    );
}
