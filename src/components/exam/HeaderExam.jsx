import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getExamBySession } from '../../features/exam/examAction';
import { useTranslation } from "react-i18next";
export default function HeaderExam() {
    const { t } = useTranslation();
    const { id } = useParams()
    const theme = useTheme();
    const dispatch = useDispatch();
    const { exam, loading, error } = useSelector((state) => state.exam);
    const isSmall = useMediaQuery(theme.breakpoints.down("sm")); // responsive
    useEffect(() => {
        dispatch(getExamBySession(id));
        console.log(exam);

    }, [dispatch, id]);
    return (
     <div>
  <Box
    sx={{
      mb: 3,
      p: { xs: 1.5, sm: 2 },
      borderRadius: 2,
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { sm: "center" },
      justifyContent: "space-between",
      gap: 1.5,
      background: (theme) =>
        theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #1e1e1e, #2a2a2a)"
          : "linear-gradient(135deg, #f5f7fa, #ffffff)",
      border: (theme) => `1px solid ${theme.palette.divider}`,
    }}
  >
    {/* Exam title */}
    <Typography
      variant={isSmall ? "h6" : "h5"}
      sx={{
        fontWeight: 600,
        color: "text.primary",
        wordBreak: "break-word",
      }}
    >
      📝 {exam?.title || t("examHeader.addMarks")}
    </Typography>

    {/* Right info */}
    <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
      
      {/* Total mark */}
      <Box
        sx={{
          px: 2,
          py: 0.5,
          borderRadius: 20,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(144, 202, 249, 0.15)"
              : "primary.light",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: (theme) =>
              theme.palette.mode === "dark"
                ? "primary.light"
                : "primary.contrastText",
          }}
        >
          🎯 {t("examHeader.total")}: {exam?.totalMark ?? "--"}
        </Typography>
      </Box>

 

    </Stack>
  </Box>
</div>
    )
}
