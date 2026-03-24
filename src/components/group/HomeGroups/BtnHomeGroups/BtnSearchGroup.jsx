import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BtnSearchGroup({ disabled }) {
    const { t } = useTranslation();

    // ==============================
    // React Router: URL Search Params
    // ==============================
    const [searchParams, setSearchParams] = useSearchParams();
    // searchParams: current URL query parameters (read-only)
    // setSearchParams: function to update query parameters in the URL

    // Get current keyword from query params, default to empty string
    const keyword = searchParams.get("keyword") || "";

    // ==============================
    // Handler: Update Search Keyword
    // ==============================
    const handleChange = (e) => {
        const value = e.target.value;

        setSearchParams(prev => {
            // Reset pagination to page 1 whenever keyword changes
            prev.set("page", 1);

            if (value) {
                // Set 'keyword' in URL if input is not empty
                prev.set("keyword", value);
            } else {
                // Remove 'keyword' from URL if input is empty
                prev.delete("keyword");
            }

            return prev; // Return updated search params
        });
    };

    // ==============================
    // UI: Search Input Field
    // ==============================
    return (
        <TextField
            placeholder={t("groups.filters.searchPlaceholder")}
            variant="outlined"
            size="small"
            value={keyword}
            onChange={handleChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon color="primary" />
                    </InputAdornment>
                ),
            }}
            sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                },
            }}
        />
    );

}
