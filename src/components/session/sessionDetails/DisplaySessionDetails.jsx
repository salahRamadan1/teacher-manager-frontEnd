import React, { useEffect, useMemo, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Divider,
    Avatar,
    Chip,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Stack,
    useTheme,
    TextField,
    useMediaQuery,
    IconButton,
    Tooltip
} from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import HeaderSessionDetails from './HeaderSessionDetails';
import PricingSecion from './PricingSecion';
import AttendanceSection from './AttendanceSection';
import SessionStatistics from './SessionStatistics';
import EditIcon from "@mui/icons-material/Edit";
import BtnUpdateSessionAttendance from '../BtnUpdateSessionAttendance/BtnUpdateSessionAttendance';
import DeleteSessionButton from '../BtnDeleteSession/DeleteSessionButton';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddExamForm from '../../exam/AddExamForm';
import AddExamMarks from '../../exam/AddExamMarks';
import { useTranslation } from "react-i18next";

const DisplaySessionDetails = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { id } = useParams();
    const {
        sessionById,
    } = useSelector((state) => state.session);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        console.log(sessionById);

    }, [id]);
    const [filterType, setFilterType] = useState("all"); // "all" | "present" | "absent"
    const filteredStudents = useMemo(() => {
        if (!sessionById) return [];
        // أولاً فلترة حسب filterType
        let studentsToShow;
        if (filterType === "present") {
            studentsToShow = sessionById.presentStudents || [];
        } else if (filterType === "absent") {
            studentsToShow = sessionById.absentStudents || [];
        } else {
            const present = sessionById.presentStudents || [];
            const absent = sessionById.absentStudents || [];
            studentsToShow = [...present, ...absent];
        }

        // فلترة حسب البحث
        if (searchQuery.trim() === "") return studentsToShow;

        return studentsToShow.filter((student) => {
            const name = student.studentId.name.toLowerCase();
            const phone = student.studentId.phone?.toLowerCase() || "";
            const query = searchQuery.toLowerCase();
            return name.includes(query) || phone.includes(query);
        });
    }, [filterType, sessionById, searchQuery]);
    const navigate = useNavigate();
    const handleBack = () => {
        if (sessionById) navigate(`/groupDetails/${sessionById.groupId?._id}`);

    };


    return (
        <>
            {sessionById &&
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                        sx={{
                            mb: 2,
                            fontWeight: 600,
                            fontSize: 14,
                            borderRadius: 2,
                            boxShadow: 2,
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? theme.palette.primary.dark
                                    : theme.palette.primary.main,
                            color: theme.palette.getContrastText(
                                theme.palette.mode === "dark"
                                    ? theme.palette.primary.dark
                                    : theme.palette.primary.main
                            ),
                            "&:hover": {
                                backgroundColor:
                                    theme.palette.mode === "dark"
                                        ? theme.palette.primary.main
                                        : theme.palette.primary.dark,
                                boxShadow: 4,
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        {t("sessions.addSession.fields.backToGroup")}
                    </Button>
                    <Paper
                        elevation={6}
                        sx={{
                            p: 0,
                            mb: 4,
                            borderRadius: 3,
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                        }}
                    >
                        {/* Header Section */}
                        <HeaderSessionDetails sessionById={sessionById} />
                        {/* Pricing Section */}
                        <PricingSecion sessionById={sessionById} />
                    </Paper>
                    {/* AttendanceSection */}
                    <AttendanceSection sessionById={sessionById} />

                    <AddExamForm grade={sessionById.grade} groupId={sessionById.groupId._id} sessionId={sessionById._id} />
                    <AddExamMarks attendance={sessionById?.attendance} />
                    {/* buttons filter */}
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Button
                            variant={filterType === "all" ? "contained" : "outlined"}
                            color="primary"
                            onClick={() => setFilterType("all")}
                        >
                            {t("sessions.addSession.fields.totalStudents")}
                        </Button>
                        <Button
                            variant={filterType === "present" ? "contained" : "outlined"}
                            color="success"
                            onClick={() => setFilterType("present")}
                        >
                            {t("sessions.addSession.fields.Present")}
                        </Button>
                        <Button
                            variant={filterType === "absent" ? "contained" : "outlined"}
                            color="error"
                            onClick={() => setFilterType("absent")}
                        >
                            {t("sessions.addSession.fields.Absent")}
                        </Button>
                    </Stack>
                    {/* Students Attendance Management */}
                    <Paper elevation={2} sx={{ mb: 4 }}>

                        <Divider />
                        {/* All Students Table */}
                        <Paper elevation={2} sx={{ mb: 4 }}>
                            {/* Header + Search */}
                            <Box sx={{ p: 3, backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#f9f9f9', borderBottom: '1px solid #eee' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    {t("sessions.sessionDetails.studentsAttendanceManagement")}
                                </Typography>
                                <TextField
                                    size="small"
                                    placeholder={t("sessions.sessionDetails.searchPlaceholder")}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    fullWidth
                                    sx={{
                                        input: { color: theme.palette.text.primary },
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: theme.palette.mode === 'dark' ? '#333' : '#fff',
                                            color: theme.palette.text.primary
                                        }
                                    }}
                                />
                            </Box>

                            {/* Desktop Table */}
                            {!isMobile ? (
                                <TableContainer sx={{ overflowX: 'auto' }}>
                                    <Table sx={{ minWidth: 650 }}>
                                        <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{t("sessions.sessionDetails.studentName")}</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{t("sessions.sessionDetails.note")}</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{t("sessions.sessionDetails.phone")}</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="center">{t("sessions.sessionDetails.status")}</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="center">{t("sessions.sessionDetails.payment")}</TableCell>
                                                <TableCell align="center">{t("sessions.sessionDetails.actions")}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredStudents.length > 0 ? (
                                                filteredStudents.map((student) => {
                                                    const isPresent = sessionById.presentStudents?.some(s => s.studentId === student.studentId);
                                                    const rowBg = isPresent
                                                        ? theme.palette.mode === 'dark' ? 'rgba(67, 233, 123, 0.2)' : '#f0fdf4'
                                                        : theme.palette.mode === 'dark' ? 'rgba(255, 107, 107, 0.2)' : '#fdf2f2';

                                                    return (
                                                        <TableRow key={student.studentId._id} hover sx={{ backgroundColor: rowBg }}>
                                                            <TableCell>{student.studentId.name}</TableCell>
                                                            <TableCell>
                                                                {student.note ? (
                                                                    <Typography
                                                                        sx={{
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap',
                                                                            maxWidth: 200
                                                                        }}
                                                                        title={student.note}
                                                                    >
                                                                        {student.note}
                                                                    </Typography>
                                                                ) : (
                                                                    <Typography variant="caption" color="textSecondary">{t("sessions.sessionDetails.noNote")}</Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>{student.studentId.phone}</TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={isPresent ? t("sessions.sessionDetails.present") : t("sessions.sessionDetails.absent")}
                                                                    size="small"
                                                                    color={isPresent ? "success" : "error"}
                                                                    variant="filled"
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {student.payment || 0}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <BtnUpdateSessionAttendance student={student} Present={isPresent} />

                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} sx={{ py: 5, margin: '0 auto' }}>
                                                        <Paper
                                                            elevation={0}
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                py: 5,
                                                                border: theme.palette.mode === 'dark' ? '1px dashed #555' : '1px dashed #ccc',
                                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                                                borderRadius: 2,
                                                                margin: '0 auto',
                                                            }}
                                                        >
                                                            <SentimentDissatisfiedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                                            <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                                                                {t('sessions.sessionDetails.noStudentsFound')}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                                sx={{ opacity: 0.7, textAlign: 'center', maxWidth: 300 }}
                                                            >
                                                                {t('noStudentsSubtitle')}
                                                            </Typography>
                                                        </Paper>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                // Mobile View as Cards
                                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => {
                                            const isPresent = sessionById.presentStudents?.some(s => s.studentId === student.studentId);
                                            const cardBg = isPresent
                                                ? theme.palette.mode === 'dark' ? 'rgba(67, 233, 123, 0.2)' : '#f0fdf4'
                                                : theme.palette.mode === 'dark' ? 'rgba(255, 107, 107, 0.2)' : '#fdf2f2';

                                            return (
                                                <Card key={student._id} sx={{ backgroundColor: cardBg }}>
                                                    <CardContent>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{student.studentId.name}</Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Note: {student.studentId.note || 'No Note'}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Phone: {student.studentId.phone}
                                                        </Typography>
                                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                                            <Chip
                                                                label={isPresent ? "Present" : "Absent"}
                                                                size="small"
                                                                color={isPresent ? "success" : "error"}
                                                                variant="filled"
                                                            />
                                                            <Typography variant="body2">Payment: {student.payment || 0}</Typography>
                                                            <BtnUpdateSessionAttendance student={student} Present={isPresent} />

                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })
                                    ) : (
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                py: 5,
                                                border: theme.palette.mode === 'dark' ? '1px dashed #555' : '1px dashed #ccc',
                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                                borderRadius: 2,
                                            }}
                                        >
                                            <SentimentDissatisfiedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                            <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                                                {t('sessions.sessionDetails.noStudentsFound')}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={{ opacity: 0.7, textAlign: 'center', maxWidth: 300 }}
                                            >
                                                {t('sessions.sessionDetails. noStudentsSubtitle')}

                                            </Typography>
                                        </Paper>
                                    )}
                                </Box>
                            )}
                        </Paper>




                    </Paper>
                    {/* SessionStatistics */}
                    <SessionStatistics sessionById={sessionById} />
                    <DeleteSessionButton sessionId={sessionById} />
                </Container>
            }
        </>
    );
};

export default DisplaySessionDetails;
