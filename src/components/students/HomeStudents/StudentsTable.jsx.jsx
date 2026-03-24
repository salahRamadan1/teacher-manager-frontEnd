import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { getStudents } from "../../../features/students/studentAction";
import ButtonDeleteStudent from "../Btnstudents/ButtonDeleteStudent";
import ButtonUpdateStudent from "../Btnstudents/ButtonUpdateStudent";
import SchoolIcon from "@mui/icons-material/School";
import DynamicSnackbar from "../../alerts/DynamicSnackbar";
import StudentsGridSkeleton from "./StudentsGridSkeleton";
import { useTranslation } from "react-i18next";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

export default function StudentsTable() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");
  const [sort, setSort] = useState("");
const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loadingGetStudent, errorGetStudent, errorGetStudentNetWork, students } =
    useSelector((state) => state.student);

  const theme = useTheme();

  const fetchStudents = () => {
    let url = `/student/getStudents?page=${page}`;
    if (search) url += `&keyword=${search}`;
    if (grade) url += `&grade=${grade}`;
    if (sort) url += `&sort=${sort}`;
    dispatch(getStudents(url));
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, grade, sort]);

  const [view, setView] = useState(localStorage.getItem("groupView") || "grid");

  const handleViewChange = (_, newView) => {
    if (!newView) return;
    setView(newView);
    localStorage.setItem("groupView", newView);
  };

  const hasStudents = Array.isArray(students) && students.length > 0;

  // ✅ placeholder (بدّلها باللي عندك)
  const handleViewStudent = (studentId) => {
    // navigate(`/students/${studentId}`)
    console.log("view student:", studentId);
  };

  // ✅ Empty state component
  const EmptyState = () => (
    <Grid size={12}>
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          borderRadius: 4,
          background: `linear-gradient(135deg,
            ${alpha(theme.palette.primary.main, 0.08)},
            ${alpha(theme.palette.secondary.main, 0.08)})`,
          border: `1px dashed ${theme.palette.divider}`,
        }}
      >
        <SchoolIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
        <Typography variant="h6" fontWeight={700}>
          {t("students.noStudentsYet")}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {t("students.startAddingFirst")}
        </Typography>
      </Box>
    </Grid>
  );

  return (
    <Box>
      {/* View Toggle */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <ToggleButtonGroup value={view} exclusive size="small" onChange={handleViewChange}>
          <ToggleButton value="grid">
            <ViewModuleIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="table">
            <ViewListIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {errorGetStudent && <DynamicSnackbar type="error" message={errorGetStudent} />}
      {errorGetStudentNetWork && <DynamicSnackbar type="error" message={errorGetStudentNetWork} />}

      {loadingGetStudent ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <StudentsGridSkeleton count={6} />
        </Box>
      ) : (
        <>
          {/* =======================
              GRID VIEW
              ======================= */}
          {view === "grid" && (
            <Grid container spacing={3}>
              {hasStudents ? (
                students.map((student) => (
                  <Grid key={student._id} size={{ xs: 12, sm: 6, md: 3}}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: theme.shadows[3],
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: theme.shadows[8],
                        },
                      }}
                      onClick={() => handleViewStudent(student._id)}
                    >
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" fontWeight={700}>
                            {student.name}
                          </Typography>

                          <Chip
                            label={`${t("grade")} ${student.grade}`}
                            color="secondary"
                            size="small"
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            📞 <strong>{t("phone")}:</strong> {student.phone}
                          </Typography>

                          <Typography variant="body2">
                            👨‍👩‍👦 <strong>{t("parent")}:</strong> {student.parentPhone}
                          </Typography>

                          <Box>
                            💰 <strong>{t("payment")}:</strong>{" "}
                            <Chip
                              label={student.payment > 0 ? student.payment : t("notPaidOrFree")}
                              size="small"
                              color={student.payment > 0 ? "success" : "error"}
                            />
                          </Box>
                        </Stack>

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mt: 3 }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewStudent(student._id);
                              navigate(`/students/${student._id}`);
                            }}
                          >
                            {t("view")}
                          </Button>

                          <Stack direction="row" spacing={1}>
                            <ButtonUpdateStudent studentId={student._id} />
                
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <EmptyState />
              )}
            </Grid>
          )}

          {/* =======================
              TABLE VIEW
              ======================= */}
          {view === "table" && (
            <Box>
              {!hasStudents ? (
                <Grid container>
                  <EmptyState />
                </Grid>
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.paper,
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>
                          {t("students.name") /* ضيف key لو مش موجود */}
                        </TableCell>

                        <TableCell sx={{ fontWeight: 800 }}>
                          {t("grade")}
                        </TableCell>

                        <TableCell sx={{ fontWeight: 800 }}>
                          {t("phone")}
                        </TableCell>

                        {/* نخفي parent على الموبايل */}
                        <TableCell sx={{ fontWeight: 800, display: { xs: "none", md: "table-cell" } }}>
                          {t("parent")}
                        </TableCell>

                        <TableCell sx={{ fontWeight: 800 }}>
                          {t("payment")}
                        </TableCell>

                        <TableCell align="right" sx={{ fontWeight: 800 }}>
                          {t("students.actions") /* ضيف key لو مش موجود */}
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {students.map((student) => (
                        <TableRow
                          key={student._id}
                          hover
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.06),
                            },
                          }}
                          onClick={() => handleViewStudent(student._id)}
                        >
                          <TableCell sx={{ fontWeight: 700 }}>{student.name}</TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              color="secondary"
                              label={t(`grades.${student.grade}`, { defaultValue: student.grade })}
                            />
                          </TableCell>

                          <TableCell>{student.phone}</TableCell>

                          <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                            {student.parentPhone}
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={student.payment > 0 ? student.payment : t("notPaidOrFree")}
                              size="small"
                              color={student.payment > 0 ? "success" : "error"}
                            />
                          </TableCell>

                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title={t("view")} arrow>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<VisibilityIcon />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewStudent(student._id);
                                  }}
                                >
                                  {t("view")}
                                </Button>
                              </Tooltip>

                              <span
                                onClick={(e) => e.stopPropagation()}
                                style={{ display: "inline-flex", gap: 8 }}
                              >
                                <ButtonUpdateStudent studentId={student._id} />
                             
                              </span>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}