import {
  Box,
  Container,
  Typography,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudents } from "../features/students/studentAction";
import { useSearchParams } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";

import SearchStudents from "../components/students/Btnstudents/SearchStudents.jsx";
import SortStudents from "../components/students/Btnstudents/SortStudents.jsx";
import GradeFilter from "../components/students/Btnstudents/GradeFilter.jsx";
import ResetButton from "../components/students/Btnstudents/ResetButton.jsx";
import PaginationStudents from "../components/students/Btnstudents/PaginationStudents.jsx";
import ButttonAddStudents from "../components/students/Btnstudents/ButttonAddStudents.jsx";
import StudentsTable from "../components/students/HomeStudents/StudentsTable.jsx.jsx";
import { buildStudentsUrl } from "../utils/studentsUrl/buildUrl.js";

import { useTranslation } from "react-i18next";

export default function Students() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const {
    loadingGetStudent,
    errorGetStudent,
    errorGetStudentNetWork,
    totalPages,
    students,
    totalStudents
  } = useSelector((state) => state.student);

  const theme = useTheme();

  useEffect(() => {
    const url = buildStudentsUrl(searchParams);
    dispatch(getStudents(url));
  }, [dispatch, searchParams]);

  return (
    < >
      {errorGetStudent && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            fontWeight: 600,
            animation: "slideInDown 0.3s ease",
          }}
        >
          ❌ {errorGetStudent /* لو الباك بيرجع نص جاهز */}
        </Alert>
      )}

      {errorGetStudentNetWork && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            fontWeight: 600,
            animation: "slideInDown 0.3s ease",
          }}
        >
          🌐 {t("error.networkPrefix")}: {errorGetStudentNetWork}
        </Alert>
      )}

      {!errorGetStudent && !errorGetStudentNetWork && (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}
            >
              {t("students.pageTitle")}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t("students.pageSubtitle")}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
            }}
          >
            <SearchStudents />
            <SortStudents disabled={loadingGetStudent} />
            <GradeFilter disabled={loadingGetStudent} />
            <ResetButton disabled={loadingGetStudent} />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <ButttonAddStudents disabled={loadingGetStudent} />
          </Box>

          <StudentsTable />

          {students.length > 0 && (
            <PaginationStudents disabled={loadingGetStudent} totalPages={totalPages} />
          )}

          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              color: "#fff",
              boxShadow: `0 12px 30px ${theme.palette.primary.main}40`,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 18px 40px ${theme.palette.primary.main}60`,
              },
            }}
          >
            <PeopleIcon
              sx={{
                position: "absolute",
                top: -10,
                right: -10,
                fontSize: 120,
                opacity: 0.15,
              }}
            />

            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontWeight: 600,
                letterSpacing: 0.5,
                mb: 1,
              }}
            >
              {t("students.totalEnrolled")}
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.4rem", sm: "3rem" },
              }}
            >
              {loadingGetStudent ? "—" : totalStudents ?? students.length}
            </Typography>
          </Box>
        </>
      )}
    </ >
  );
}
