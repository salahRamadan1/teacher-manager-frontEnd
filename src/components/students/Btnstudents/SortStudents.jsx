import { Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function SortStudents() {
    const { t } = useTranslation();
    // ==============================
    // URL Search Params
    // ==============================
    const [searchParams, setSearchParams] = useSearchParams(); // Hook to read & update query params in URL

    // Get current "sort" value from URL, default to "-createdAt" (newest first)
    const sort = searchParams.get("sort") || "-createdAt";

    // ==============================
    // Handle Sort Change
    // ==============================
    // Update "sort" query parameter and reset page to 1 whenever the sort changes
    const handleChange = (e) => {
        setSearchParams(prev => {
            prev.set("page", 1);       // Reset pagination
            prev.set("sort", e.target.value); // Set the selected sort option
            return prev;
        });
    };

    return (
        <Select
            size="small"
            value={sort}
            onChange={handleChange}
        >
            <MenuItem value="-createdAt">
                {t("students.sort.newest")}
            </MenuItem>

            <MenuItem value="createdAt">
                {t("students.sort.oldest")}
            </MenuItem>

            <MenuItem value="payment">
                {t("students.sort.paymentAsc")}
            </MenuItem>

            <MenuItem value="-payment">
                {t("students.sort.paymentDesc")}
            </MenuItem>

            <MenuItem value="grade">
                {t("students.sort.gradeAsc")}
            </MenuItem>

            <MenuItem value="-grade">
                {t("students.sort.gradeDesc")}
            </MenuItem>
        </Select>
    );

}
