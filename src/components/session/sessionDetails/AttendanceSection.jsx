import { AccessTime, LocationOn, Person, School } from '@mui/icons-material'
import { Avatar, Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material'
import React from 'react'
import { useTranslation } from "react-i18next";

export default function AttendanceSection({ sessionById }) {
    const theme = useTheme();
    const { t } = useTranslation();

    const getCardBg = (type) => {
        if (type === "present") return theme.palette.mode === "dark" ? "rgba(67, 233, 123, 0.2)" : "#f0fdf4";
        if (type === "absent") return theme.palette.mode === "dark" ? "rgba(255, 107, 107, 0.2)" : "#fdf2f2";
        return theme.palette.mode === "dark" ? "#333" : "#f9f9f9";
    };
    const getAvatarColor = (type) => {
        if (type === "present") return "#43e97b";
        if (type === "absent") return "#ff6b6b";
        return "#43e97b";
    };
    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} sx={{ mb: 2 }}>
            {/* Present Students */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card elevation={2} sx={{ height: '100%', bgcolor: getCardBg("present") }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: getAvatarColor("present"), mx: 2 }}>
                                <School />
                            </Avatar>
                            <Typography color="textSecondary" variant="body2">{t("sessions.addSession.fields.Present")}</Typography>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: getAvatarColor("present") }}>
                            {sessionById.presentStudents?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {t("sessions.addSession.fields.outOf")} {sessionById.attendance?.length || 0} {t("sessions.addSession.fields.totalStudents")}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Absent Students */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card elevation={2} sx={{ height: '100%', bgcolor: getCardBg("absent") }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: getAvatarColor("absent"), mx: 2 }}>
                                <Person />
                            </Avatar>
                            <Typography color="textSecondary" variant="body2">{t("sessions.addSession.fields.Absent")}</Typography>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: getAvatarColor("absent") }}>
                            {sessionById.absentStudents?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {t("sessions.addSession.fields.outOf")} {sessionById.attendance?.length || 0} {t("sessions.addSession.fields.totalStudents")}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Location */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card elevation={2} sx={{ height: '100%', bgcolor: getCardBg("location") }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                                sx={{
                                    bgcolor: (theme) =>
                                        theme.palette.mode === 'dark' ? '#43e97b' : '#4caf50',
                                    mx: 2,
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                <LocationOn />
                            </Avatar>
                            <Typography
                                color="text.secondary"
                                variant="body2"
                                sx={{ fontWeight: 'medium' }}
                            >
                                {t("sessions.addSession.fields.place")}
                            </Typography>
                        </Box>

                        <Typography
                            variant="body1"
                            color="text.primary"
                            sx={{ fontWeight: 'bold' }}
                        >
                            {sessionById.place || 'N/A'}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Schedule */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card elevation={2} sx={{ height: '100%', bgcolor: getCardBg("location") }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: getAvatarColor("present"), mx: 2 }}>
                                <AccessTime />
                            </Avatar>
                            <Typography color="textSecondary" variant="body2">{t("sessions.addSession.fields.Scheduled for {{date}} at {{time}}", { date: sessionById.date, time: sessionById.groupId?.time || "N/A" })}</Typography>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: getAvatarColor("present") }}>
                            {sessionById.groupId?.time || "N/A"}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {sessionById.groupId?.day
                                ? t(`groups.days.${sessionById.groupId.day}`)
                                : "N/A"}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
