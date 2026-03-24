import { Class, Groups, LocationOn, Margin, Padding, School } from "@mui/icons-material";
import {
  Box,
  Chip,
  Stack,
  Typography,
  useTheme,
  Paper,
  Divider,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import EditSession from "../BtnUpdateSessionValue/EditSession";

export default function HeaderSessionDetails({ sessionById }) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  const headerGradient =
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  const glassStyle = {
    background: headerGradient,
    color: "#fff",
    backdropFilter: "blur(10px)",
    borderRadius: 3,
    p: { xs: 2, md: 4 },
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    transition: "0.3s",
  };

  const chipStyle = {
    borderColor: "rgba(255,255,255,0.6)",
    color: "#fff",
    fontWeight: 600,
    backdropFilter: "blur(4px)",
    background: "rgba(255,255,255,0.08)",
    "& .MuiChip-icon": {
      color: "#fff",
    },
    "&:hover": {
      background: "rgba(255,255,255,0.15)",
      transform: "scale(1.05)",
    },
    transition: "0.2s",
    padding: "0 12px",
    margin: "0 4px",
  };

  return (
    <Paper sx={glassStyle} elevation={0}>
      {/* زرار التعديل */}
      <EditSession
        sessionById={sessionById}
        headerGradient={headerGradient}
        textColor="#fff"
      />

 

      {/* الوصف */}
      <Typography
        variant="body1"
        sx={{
          opacity: 0.85,
          mb: 2,
          maxWidth: 600,
          lineHeight: 1.7,
        }}
      >
        {sessionById?.description ||
          t("sessionDetails.noDescription")}
      </Typography>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 2 }} />

      {/* Chips */}
      <Stack
        direction="row"
        spacing={2}
        flexWrap="wrap"
        sx={{
          rowGap: 1.5,
        }}
      >
        {/* عدد الطلاب */}
        <Chip
          icon={<School />}
          label={`${sessionById?.attendance?.length || 0} ${
            isRTL ? "طالب" : "Students"
          }`}
          variant="outlined"
          sx={chipStyle}
        />

        {/* اسم الجروب */}
        {sessionById?.groupId?.name && (
          <Chip
            icon={<Groups />}
            label={sessionById.groupId.name}
            variant="outlined"
            sx={chipStyle}
          />
        )}

        {/* المكان */}
        {sessionById?.groupId?.place && (
          <Chip
            icon={<LocationOn />}
            label={sessionById.groupId.place}
            variant="outlined"
            sx={chipStyle}
          />
        )}

        {/* الصف */}
        {sessionById?.groupId?.grade && (
          <Chip
            icon={<Class />}
            label={
              isRTL
                ? `الصف ${sessionById.groupId.grade}`
                : `Grade ${sessionById.groupId.grade}`
            }
            variant="outlined"
            sx={chipStyle}
          />
        )}
      </Stack>
    </Paper>
  );
}