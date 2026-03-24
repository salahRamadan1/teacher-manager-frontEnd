import { AccountBalanceWallet } from '@mui/icons-material'
import { Box, Grid, Typography, useTheme } from '@mui/material'
import React from 'react'
import { useTranslation } from "react-i18next";

export default function PricingSecion({ sessionById }) {
    const { t } = useTranslation();
    const theme = useTheme();

    const pricingGradient = theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #232526 0%, #414345 100%)"
        : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";

    const textColor = theme.palette.mode === "dark" ? "#fff" : "#fff";

    return (


        <Box
            sx={{
                p: 3,
                background: pricingGradient,
                color: textColor,
                transition: "all 0.3s ease",

            }}
        >
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                {t("sessions.addSession.fields.price")}
            </Typography>

            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}> {/* spacing=0 لنعمل borders نظيفة */}
                {[
                    { label: t("sessions.addSession.fields.sessionPrice"), value: sessionById.sessionPrice || 0 },
                    { label: t("sessions.addSession.fields.centerPrice"), value: sessionById.centerPrice || 0 },
                    { label: t("sessions.addSession.fields.totalCenterPrice"), value: sessionById.totalCenterPrice || 0 },
                    { label: t("sessions.addSession.fields.totalTeacherPrice"), value: sessionById.totalTeacherPrice || 0 },
                ].map((item, index) => (
                    <Grid
                        size={{ xs: 12, sm: 6, md: 3 }}
                        key={index}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            px: 2,
                            borderRight: { md: index !== 3 ? "1px solid rgba(255,255,255,0.4)" : "none" },
                            mb: { xs: 2, md: 0 }, // مسافة بين الصفوف على الموبايل
                        }}
                    >
                        <Typography variant="h6" sx={{ opacity: 0.8 }}>
                            {item.label}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                            <AccountBalanceWallet sx={{ mr: 1 }} fontSize="small" />
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                 {item.value} {t("sessions.addSession.fields.EGP")}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>

    )
}
