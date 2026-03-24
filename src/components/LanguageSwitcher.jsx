import { IconButton, Tooltip, Box } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useState } from "react";

export default function LanguageToggle() {
  const { t } = useTranslation();
  const [rotating, setRotating] = useState(false);

  const currentLang = i18n.language?.startsWith("ar") ? "ar" : "en";

  const toggleLanguage = async () => {
    const newLang = currentLang === "ar" ? "en" : "ar";

    setRotating(true);

    await i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";

    setTimeout(() => setRotating(false), 400);
  };

  return (
    <Tooltip title={t("language")}>
      <IconButton
        onClick={toggleLanguage}
        sx={{
          px: 1.5,
          height: 36,
          borderRadius: 20,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          gap: 1,
          transition: "all 0.3s ease",
        }}
      >
        <LanguageIcon
          sx={{
            fontSize: 18,
            transition: "transform 0.4s ease",
            transform: rotating ? "rotate(360deg)" : "rotate(0deg)",
          }}
        />

        <Box
          component="span"
          sx={{
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {currentLang === "ar" ? "EN" : "AR"}
        </Box>
      </IconButton>
    </Tooltip>
  );
}
