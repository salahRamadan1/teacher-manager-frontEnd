import { Select, MenuItem, FormControl, InputLabel, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function GradeFilter() {
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
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel id="grade-filter-label">{t("students.gradeFilter.label")}</InputLabel>

      <Select
        labelId="grade-filter-label"
        label={t("students.gradeFilter.label")}
        name="grade"
        value={grade}
        onChange={handleChange}
        title={t("students.gradeFilter.label")}
        sx={{
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[700]
                  : theme.palette.grey[400],
            },
            "&:hover fieldset": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
            },
            color: theme.palette.text.primary,
          },
        }}
      >
        <MenuItem value="">{t("students.gradeFilter.all")}</MenuItem>

        {/* 👇 value ثابت للباك، واللي بيتعرض مترجم */}
        <MenuItem value="1st">{t("students.gradeFilter.grades.1st")}</MenuItem>
        <MenuItem value="2nd">{t("students.gradeFilter.grades.2nd")}</MenuItem>
        <MenuItem value="3rd">{t("students.gradeFilter.grades.3rd")}</MenuItem>
      </Select>
    </FormControl>
  );

}
