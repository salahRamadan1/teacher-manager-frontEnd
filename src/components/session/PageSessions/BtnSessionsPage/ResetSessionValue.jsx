import { Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ResetSessionValue() {
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
      {t("sessions.filters.reset")}
    </Button>
  );

}
