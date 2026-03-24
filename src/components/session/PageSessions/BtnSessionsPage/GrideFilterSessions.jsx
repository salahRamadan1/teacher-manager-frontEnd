import { Select, MenuItem, FormControl, InputLabel, useTheme } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function GrideFilterSessions() {
 const { t } = useTranslation();
  // ==============================
  // Access MUI theme for styling
  const theme = useTheme();
  // ==============================
  // URL Search Params (React Router)
  // ==============================
  // Get current query parameters from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  // Get the current "grade" value from the URL, default to empty string
  const grade = searchParams.get("grade") || "";

  // ==============================
  // Handle Select Change
  // ==============================
  // Update the "grade" in URL search params
  // Also reset "page" to 1 when filter changes
  const handleChange = e => {
    setSearchParams(prev => {
      prev.set("page", 1); // Reset page to 1 on filter change
      if (e.target.value) prev.set("grade", e.target.value); // Set selected grade
      else prev.delete("grade"); // Remove grade filter if empty
      return prev;
    });
  };

  return (
    // ==============================
    // Grade Filter UI
    // ==============================
    <FormControl size="small" sx={{ minWidth: 120 }}>

      {/* Label for the Select input */}
      <InputLabel>🎓
      {t("sessions.filters.grade")}
        </InputLabel>

      <Select
        name="grade"
        value={grade}
        onChange={handleChange}
        label="🎓 Grade"
        sx={{
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              // لون الحدود الافتراضي حسب الـ mode
              borderColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[700]
                  : theme.palette.grey[400],
            },
            '&:hover fieldset': {
              // لون الحدود عند hover حسب الـ mode
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              // لون الحدود عند التركيز
              borderColor: theme.palette.primary.main,
            },
            // لون النص حسب الـ mode
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.text.primary
                : theme.palette.text.primary,
          },
        }}
      >
        <MenuItem value="">{t("sessions.filters.all")}</MenuItem>
        <MenuItem value="1st">{t("sessions.filters.grades.1st")}</MenuItem>
        <MenuItem value="2nd">{t("sessions.filters.grades.2nd")}</MenuItem>
        <MenuItem value="3rd">{t("sessions.filters.grades.3rd")}</MenuItem>
      </Select>


    </FormControl>
  );

}
