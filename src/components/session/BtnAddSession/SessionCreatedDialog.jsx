import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function SessionCreatedDialog({ open, onClose, sessionId }) {
  const { t } = useTranslation();
  const navigate = useNavigate(); // للتنقل للصفحة
  
  const handleGoToSession = () => {
    navigate(`/session/${sessionId}`); // عدل الرابط حسب route بتاعك
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {/* Dialog Title with Icon */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? theme.palette.grey[900] : "#e8f5e9",
          color: (theme) =>
            theme.palette.mode === "dark" ? "#fff" : "#2e7d32",
          fontWeight: "bold",
          fontSize: "1.2rem"
        }}
      >
        <CheckCircleIcon fontSize="large" />
        Session Created!
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ textAlign: "center", py: 4, px: 3 }}>
        <Typography
          variant="body1"
          sx={{
            color: (theme) =>
              theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[800],
          }}
        >
          {t("sessions.sessionCreated")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: (theme) =>
              theme.palette.mode === "dark" ? theme.palette.grey[400] : theme.palette.grey[700],
          }}
        >
          {t("sessions.sessionMsg")}
        </Typography>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ justifyContent: "center", pb: 3, px: 3, gap: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleGoToSession(sessionId)}
          sx={{
            px: 3,
            py: 1.2,
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.success.dark
                  : "#1b5e20",
            },
          }}
        >
          {t("sessions.goToSessionDetails")}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          sx={{
            px: 3,
            py: 1.2,
            fontWeight: "bold",
            borderColor: (theme) =>
              theme.palette.mode === "dark" ? theme.palette.grey[700] : "#bdbdbd",
            color: (theme) =>
              theme.palette.mode === "dark" ? theme.palette.grey[300] : "#424242",
            "&:hover": {
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? theme.palette.grey[500] : "#757575",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
            },
          }}
        >
          {t("sessions.addSession.actions.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
