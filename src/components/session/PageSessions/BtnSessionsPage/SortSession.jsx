import { Select, MenuItem } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
        // ==============================
        // Sorting Select Dropdown
        // ==============================
        <Select
            size="small"         // Small size dropdown
            value={sort}         // Controlled value from URL
            onChange={handleChange} // Update URL params on change
        >
            {/* Sorting options */}
            <MenuItem value="-createdAt">{t("sessions.filters.sort.newest")}</MenuItem>  {/* Most recent first */}
            <MenuItem value="createdAt">{t("sessions.filters.sort.oldest")}</MenuItem>  {/* Oldest first */}
            <MenuItem value="totalCenterPrice">{t("sessions.filters.sort.priceAsc")}</MenuItem>  {/* Payment ascending */}
            <MenuItem value="-totalTeacherPrice">{t("sessions.filters.sort.priceDesc")}</MenuItem> {/* Payment descending */}
            <MenuItem value="totalCenterPrice">{t("sessions.filters.sort.totalCenterPriceAsc")}</MenuItem>  {/* Payment ascending */}
            <MenuItem value="-totalCenterPrice">{t("sessions.filters.sort.totalCenterPriceDesc")}</MenuItem> {/* Payment descending */}
            <MenuItem value="-centerPrice">{t("sessions.filters.sort.centerPriceDesc")}</MenuItem> {/* Payment descending */}
            <MenuItem value="centerPrice">{t("sessions.filters.sort.centerPriceAsc")}</MenuItem> {/* Payment ascending */}
            <MenuItem value="grade">{t("sessions.filters.sort.gradeAsc")}</MenuItem>      {/* Grade ascending */}
            <MenuItem value="-grade">{t("sessions.filters.sort.gradeDesc")}</MenuItem>     {/* Grade descending */}
        </Select>
    );

}
