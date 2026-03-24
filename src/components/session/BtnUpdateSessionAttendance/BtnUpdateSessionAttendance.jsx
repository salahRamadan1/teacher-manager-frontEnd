import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import React, { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import EditIcon from "@mui/icons-material/Edit";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import SaveIcon from "@mui/icons-material/Save";
import { keyframes } from "@mui/material";
import { validateUpdateStudentAttendanceOrNote } from "../../../utils/validation/sessionsValidations";
import { getSession, toggleStudentAttendanceSession } from "../../../features/session/sessionAction";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DynamicSnackbar from "../../alerts/DynamicSnackbar";
import { makeStateIsEmpitySession } from "../../../features/session/sessionSlice";
import { Alert, Collapse } from "@mui/material";
import { useTranslation } from "react-i18next";
export default function BtnUpdateSessionAttendance({ student, Present, onSave }) {
    // =========================
    // Pulse animation for UI feedback
    // Used for buttons or elements to indicate a pending change
    // =========================
    const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.6);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 193, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
  }
`;
const { t } = useTranslation();
    // =========================
    // Local component state
    // =========================
    const [formData, setFormData] = useState({
        studentId: student.studentId._id, // ID of the student being edited
        note: student.note || "",          // Note for the student
        toggleAttendance: undefined        // Whether attendance is being toggled (true/undefined)
    });

    const [open, setOpen] = useState(false);            // Dialog open state
    const [confirmToggle, setConfirmToggle] = useState(false); // Tracks if attendance toggle is confirmed
    const [errors, setErrors] = useState({});           // Validation errors object

    const { id } = useParams();                         // sessionId from URL
    const dispatch = useDispatch();                     // Redux dispatcher

    // =========================
    // Open the dialog
    // =========================
    const handleOpendailog = () => {
        setOpen(true);
    };

    // =========================
    // Close the dialog and reset errors/state
    // =========================
    const handleClosedailog = () => {
        setOpen(false);
        setErrors({});
        dispatch(makeStateIsEmpitySession()); // Reset any temporary session state in Redux
    };

    // =========================
    // Change note handler
    // Updates local formData and resets temporary Redux state
    // =========================
    const handleChangeNote = (e) => {
        dispatch(makeStateIsEmpitySession());
        setFormData(prev => ({
            ...prev,
            note: e.target.value
        }));
    };

    // =========================
    // Request attendance toggle
    // Marks that the student’s attendance will be changed
    // =========================
    const handleToggleAttendance = () => {
        setConfirmToggle(true);
        setFormData(prev => ({
            ...prev,
            toggleAttendance: true
        }));
        dispatch(makeStateIsEmpitySession());
    };

    // =========================
    // Undo attendance toggle
    // Reverts the toggleAttendance flag and resets confirmation
    // =========================
    const handleRetreatToggle = () => {
        setConfirmToggle(false);
        setFormData(prev => ({
            ...prev,
            toggleAttendance: undefined
        }));
        dispatch(makeStateIsEmpitySession());
    };

    // =========================
    // Redux state selectors
    // Tracks loading and error states for the toggle attendance API call
    // =========================
    const {
        loadingToggleStudentAttendanceSession,
        errorToggleStudentAttendanceSession,
        errorToggleStudentAttendanceSessionNetWork,
        errorToggleStudentToggleAttendance,
    } = useSelector((state) => state.session);

    // =========================
    // Save changes handler
    // Validates formData, dispatches API call, and refreshes session on success
    // =========================
    const handleSave = async () => {
        console.log("SEND TO API 👉", formData);

        // Frontend validation using Joi
        const validationErrors = validateUpdateStudentAttendanceOrNote(formData);
        if (validationErrors) {
            const errObj = {};
            validationErrors.forEach(err => errObj[err.path] = err.message); // Map errors by field
            console.log(errObj);
            setErrors(errObj);
            return;
        }

        // Dispatch API call to update attendance/note
        const res = await dispatch(toggleStudentAttendanceSession({ sessionId: id, formData }));
        console.log(res);

        // If update succeeds, refresh the session data
        if (
            res.type === 'session/toggleStudentAttendance/fulfilled' &&
            res.payload.message === "Student attendance/note updated successfully"
        ) {
            dispatch(getSession(id)); // Refresh session to reflect changes
        }
    };

   return (
    <>
      {errorToggleStudentAttendanceSession && (
        <DynamicSnackbar type="error" message={errorToggleStudentAttendanceSession} />
      )}
      {errorToggleStudentAttendanceSessionNetWork && (
        <DynamicSnackbar type="error" message={errorToggleStudentAttendanceSessionNetWork} />
      )}
      {errorToggleStudentToggleAttendance && (
        <DynamicSnackbar type="error" message={errorToggleStudentToggleAttendance} />
      )}

      <Tooltip
        title={Present ? t("sessions.attendance.tooltipEditPresent") : t("sessions.attendance.tooltipEditAbsent")}
        arrow
      >
        <IconButton
          onClick={handleOpendailog}
          size="small"
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[100],
            border: "1px solid",
            borderColor: "divider",
            transition: "all .2s ease",
            color: Present ? "error.main" : "success.main",
            "&:hover": {
              bgcolor: Present ? "error.main" : "success.main",
              color: "#fff",
              transform: "scale(1.08)",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 0 0 3px rgba(255,255,255,0.1)"
                  : "0 0 0 3px rgba(0,0,0,0.08)",
            },
          }}
        >
          {Present ? (
            <CancelOutlinedIcon fontSize="small" />
          ) : (
            <CheckCircleOutlineIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : "#fff",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 700,
            pb: 1,
          }}
        >
          <EditIcon color="primary" />
          {t("sessions.attendance.editTitle")}
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Stack spacing={0.5}>
            <Typography fontWeight={600}>
              {student.studentId.name}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {t("sessions.attendance.statusLabel")}
              </Typography>

              <Chip
                size="small"
                color={Present ? "success" : "error"}
                label={Present ? t("sessions.attendance.present") : t("sessions.attendance.absent")}
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Stack>

          <Divider />

          <TextField
            label={t("sessions.attendance.noteLabel")}
            multiline
            rows={3}
            value={formData.note}
            onChange={handleChangeNote}
            fullWidth
            placeholder={t("sessions.attendance.notePlaceholder")}
          />

          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Button
              variant={confirmToggle ? "contained" : "outlined"}
              color={confirmToggle ? "warning" : Present ? "error" : "success"}
              disabled={confirmToggle}
              onClick={handleToggleAttendance}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                transition: "all .2s ease",
                animation: confirmToggle ? `${pulse} 1.4s infinite` : "none",
              }}
            >
              {confirmToggle
                ? t("sessions.attendance.changePending")
                : Present
                  ? t("sessions.attendance.markAbsent")
                  : t("sessions.attendance.markPresent")}
            </Button>

            {confirmToggle && (
              <Tooltip title={t("sessions.attendance.changeWillBeApplied")} arrow>
                <IconButton
                  size="small"
                  color="warning"
                  onClick={handleRetreatToggle}
                  sx={{
                    border: "1px dashed",
                    borderColor: "warning.main",
                    animation: confirmToggle ? "shake 0.6s ease-in-out" : "none",
                    "@keyframes shake": {
                      "0%, 100%": { transform: "translateX(0)" },
                      "25%": { transform: "translateX(-2px)" },
                      "75%": { transform: "translateX(2px)" },
                    },
                  }}
                >
                  <KeyboardReturnIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : theme.palette.grey[50],
          }}
        >
          <Button
            onClick={handleClosedailog}
            color="inherit"
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            {t("sessions.attendance.cancel")}
          </Button>

          <Button
            disabled={loadingToggleStudentAttendanceSession}
            variant="contained"
            onClick={handleSave}
            startIcon={<SaveIcon />}
            sx={{
              minWidth: 120,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: 3 },
            }}
          >
            {loadingToggleStudentAttendanceSession
              ? t("sessions.attendance.saving")
              : t("sessions.attendance.saveChanges")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
