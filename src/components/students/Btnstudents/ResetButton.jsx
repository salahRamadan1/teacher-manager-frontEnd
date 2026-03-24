import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function ResetButton() {
      const { t } = useTranslation();
  
  // ==============================
  // URL Search Params
  // ==============================
  const [searchParams, setSearchParams] = useSearchParams();
  // ==============================
  // Reset Filters Handler
  // ==============================
  const handleReset = () => {
    setSearchParams({}); // إزالة كل الفلاتر
  };

  return (
    // ==============================
    // Reset Filters Button
    // ==============================
    <Button
      variant="outlined"
      color="secondary"
      onClick={handleReset}
    >
      {t("students.resetFilters")}
   
    </Button>
  );

}
