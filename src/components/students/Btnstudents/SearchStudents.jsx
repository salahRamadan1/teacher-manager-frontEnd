import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SearchStudents({ disabled }) {
    const { t } = useTranslation();

    // ==============================
    // URL Search Params
    // ==============================
    const [searchParams, setSearchParams] = useSearchParams(); // Hook to read & update query params in URL

    // Get current "keyword" from URL, default to empty string
    const keyword = searchParams.get("keyword") || "";

    // ==============================
    // Handle Input Change
    // ==============================
    // Updates the "keyword" query parameter as the user types
    // Also resets "page" to 1 whenever a new search is performed
    const handleChange = (e) => {
        const value = e.target.value;

        setSearchParams(prev => {
            prev.set("page", 1); // Reset pagination to page 1
            if (value) {
                prev.set("keyword", value); // Set the search keyword
            } else {
                prev.delete("keyword"); // Remove keyword if input is empty
            }
            return prev;
        });
    };

    return (
        // ==============================
        // Search Input Field
        // ==============================
        <TextField
            placeholder={t("students.serachPlaceholder")}// Placeholder text
            variant="outlined"               // Outlined style
            size="small"                     // Small input size
            value={keyword}                  // Controlled input value
            onChange={handleChange}          // Update URL query on input change
            InputProps={{
                startAdornment: (
                    // ==============================
                    // Start Icon
                    // ==============================
                    <InputAdornment position="start">
                        <SearchIcon color="primary" />
                    </InputAdornment>
                ),
            }}
            sx={{
                flex: 1, // Flexible width to fill container
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2, // Rounded corners
                },
            }}
        />
    );

}
