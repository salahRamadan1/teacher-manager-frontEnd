import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment,
    Stack,
} from '@mui/material';
import { getTheme } from '../../../../theme';
import { useTheme } from '@mui/material/styles';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getGroupById, getGroups, transferStudent } from '../../../../features/groups/groupAction';
import { useDispatch, useSelector } from 'react-redux';
import { formatTo12Hour } from '../../../../utils/formatTimeAndData/format';
import { alpha } from "@mui/material";
import { makeStateIsEmpityGroup } from '../../../../features/groups/groupSlice';
import { useParams } from 'react-router-dom';
import DynamicSnackbar from '../../../alerts/DynamicSnackbar';
import { useTranslation } from "react-i18next";
export default function TransFerStdBtwGroups({ student, grade }) {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language?.startsWith("ar");
    // -------------------------
    // Redux & Theme Setup
    // -------------------------
    const dispatch = useDispatch(); // Redux dispatcher to call actions
    const theme = useTheme(); // MUI theme for Dark / Light styling

    // -------------------------
    // Component State
    // -------------------------
    const [isOpen, setIsOpen] = useState(false); // Controls whether the transfer dialog is open
    const [selectedGroup, setSelectedGroup] = useState(null); // Stores the group selected for transfer
    const [searchQuery, setSearchQuery] = useState(''); // Local search input for filtering groups
    const [keyword, setKeyword] = useState(''); // Keyword used for backend search/filter
    const [success, setSuccess] = useState(false); // Controls the success alert visibility

    // -------------------------
    // URL Params
    // -------------------------
    const { id } = useParams(); // Current group ID from URL

    // -------------------------
    // Redux State Selectors
    // -------------------------
    const {
        loadingGetGroup,         // Loading state when fetching groups
        errorGetGroup,           // Errors from fetching groups
        errorGetGroupNetWork,    // Network errors from fetching groups
        groups,                  // List of all groups
        loadingTransferStuent,   // Loading state when transferring a student
        errorTransferStuent,     // Error if transfer fails
    } = useSelector((state) => state.group);

    // -------------------------
    // Filter Groups Locally
    // -------------------------
    const filteredGroups = groups
        // Remove the current group from the list so user cannot transfer to the same group
        .filter(group => group._id !== id)
        // Filter by search input (name or place)
        .filter(group =>
            group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.place.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // -------------------------
    // Handlers
    // -------------------------

    // Open the transfer dialog
    const handleOpenDialog = () => {
        setIsOpen(true);
        setSelectedGroup(null); // Clear previously selected group
        fetchGroups(); // Fetch groups from backend
    };

    // Close the transfer dialog
    const handleCloseDialog = () => {
        setSelectedGroup(null); // Reset selected group
        setSearchQuery(''); // Reset search input
        setIsOpen(false); // Close dialog
        dispatch(makeStateIsEmpityGroup()); // Reset group-related state in Redux
    };

    // Fetch groups from backend
    const fetchGroups = async () => {
        let url = `/group/getGroupsByTeacher?keyword=${keyword}&grade=${grade}`;
        if (keyword) url += `&keyword=${keyword}`;
        if (grade) url += `&grade=${grade}`;
        await dispatch(getGroups(url)); // Dispatch getGroups action with filters
    };

    // Handle transferring student to selected group
    const handleSelectGroup = async () => {
        const res = await dispatch(transferStudent({
            fromGroupId: id,
            studentId: student._id,
            toGroupId: selectedGroup._id
        }));

        // Show success message if transfer succeeds
        if (res.payload?.message === "Student transferred successfully") {
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
                dispatch(getGroupById(id)); // Refresh current group data
                handleCloseDialog(); // Close dialog
            }, 1000);
        }
    };

    // -------------------------
    // useEffect Placeholder
    // -------------------------
    // Currently empty, but dependencies included for future use
    useEffect(() => {

    }, [keyword, isOpen, grade, id, student, selectedGroup]);


    return (
        <>
            {/* ================= Transfer Button ================= */}
           <Tooltip title={t("groups.transfer.tooltip")} placement={isAr ? "left" : "right"}>
                <IconButton
                    color="primary"
                    size="small"
                    onClick={handleOpenDialog}
                    sx={(theme) => ({
                        bgcolor: theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(0,0,0,0.05)",
                        "&:hover": {
                            bgcolor: theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.15)"
                                : "rgba(0,0,0,0.1)",
                        },
                    })}
                >
                    <SwapHorizIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            {/* ================= Transfer Dialog ================= */}
            <Dialog
                open={isOpen}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        boxShadow:
                            theme.palette.mode === "dark"
                                ? "0 20px 60px rgba(0, 0, 0, 0.7)"
                                : "0 20px 60px rgba(0, 0, 0, 0.3)",
                    },
                }}
            >
                {/* ================= Header ================= */}
                <Box
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: theme.palette.getContrastText(theme.palette.primary.main),
                        p: 2.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: "16px 16px 0 0",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <SwapHorizIcon sx={{ fontSize: 28 }} />
                        <Box>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
                                {t("groups.transfer.title")}
                            </Typography>
                            <Typography sx={{ fontSize: "0.85rem", opacity: 0.9 }}>
                                {t("groups.transfer.subtitle")}
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            minWidth: "auto",
                            color: "#fff",
                            p: 0.5,
                            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                        }}
                    >
                        <CloseIcon />
                    </Button>
                </Box>

                {/* ================= Content ================= */}
                <DialogContent sx={{ p: 3 }}>
                    {errorTransferStuent && (
                        <DynamicSnackbar type="error" message={errorTransferStuent} />
                    )}

                    {/* Student Info Card */}
                    <Box
                        sx={(theme) => ({
                            p: 2,
                            mb: 2.5,
                            borderRadius: "12px",
                            bgcolor: theme.palette.mode === "dark"
                                ? alpha(theme.palette.common.white, 0.05)
                                : alpha(theme.palette.primary.main, 0.03),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        })}
                    >
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                            👤 {t("groups.transfer.studentLabel")}
                        </Typography>

                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {student?.name || t("groups.transfer.noName")}
                        </Typography>

                        {student?.phone && (
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                                📞 {student.phone}
                            </Typography>
                        )}
                    </Box>

                    {/* Search Box */}
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder={t("groups.transfer.searchPlaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={loadingTransferStuent}
                        sx={{
                            mb: 3,
                            "& .MuiOutlinedInput-root": {
                                bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "#fff",
                                color: theme.palette.text.primary,
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: theme.palette.divider,
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: theme.palette.primary.main }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {!loadingGetGroup ? (
                        <>
                            <Stack spacing={2}>
                                {errorGetGroup && <DynamicSnackbar type="error" message={errorGetGroup} />}
                                {errorGetGroupNetWork && <DynamicSnackbar type="error" message={errorGetGroupNetWork} />}
                            </Stack>

                            {success && (
                                <DynamicSnackbar
                                    type="success"
                                    message={t("groups.transfer.success")}
                                />
                            )}

                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                {filteredGroups.length > 0 ? (
                                    filteredGroups.map((group) => {
                                        const isSelected = selectedGroup?._id === group._id;
                                        return (
                                            <Grid size={{ xs: 12, sm: 4, md: 4 }} key={group._id}>
                                                <Card
                                                    onClick={() => setSelectedGroup(group)}
                                                    sx={{
                                                        cursor: "pointer",
                                                        transition: "all 0.3s ease",
                                                        border: isSelected
                                                            ? `2px solid ${theme.palette.primary.main}`
                                                            : `1px solid ${theme.palette.divider}`,
                                                        bgcolor: isSelected
                                                            ? theme.palette.primary.light + "15"
                                                            : theme.palette.mode === "dark"
                                                                ? "rgba(255,255,255,0.05)"
                                                                : "rgba(0,0,0,0.02)",
                                                        "&:hover": {
                                                            boxShadow: `0 8px 20px ${theme.palette.primary.main}30`,
                                                            transform: "translateY(-3px)",
                                                        },
                                                        borderRadius: "16px",
                                                        position: "relative",
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <Box
                                                            sx={{
                                                                position: "absolute",
                                                                top: 10,
                                                                right: 10,
                                                                bgcolor: theme.palette.primary.main,
                                                                borderRadius: "50%",
                                                                p: 0.5,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                boxShadow: `0 2px 6px rgba(0,0,0,0.2)`,
                                                            }}
                                                        >
                                                            <CheckCircleIcon sx={{ fontSize: 20, color: theme.palette.common.white }} />
                                                        </Box>
                                                    )}

                                                    <CardContent>
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 600,
                                                                fontSize: "1.15rem",
                                                                mb: 1.5,
                                                                color: theme.palette.text.primary,
                                                            }}
                                                        >
                                                            {group.name}
                                                        </Typography>

                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                            <LocationOnIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                                            <Typography sx={{ fontSize: "0.9rem", color: theme.palette.text.secondary }}>
                                                                {group.place}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                            <SchoolIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "0.85rem",
                                                                    fontWeight: 500,
                                                                    color: theme.palette.primary.main,
                                                                    bgcolor: theme.palette.primary.main + "15",
                                                                    px: 1.5,
                                                                    py: 0.3,
                                                                    borderRadius: "20px",
                                                                    display: "inline-block",
                                                                }}
                                                            >
                                                                {t("groups.transfer.gradeBadge", { grade: group.grade })}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                            <CalendarTodayIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                                            <Typography sx={{ fontSize: "0.9rem", color: theme.palette.text.secondary }}>
                                                                {group.day}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                            <AccessTimeIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                                            <Typography sx={{ fontSize: "0.9rem", fontWeight: 500, color: theme.palette.text.primary }}>
                                                                {formatTo12Hour(group.time)}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })
                                ) : (
                                    <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                                        <Box sx={{ textAlign: "center", py: 4 }}>
                                            <Typography sx={{ color: theme.palette.text.secondary }}>
                                                {t("groups.transfer.noGroupsFound")}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </>
                    ) : (
                        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                            <CircularProgress />
                        </Box>
                    )}
                </DialogContent>

                {/* ================= Action Buttons ================= */}
                <Box
                    sx={{
                        p: 3,
                        display: "flex",
                        gap: 1.5,
                        justifyContent: "flex-end",
                        borderTop: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0,0,0,0.01)",
                    }}
                >
                    <Button
                        onClick={handleCloseDialog}
                        disabled={loadingTransferStuent}
                        sx={{
                            textTransform: "none",
                            fontSize: "0.95rem",
                            px: 3,
                            borderRadius: "8px",
                            border: `1px solid ${theme.palette.divider}`,
                            color: theme.palette.text.primary,
                            "&:hover": { bgcolor: theme.palette.action.hover },
                        }}
                    >
                        {t("groups.actions.cancel")}
                    </Button>

                    <Button
                        onClick={handleSelectGroup}
                        disabled={loadingTransferStuent || !selectedGroup}
                        variant="contained"
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            color: theme.palette.getContrastText(theme.palette.primary.main),
                            textTransform: "none",
                            fontSize: "0.95rem",
                            px: 4,
                            borderRadius: "8px",
                            boxShadow: `0 4px 15px ${theme.palette.primary.main}40`,
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            "&:hover": {
                                boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
                            },
                        }}
                    >
                        {loadingTransferStuent ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <>
                                <SwapHorizIcon sx={{ fontSize: 18, color:"white" }} /> {t("groups.transfer.action")}
                            </>
                        )}
                    </Button>
                </Box>
            </Dialog>


        </>
    );
}
