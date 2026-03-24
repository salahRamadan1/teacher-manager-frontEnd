import { Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function BtnResetGroup() {
    const { t } = useTranslation();

    // ==============================
    // React Router: URL Search Params
    // ==============================
    const [searchParams, setSearchParams] = useSearchParams();
    // searchParams: current URL query parameters (read-only)
    // setSearchParams: function to update query parameters in the URL

    // ==============================
    // Handler: Reset Filters
    // ==============================
    const handleReset = () => {
        setSearchParams({}); // Remove all query parameters from the URL
    };

    // ==============================
    // UI: Reset Button
    // ==============================
    return (
<Button
  onClick={handleReset}
  variant="outlined"
  color="secondary"
  sx={{
    textTransform: "none",
    fontWeight: 600,
    borderRadius: 2,
  }}
>
  {t("groups.filters.reset")}
</Button>
    );

}
