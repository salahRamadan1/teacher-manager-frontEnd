import { Select, MenuItem } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function SortGroup() {
    const { t } = useTranslation();

    // ==============================
    // Sort Dropdown Component
    // ==============================

    // URL search params for sorting
    const [searchParams, setSearchParams] = useSearchParams();

    // Get current sort value from URL query params or default to newest
    const sort = searchParams.get("sort") || "-createdAt";

    // Handle dropdown change
    const handleChange = (e) => {
        setSearchParams(prev => {
            prev.set("page", 1);          // Reset pagination whenever sort changes
            prev.set("sort", e.target.value); // Update sort value in URL params
            return prev;
        });
    };

    return (
        // MUI Select Dropdown for sorting
        <Select
            size="small"
            value={sort}
            onChange={handleChange}
        >
            <MenuItem value="-createdAt">
                {t("groups.filters.sort.newest")}
            </MenuItem>

            <MenuItem value="createdAt">
                {t("groups.filters.sort.oldest")}
            </MenuItem>

            <MenuItem value="grade">
                {t("groups.filters.sort.gradeAsc")}
            </MenuItem>

            <MenuItem value="-grade">
                {t("groups.filters.sort.gradeDesc")}
            </MenuItem>
        </Select>
    );

}
