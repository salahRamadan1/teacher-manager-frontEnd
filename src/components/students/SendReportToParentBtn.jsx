import React from "react";
import { Button, CircularProgress } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useDispatch, useSelector } from "react-redux";
import { generateStudentWhatsappLink } from "../../features/students/studentReportAction";
 import { useTranslation } from "react-i18next";
export default function SendReportToParentBtn({ studentId }) {
  const dispatch = useDispatch();
const { t } = useTranslation();
  const { loadingGenerateWhatsapp } = useSelector(
    (state) => state.studentReport
  );

  const handleSend = async () => {
    const resultAction = await dispatch(generateStudentWhatsappLink(studentId));

    if (generateStudentWhatsappLink.fulfilled.match(resultAction)) {
      const whatsappLink = resultAction.payload?.whatsappLink;

      if (whatsappLink) {
        window.open(whatsappLink, "_blank");
      }
    } else {
      alert(resultAction.payload || "حدث خطأ أثناء تجهيز التقرير");
    }
  };

  return (
<Button
  variant="contained"
  color="success"
  startIcon={
    loadingGenerateWhatsapp ? (
      <CircularProgress size={18} color="inherit" />
    ) : (
      <WhatsAppIcon />
    )
  }
  onClick={handleSend}
  disabled={loadingGenerateWhatsapp}
  sx={{ borderRadius: 2, textTransform: "none" }}
>
  {loadingGenerateWhatsapp
    ? t("report.preparing")
    : t("report.sendToParent")}
</Button>
  );
}