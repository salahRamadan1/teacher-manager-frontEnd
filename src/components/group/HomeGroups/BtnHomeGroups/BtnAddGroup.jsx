import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Card,
  Typography,
  Divider,
  Paper,
  FormHelperText,
} from '@mui/material';
import { getTheme } from '../../../../theme';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import { addGroup, getGroups } from '../../../../features/groups/groupAction';
import { validateAddGroup } from '../../../../utils/validation/addGroupValidation';
import { makeStateIsEmpityGroup } from '../../../../features/groups/groupSlice';
import DynamicSnackbar from '../../../alerts/DynamicSnackbar';
import { useTranslation } from 'react-i18next';


export default function BtnAddGroup() {
  const { t } = useTranslation();
  // ================== Theme ==================
  // Custom theme colors (your own theme config)
  const colors = getTheme();
  // MUI theme hook
  const theme = useTheme();

  const summaryItems = [
    { key: "name", label: t("groups.fields.name"), icon: "📋" },
    { key: "price", label: t("groups.fields.pricePerSession"), icon: "💰" },
    { key: "place", label: t("groups.fields.place"), icon: "📍" },
    { key: "grade", label: t("groups.fields.grade"), icon: "🎓" },
    { key: "day", label: t("groups.fields.day"), icon: "📅" },
    { key: "time", label: t("groups.fields.time"), icon: "⏰" }
  ];
  // ================== Redux ==================
  // Dispatch actions
  const dispatch = useDispatch();

  // ================== Local State ==================
  // Holds frontend validation errors
  const [errors, setErrors] = useState({});
  // Used to show success feedback after creating group
  const [success, setSuccess] = useState(false);

  // Form data for creating a group
  const [formData, setFormData] = useState({
    place: '',
    grade: '',
    day: '',
    time: '',
    name: '',
    price: ''
  });

  // Static options for select inputs
  const grades = ['1st', '2nd', '3rd'];
  const days = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ];

  // ================== Redux State ==================
  // Extract group-related states from Redux store
  const {
    errorAddGroupName,
    errorAddGroupGrade,
    errorAddGroupDay,
    errorAddGroupTime,
    errorAddGroupPlace,
    errorAddGroupPrice,
    loadingGroup,
    errorAddGroup,
    errorAddGroupNetWork,
    loadingSuccessfully,
  } = useSelector((state) => state.group);

  // ================== Handlers ==================

  // Handle input change for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data dynamically
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear previous errors when user starts typing
    setErrors({});
    // Reset redux error/success state
    dispatch(makeStateIsEmpityGroup());
  };

  // Dialog open state
  const [openDialog, setOpenDialog] = useState(false);

  // Open dialog
  const handleOpen = () => {
    setOpenDialog(true);
  };

  // Close dialog and reset all related states
  const handleClose = () => {
    // Reset form
    setFormData({
      place: '',
      grade: '',
      day: '',
      time: '',
      name: '',
      price: ''
    });

    // Reset UI states
    setErrors({});
    setSuccess(false);
    setOpenDialog(false);

    // Reset redux state
    dispatch(makeStateIsEmpityGroup());
  };

  // ================== Submit Handler ==================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------- Frontend Validation (Joi) --------
    const validationErrors = validateAddGroup(formData);

    if (validationErrors) {
      const errObj = {};

      // Convert Joi errors to key-value object
      validationErrors.forEach((err) => {
        errObj[err.path] = err.message;
      });

      setErrors(errObj);
      console.log(errObj);
      return;
    }

    // -------- Dispatch Create Group Action --------
    const res = await dispatch(addGroup(formData));

    // If group created successfully
    if (
      res.type === "Group/createGroup/fulfilled" &&
      res.payload.message === "Group created successfully"
    ) {
      // Refresh groups list
      dispatch(getGroups('/group/getGroupsByTeacher'));

      // Show success feedback
      setSuccess(true);

      // Auto close dialog after short delay
      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 1000);
    }
  };


  return (
    <>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        variant="contained"
        onClick={(e) => {
          e.currentTarget.blur();
          handleOpen();
        }}
        sx={{
          mb: 1.5,
          px: 3,
          py: 1,
          borderRadius: 2.5,
          textTransform: "none",
          fontWeight: 700,
          fontSize: "0.95rem",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 12px rgba(0,0,0,0.6)"
              : "0 4px 12px rgba(0,0,0,0.2)",
          transition: "all 0.25s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 6px 20px rgba(0,0,0,0.8)"
                : "0 6px 20px rgba(0,0,0,0.3)",
          },
        }}
      >
        {t("groups.add.btn")}
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 20px 60px rgba(0,0,0,0.7)"
                : "0 20px 60px rgba(0,0,0,0.3)",
          },
        }}
        container={() => document.body}
      >
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "#fff",
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddCircleOutlineIcon sx={{ fontSize: 28 }} />
            <Typography fontWeight="bold" fontSize="1.5rem">
              {t("groups.add.title")}
            </Typography>
          </Box>

          <Button
            onClick={handleClose}
            disabled={loadingGroup}
            sx={{
              minWidth: "auto",
              color: "#fff",
              p: 0.5,
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <CloseIcon />
          </Button>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          {errorAddGroup && <DynamicSnackbar type="error" message={errorAddGroup} />}
          {errorAddGroupNetWork && <DynamicSnackbar type="error" message={errorAddGroupNetWork} />}
          {success && <DynamicSnackbar type="success" message={success} />}

          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
              borderRadius: 2,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Grid container spacing={2}>
              {/* Name */}
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label={`📋 ${t("groups.fields.name")}`}
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  disabled={loadingGroup}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: colors.primary },
                    },
                  }}
                  error={!!errors?.name || !!errorAddGroupName}
                  helperText={errors?.name || errorAddGroupName}
                />
              </Grid>

              {/* Price */}
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label={`💰 ${t("groups.fields.pricePerSession")}`}
                  name="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={handleChange}
                  disabled={loadingGroup}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: colors.primary },
                    },
                  }}
                  error={!!errors?.price || !!errorAddGroupPrice}
                  helperText={errors?.price || errorAddGroupPrice}
                />
              </Grid>

              {/* Place */}
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label={`📍 ${t("groups.fields.place")}`}
                  name="place"
                  value={formData.place || ""}
                  onChange={handleChange}
                  disabled={loadingGroup}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: colors.primary },
                    },
                  }}
                  error={!!errors?.place || !!errorAddGroupPlace}
                  helperText={errors?.place || errorAddGroupPlace}
                />
              </Grid>

              {/* Grade */}
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth disabled={loadingGroup} error={!!errors?.grade || !!errorAddGroupGrade}>
                  <InputLabel>{`🎓 ${t("groups.fields.grade")}`}</InputLabel>
                  <Select
                    name="grade"
                    value={formData.grade || ""}
                    onChange={handleChange}
                    label={`🎓 ${t("groups.fields.grade")}`}
                    sx={{ borderRadius: 2 }}
                  >
                    {grades.map((g) => (
                      <MenuItem key={g} value={g}>
                        {g}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors?.grade || errorAddGroupGrade}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Day */}
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth disabled={loadingGroup} error={!!errors?.day || !!errorAddGroupDay}>
                  <InputLabel>{`📅 ${t("groups.fields.day")}`}</InputLabel>
                  <Select
                    name="day"
                    value={formData.day || ""}
                    onChange={handleChange}
                    label={`📅 ${t("groups.fields.day")}`}
                    sx={{ borderRadius: 2 }}
                  >
                    {days.map((d) => (
                      <MenuItem key={d} value={d}>
                           {t(`groups.days.${d}`)}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors?.day || errorAddGroupDay}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Time */}
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label={`⏰ ${t("groups.fields.time")}`}
                  name="time"
                  type="time"
                  value={formData.time || ""}
                  onChange={handleChange}
                  disabled={loadingGroup}
                  InputLabelProps={{ shrink: true }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  error={!!errors?.time || !!errorAddGroupTime}
                  helperText={errors?.time || errorAddGroupTime}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Summary Box */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
              borderRadius: 2,
            }}
          >
            <Typography fontSize="0.85rem" color="text.secondary" sx={{ mb: 1 }}>
              📋 {t("groups.add.summaryTitle")}
            </Typography>

            <Divider sx={{ mb: 1 }} />

            <Grid container spacing={2}>
              {summaryItems.map((item) => (
                <Grid key={item.key} size={{ xs: 6, sm: 4, md: 2 }}>
                  <Typography
                    fontSize="0.75rem"
                    color="text.secondary"
                    sx={{
                      opacity: 0.6,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Typography>

                  <Typography fontSize="0.95rem" fontWeight={600}>
                    {formData[item.key] || t("groups.emptyDash")}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>

        {/* Action Buttons */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            borderTop: `1px solid ${colors.border}`,
            bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
          }}
        >
          <Button
            onClick={handleClose}
            disabled={loadingGroup}
            sx={{
              textTransform: "none",
              fontSize: "0.95rem",
              px: 3,
              borderRadius: 2,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              "&:hover": { bgcolor: `${colors.primary}10` },
            }}
          >
            {t("groups.actions.cancel")}
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loadingGroup}
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              color: "#fff",
              textTransform: "none",
              fontSize: "0.95rem",
              px: 4,
              borderRadius: 2,
              boxShadow: `0 4px 15px ${colors.primary}40`,
              "&:hover": { boxShadow: `0 6px 20px ${colors.primary}60` },
            }}
          >
            {loadingGroup ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                {t("groups.add.create")}
              </>
            ) : (
              `✓ ${t("groups.add.create")}`
            )}
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
