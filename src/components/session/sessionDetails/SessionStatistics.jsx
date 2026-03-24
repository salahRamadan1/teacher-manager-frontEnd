import { Box, LinearProgress, Paper, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from "react-i18next";

export default function SessionStatistics({ sessionById }) {
    const { t } = useTranslation();

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                {t("sessions.sessionDetails.sessionAttendanceOverview")}
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                                {t("sessions.sessionDetails.overallAttendanceRate")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#43e97b' }}>
                        {Math.round((sessionById.presentStudents?.length / sessionById.attendance?.length) * 100)}%

                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={Math.round((sessionById.presentStudents?.length / sessionById.attendance?.length) * 100)}
                    sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                        },
                    }}
                />
            </Box>
            <Typography variant="caption" color="textSecondary">
                {Math.round((sessionById.presentStudents?.length / sessionById.attendance?.length) * 100)}%  {t("sessions.addSession.fields.outOf")}{' '}
                {sessionById.attendance?.length}  {t("sessions.sessionDetails.studentsAttendingOnAverage")}
            </Typography>
        </Paper>
    )
}
