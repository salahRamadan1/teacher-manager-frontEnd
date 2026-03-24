import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function GradeFilterGroup() {
    const { t } = useTranslation();

    // ==============================
    // Grade Filter Dropdown
    // ==============================
    const [searchParams, setSearchParams] = useSearchParams(); // Hook to manage URL query parameters
    const grade = searchParams.get("grade") || "";              // Get current grade filter from URL

    // Handle selection change
    const handleChange = (e) => {
        setSearchParams((prev) => {
            prev.set("page", 1);                 // Reset pagination whenever grade changes
            if (e.target.value) {
                prev.set("grade", e.target.value); // Set selected grade in query params
            } else {
                prev.delete("grade");             // Remove grade filter if empty
            }
            return prev;
        });
    };

    return (
        <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="grade-filter-label">
                🎓 {t("groups.filters.grade")}
            </InputLabel>

            <Select
                labelId="grade-filter-label"
                name="grade"
                value={grade}
                onChange={handleChange}
                label={`🎓 ${t("groups.filters.grade")}`}
                sx={{
                    borderRadius: "8px",
                }}
            >
                <MenuItem value="">{t("groups.filters.all")}</MenuItem>

                {/* 👇 value ثابت للباك اند – النص مترجم */}
                <MenuItem value="1st">
                    {t("groups.filters.grades.1st")}
                </MenuItem>

                <MenuItem value="2nd">
                    {t("groups.filters.grades.2nd")}
                </MenuItem>

                <MenuItem value="3rd">
                    {t("groups.filters.grades.3rd")}
                </MenuItem>
            </Select>
        </FormControl>

    );

}
