import React, { useState, useMemo, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTheme } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { useTranslation } from 'react-i18next';
export default function StudentsAtGroupInPageGroupData({
    groupName = 'Group Name',
    students = [],
    loading = false,
}) {
    // ==============================
    // Theme
    // ==============================
    const theme = useTheme(); // Access MUI theme for colors, spacing, etc.
    const { t } = useTranslation();
    // ==============================
    // Search State
    // ==============================
    const [searchValue, setSearchValue] = useState(''); // Controlled input for search bar

    // ==============================
    // Filtered Students (Memoized)
    // ==============================
    // useMemo ensures the filtering only runs when students array or searchValue changes
    const filteredStudents = useMemo(() => {
        if (!searchValue.trim()) return students; // If search is empty, return all students

        const lowerSearch = searchValue.toLowerCase(); // Case-insensitive search

        return students.filter(({ studentId }) =>
            studentId?.name?.toLowerCase().includes(lowerSearch) || // Search by name
            studentId?.phone?.toLowerCase().includes(lowerSearch)    // Search by phone
        );
    }, [students, searchValue]);

    // ==============================
    // Dialog State
    // ==============================
    const [openDialog, setOpenDialog] = useState(false); // Tracks if dialog is open

    // ==============================
    // Dialog Handlers
    // ==============================
    const handleOpen = () => {
        setOpenDialog(true); // Open dialog
    };

    const handleClose = () => {
        setOpenDialog(false); // Close dialog
    };


    return (
        <>


            {/* ============================== Show Students Button with Tooltip================================= */}
            <Tooltip title={t("groups.view")}> {/* Tooltip text when hovering */}
                <IconButton
                    color="warning"          // MUI color for the icon
                    size="small"             // Small size icon button
                    onClick={(e) => {
                        e.currentTarget.blur(); // Remove focus after click to prevent outline
                        handleOpen();           // Open the students dialog
                    }}
                    sx={{
                        borderRadius: 1,             // Rounded corners
                        transition: "all 0.2s ease", // Smooth hover transition
                        "&:hover": {
                            background: `${theme.palette.primary.main}15`, // Slight hover background
                        },
                    }}
                >
                    <PersonIcon /> {/* Icon representing "students" */}
                </IconButton>
            </Tooltip>

            <Dialog
                open={openDialog}
                onClose={handleClose}
                maxWidth="lg"
                fullWidth
                container={() => document.body}
                PaperProps={{
                    sx: {
                        borderRadius: 2.5,
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 20px 60px rgba(0,0,0,0.7)'
                            : '0 20px 60px rgba(0,0,0,0.3)',
                    },
                }}
            >
                {/* ============================== Dialog Header for Showing Students================================= */}
                <DialogTitle
                    sx={{
                        // Gradient background for header
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        color: '#fff',                     // White text
                        display: 'flex',                   // Flex layout
                        justifyContent: 'space-between',   // Space between elements
                        alignItems: 'center',              // Center vertically
                        borderRadius: '2.5px 2.5px 0 0',  // Rounded top corners
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <SchoolIcon sx={{ fontSize: 28 }} /> {/* Icon representing students */}
                        <Box>
                            {/* Dialog title */}
                            <Typography fontWeight="bold" fontSize="1.3rem">
                                {t("groups.viewGroup")} {groupName}
                            </Typography>
                            {/* Subtitle showing number of students */}
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                {filteredStudents.length}  {filteredStudents.length !== 1 ? t("groups.students.title") : t("groups.student.title")}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>


                <DialogContent sx={{ p: 3 }}>
                    {/* --------------------  Loading State  -------------------- */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : students.length > 0 ? (
                        <>
                            {/* --------------------   Search & Export Bar    -------------------- */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    my: 3,
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: { xs: 'stretch', sm: 'center' },
                                }}
                            >
                                <TextField
                                    placeholder={t("groups.students.searchPlaceholder")}
                                    size="small"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    sx={{
                                        flexGrow: 1,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            background:
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(255,255,255,0.08)'
                                                    : 'rgba(0,0,0,0.02)',
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            {/* --------------------      Students Table      -------------------- */}
                            <TableContainer
                                component={Paper}
                                elevation={0}
                                sx={{
                                    borderRadius: 2.5,
                                    border: `1px solid ${theme.palette.mode === 'dark'
                                        ? 'rgba(255,255,255,0.1)'
                                        : 'rgba(0,0,0,0.06)'
                                        }`,
                                    overflowX: 'auto',
                                }}
                            >
                                <Table>
                                    {/* Table Head */}
                                    <TableHead>
                                        <TableRow
                                            sx={{
                                                background:
                                                    theme.palette.mode === 'dark'
                                                        ? 'rgba(255,255,255,0.05)'
                                                        : 'rgba(0,0,0,0.02)',
                                            }}
                                        >
                                            <TableCell sx={{ fontWeight: 700, minWidth: 200 }}>
                                                👤 {t("groups.fields.name")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>
                                                📱 {t("groups.fields.phone")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>
                                                👨‍👩‍👧 {t("groups.fields.parentPhone")} 
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 700, minWidth: 100 }}>
                                                🎓 {t("groups.fields.grade")}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    {/* Table Body */}
                                    <TableBody>
                                        {filteredStudents.map((student, idx) => (
                                            <TableRow
                                                key={student._id || idx}
                                                sx={{
                                                    '&:hover': {
                                                        background:
                                                            theme.palette.mode === 'dark'
                                                                ? 'rgba(255,255,255,0.05)'
                                                                : 'rgba(0,0,0,0.02)',
                                                    },
                                                    transition: 'background 0.2s ease',
                                                }}
                                            >
                                                {/* Name */}
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: theme.palette.primary.main,
                                                                width: 36,
                                                                height: 36,
                                                                fontSize: '0.9rem',
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {student.name?.charAt(0) ?? 'S'}
                                                        </Avatar>
                                                        <Typography fontWeight={700}>
                                                            {student.studentId.name || '-'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                {/* Phone */}
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                        <PhoneIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                                        <Typography variant="body2">
                                                            {student.studentId.phone || '—'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                {/* Parent Phone */}
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                        <PhoneIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                                                        <Typography variant="body2">
                                                            {student.studentId.parentPhone || '—'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                {/* Grade */}
                                                <TableCell>
                                                    <Chip
                                                        label={student.studentId.grade ? t(`groups.filters.grades.${student.studentId.grade}`) : '—'}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            background: `${theme.palette.info.main}20`,
                                                            color: theme.palette.info.main,
                                                            border: `1px solid ${theme.palette.info.main}40`,
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    ) : (
                        /* --------------------    Empty State    -------------------- */
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                borderRadius: 2.5,
                                background:
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(255,255,255,0.05)'
                                        : 'rgba(0,0,0,0.02)',
                                border: `1px dashed ${theme.palette.divider}`,
                            }}
                        >
                            <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" fontWeight={700} mb={1}>
                                No Students Found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchValue
                                    ? 'Try adjusting your search terms'
                                    : 'No students enrolled in this group yet'}
                            </Typography>
                        </Paper>
                    )}
                </DialogContent>

            </Dialog>
        </>
    );
}
