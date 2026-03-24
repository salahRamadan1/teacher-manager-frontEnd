import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    useTheme
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function SessionWarningDialog({ open, onClose, sessionId, message }) {
    const { t } = useTranslation();
    const theme = useTheme(); // للوضع الداكن والفاتح
    const navigate = useNavigate(); // للتنقل للصفحة

    const handleGoToSession = () => {
        navigate(`/session/${sessionId}`); // عدل الرابط حسب route بتاعك
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 2,
                    bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
                    boxShadow: 24,
                },
            }}
        >
          
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    color: theme.palette.mode === "dark" ? theme.palette.warning.main : theme.palette.warning.dark,
                }}
            >
                <WarningAmberIcon sx={{ fontSize: 36 }} />
                {t("sessions.sessionExists")}
            </DialogTitle>

         
            <DialogContent sx={{ py: 2 }}>
                <Typography
                    variant="body1"
                    color={theme.palette.mode === "dark" ? "#ccc" : "text.primary"}
                    sx={{ textAlign: "center", fontSize: "1rem" }}
                >
                    {message ? message : t("sessions.sessionMsg")}
                    <br />
                    {t("sessions.sessionExists")}
                </Typography>
            </DialogContent>

          
            <DialogActions sx={{ justifyContent: "center", flexDirection: "column", gap: 1, mt: 1 }}>
                <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    onClick={handleGoToSession}
                    sx={{
                        fontWeight: 600,
                        py: 1.5,
                        fontSize: "1rem",
                        borderRadius: 2,
                        "&:hover": {
                            backgroundColor: theme.palette.mode === "dark" ? theme.palette.warning.dark : theme.palette.warning.main,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        },
                    }}
                >
                    {t("sessions.goToSessionDetails")}
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={onClose}
                    sx={{
                        mt: 0.5,
                        borderColor: theme.palette.mode === "dark" ? "#555" : "#ccc",
                        color: theme.palette.mode === "dark" ? "#ccc" : "text.primary",
                        "&:hover": {
                            borderColor: theme.palette.warning.main,
                            backgroundColor: theme.palette.mode === "dark" ? "#2c2c2c" : "#f9f9f9",
                        },
                    }}
                >
                    {t("sessions.addSession.actions.cancel")}
                </Button>
            </DialogActions>
        </Dialog>

    );
}
