import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert, Collapse, IconButton, Stack, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteSessionById } from "../../../features/session/sessionAction";
import { keyframes } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import { makeStateIsEmpitySession } from "../../../features/session/sessionSlice";
import { useTranslation } from "react-i18next";
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.6);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
  }
`;

export default function DeleteSessionButton({ sessionId }) {
    const { t } = useTranslation();
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch();
    const { id } = useParams()
    const { loadingDelete, successDelete, errorDelete } = useSelector(state => state.session);
    const navigate = useNavigate()
    const handleDelete = async () => {
        const res = await dispatch(deleteSessionById({ sessionId: id }));
        console.log(res);
        if (res.payload?.message === 'Session deleted successfully') {
            navigate(`/GroupDetails/${res.payload.groupId}`)
            dispatch(makeStateIsEmpitySession())
        }
    };


    return (
        <>
            {/* Delete Button */}
            <Button
                variant="outlined"
                color="error"
                onClick={() => setOpenDialog(true)}
                disabled={loadingDelete}
                sx={{
                    position: "relative",
                    transition: "all 0.3s ease",
                    animation: loadingDelete ? `${pulse} 1s infinite` : "none",
                    "&:hover": {
                        bgcolor: (theme) => theme.palette.error.light,
                        color: "#fff",
                        animation: `${pulse} 1s infinite`,
                    },
                }}
            >
                {loadingDelete ? <CircularProgress size={20} /> : t("sessions.deleteSession.action")}
            </Button>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{t("sessions.deleteSession.title")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t("sessions.deleteSession.warningText")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>{t("cancel")}</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={loadingDelete}
                    >
                        {loadingDelete ? <CircularProgress size={20} /> : t("sessions.deleteSession.action")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Alerts */}
            <Stack spacing={1} sx={{ mt: 2 }}>
                {successDelete && (
                    <Collapse in={!!successDelete}>
                        <Alert
                            severity="success"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {successDelete}
                        </Alert>
                    </Collapse>
                )}
                {errorDelete && (
                    <Collapse in={!!errorDelete}>
                        <Alert
                            severity="error"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {errorDelete}
                        </Alert>
                    </Collapse>
                )}
            </Stack>
        </>
    );
}
