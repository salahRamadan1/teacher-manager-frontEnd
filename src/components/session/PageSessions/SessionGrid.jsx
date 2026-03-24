import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    Chip,
    Divider,
    useTheme,
    Tooltip,
    Button,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSessionsTeacher } from "../../../features/session/sessionAction";
import { useNavigate } from "react-router-dom";
import ErrorDisplay from "./ErrorDisplay";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

/* ================== Fake Data ================== */
// const fakeSessions = [
//     {
//         _id: "1",
//         place: "Center A",
//         grade: "Grade 10",
//         description: "Algebra revision",
//         createdAt: "2026-01-18",
//         sessionPrice: 120,
//         centerPrice: 30,
//         attendance: Array(20),
//         presentStudents: Array(16),
//         absentStudents: Array(4),
//     },
//     {
//         _id: "2",
//         place: "Center B",
//         grade: "Grade 11",
//         description: "Physics – Motion",
//         createdAt: "2026-01-19",
//         sessionPrice: 150,
//         centerPrice: 40,
//         attendance: Array(25),
//         presentStudents: Array(14),
//         absentStudents: Array(11),
//     },
//     {
//         _id: "3",
//         place: "Online",
//         grade: "Grade 12",
//         description: "",
//         createdAt: "2026-01-20",
//         sessionPrice: 100,
//         centerPrice: 0,
//         attendance: Array(18),
//         presentStudents: Array(9),
//         absentStudents: Array(9),
//     },
// ];

/* ================== Helpers ================== */
const getAbsenceColor = (absent, total, theme) => {
    const ratio = total ? absent / total : 0;

    if (ratio <= 0.2) return theme.palette.success.main;
    if (ratio <= 0.4) return theme.palette.warning.main;
    return theme.palette.error.main;
};

/* ================== Component ================== */
const SessionGrid = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { sessions, loading, error } = useSelector((state) => state.session);


    const navigate = useNavigate()

    const handleOpenDetails = (session) => {

        navigate(`/session/${session}`)
    };
    const handleGoToGroup = (groupId) => {

        navigate(`/GroupDetails/${groupId}`);


    };
    const handleRetry = () => {
        dispatch(getSessionsTeacher());
    };
    if (error) return <ErrorDisplay message={error} onRetry={handleRetry} />;
    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {sessions.session && sessions.session.length > 0 ? <>

                {sessions.session?.map((session, index) => {
                    const total = session.attendance?.length || 0;
                    const absent = session.absentStudents?.length || 0;
                    const absenceColor = getAbsenceColor(absent, total, theme);

                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={session._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    onClick={() => handleOpenDetails(session._id)}
                                    sx={{
                                        height: "100%",
                                        cursor: "pointer",
                                        bgcolor: theme.palette.background.paper,
                                        borderLeft: `5px solid ${absenceColor}`,
                                        transition: "0.3s",
                                        "&:hover": {
                                            transform: "translateY(-6px)",
                                            boxShadow: theme.shadows[8],
                                        },
                                    }}
                                >
                                    <CardContent>
                                        {/* Header */}
                                        <Stack direction="row" justifyContent="space-between" mb={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <LocationOnIcon color="primary" fontSize="small" />
                                                <Typography fontWeight="bold">
                                                    {session.place}
                                                </Typography>
                                            </Stack>
                                            <Chip size="small" label={t(`sessions.filters.grades.${session.grade}`)} color="secondary" />
                                        </Stack>

                                        {/* Date */}
                                        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                            <EventIcon fontSize="small" color="action" />
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(session.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Stack>

                                        {/* Description */}

                                        <Tooltip title={session.description || t("sessions.noDescription")} arrow>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40, cursor: "pointer" }}>
                                                {(session.description || t("sessions.noDescription")).length > 18
                                                    ? `${(session.description || t("sessions.noDescription")).slice(0, 18)}...`
                                                    : (session.description || t("sessions.noDescription"))}
                                            </Typography>
                                        </Tooltip>

                                        <Divider sx={{ mb: 2 }} />

                                        {/* Prices */}
                                        <Typography variant="body2" mb={0.5}>
                                            💰 {t("sessions.sessionPrice")}
                                            <strong>{session.sessionPrice} {t("sessions.egp")}</strong>
                                        </Typography>
                                        <Typography variant="body2" mb={2}>
                                            🏢 {t("sessions.centerPrice")}
                                            <strong>{session.centerPrice} {t("sessions.egp")}</strong>
                                        </Typography>

                                        <Divider sx={{ mb: 2 }} />
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "success.main" }}
                                        >
                                            🧑‍🏫 {t("sessions.teacherTotal")}:{" "}
                                            <strong>{session.totalTeacherPrice ?? 0} {t("sessions.egp")}</strong>
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{ color: "info.main" }}
                                        >
                                            🏢 {t("sessions.centerTotal")}:{" "}
                                            <strong>{session.totalCenterPrice ?? 0} {t("sessions.egp")}</strong>
                                        </Typography>
                                        {/* Attendance */}
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <PeopleIcon fontSize="small" />
                                                <Typography variant="body2">
                                                     {t("sessions.total")}: <strong>{total}</strong>
                                                </Typography>
                                            </Stack>

                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <CheckCircleIcon fontSize="small" color="success" />
                                                <Typography variant="body2">
                                                     {t("sessions.present")}:{" "}
                                                    <strong>
                                                        {session.presentStudents?.length || 0}
                                                    </strong>
                                                </Typography>
                                            </Stack>

                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <CancelIcon
                                                    fontSize="small"
                                                    sx={{ color: absenceColor }}
                                                />
                                                <Typography variant="body2">
                                                     {t("sessions.absent")}: <strong>{absent}</strong>
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                            sx={{ mt: 2 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleGoToGroup(session.groupId);
                                            }}
                                        >
                                            {t("sessions.goToGroupDetails")}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    );
                })}

            </> :
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "50vh",
                            textAlign: "center",
                            px: 2,
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor:
                                    theme.palette.mode === "dark"
                                        ? theme.palette.grey[800]
                                        : theme.palette.grey[100],
                                p: 4,
                                borderRadius: 3,
                                boxShadow: 3,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <HourglassEmptyIcon
                                sx={{
                                    fontSize: 70,
                                    mb: 2,
                                    color: theme.palette.primary.main,
                                    animation: `${bounce} 1.5s infinite`,
                                }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {t("sessions.noSessionsYet")}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>


            }

        </Grid>
    );
};

export default SessionGrid;
