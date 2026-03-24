import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  useTheme,
  Box,
  Stack,
  Paper,
  Divider,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getExamBySession, updateStudentMarkAction } from "../../features/exam/examAction";

const FetchMarksStudents = ({ exam }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { id } = useParams();

  const loadingUpdateMark = useSelector((s) => s.exam?.loadingUpdateMark);
  const errorUpdateMark = useSelector((s) => s.exam?.errorUpdateMark);

  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempMark, setTempMark] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [snack, setSnack] = useState({ open: false, type: "success", msg: "" });

  // ✅ Fetch exam
  useEffect(() => {
    dispatch(getExamBySession(id));
  }, [dispatch, id]);

  // ✅ Map exam -> students list
  useEffect(() => {
    // ⚠️ الباك عندك اسمه exam.studentId (array)
    // لكن انت في UI كنت بتستخدم exam.students
    // هنا هنمشي على نفس الباك: studentId
    const src = exam?.studentId || exam?.students || [];

    const formatted = src
      .map((s) => ({
        id: s.studentId?._id,
        name: s.studentId?.name || "—",
        mark: s.mark ?? 0,
        status: s.status,
      }))
      .sort((a, b) => (b.mark ?? 0) - (a.mark ?? 0));

    setStudents(formatted);
  }, [exam]);

  // ✅ Filtered students
  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return students;
    return students.filter((s) => (s.name || "").toLowerCase().includes(term));
  }, [students, searchTerm]);

  const handleEdit = (student) => {
    setEditingId(student.id);
    setTempMark(String(student.mark ?? 0));
  };

  const getMarkColorAndIcon = (mark, status) => {
    if (status === "absent") {
      return { color: "default", icon: <BlockIcon fontSize="small" /> };
    }
    const total = exam?.totalMark ?? 0;
    const percentage = total ? (mark / total) * 100 : 0;

    if (percentage >= 85) return { color: "success", icon: <CheckCircleIcon fontSize="small" /> };
    if (percentage >= 50) return { color: "warning", icon: <WarningIcon fontSize="small" /> };
    return { color: "error", icon: <CancelIcon fontSize="small" /> };
  };

  const handleSave = async (studentId) => {
    const markNum = Number(tempMark);
    const total = Number(exam?.totalMark ?? 0);

    // ✅ validations
    if (Number.isNaN(markNum)) {
      setSnack({ open: true, type: "error", msg: t("examView.invalidNumber") || "رقم غير صالح" });
      return;
    }
    if (markNum < 0) {
      setSnack({ open: true, type: "error", msg: t("examView.markMustBePositive") || "الدرجة لا يمكن أن تكون أقل من 0" });
      return;
    }
    if (total && markNum > total) {
      setSnack({
        open: true,
        type: "error",
        msg: t("examView.invalidMark", { total }) || `الدرجة لا يمكن أن تتجاوز ${total}`,
      });
      return;
    }

    try {
      // ✅ call backend
      await dispatch(
        updateStudentMarkAction({
          examId: exam?._id,
          studentId,
          mark: markNum,
        })
      ).unwrap();

      // ✅ optimistic update + re-sort
      setStudents((prev) =>
        prev
          .map((s) => (s.id === studentId ? { ...s, mark: markNum } : s))
          .sort((a, b) => (b.mark ?? 0) - (a.mark ?? 0))
      );

      setEditingId(null);
      setSnack({ open: true, type: "success", msg: t("examView.updatedSuccessfully") || "✅ تم تعديل الدرجة بنجاح" });
    } catch (e) {
      setSnack({ open: true, type: "error", msg: typeof e === "string" ? e : "فشل تعديل الدرجة" });
    }
  };

  const closeSnack = () => setSnack((p) => ({ ...p, open: false }));

  return (
    <Box sx={{ boxShadow: 5, mb: 2 }}>
      <Snackbar open={snack.open} autoHideDuration={2500} onClose={closeSnack} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={closeSnack} severity={snack.type} variant="filled" sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>

      {exam && (
        <Accordion
          defaultExpanded
          sx={{
            bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100],
            borderRadius: 2,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t("examView.titleWithTotal", {
                title: exam?.title ?? "",
                total: exam?.totalMark ?? 0,
              })}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {/* errors from store */}
            {!!errorUpdateMark && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorUpdateMark}
              </Alert>
            )}

            {/* Search */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1, flexWrap: "wrap" }}>
              <TextField
                label={t("examView.searchStudent") || "بحث عن طالب"}
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>

            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", px: 1, py: 1, mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, minWidth: 160 }}>
                {t("examView.studentName") || "اسم الطالب"}
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t("examView.examMark") || "الدرجة"}
              </Typography>

              <Box sx={{ width: 120 }} />
            </Box>
            <Divider sx={{ mb: 1 }} />

            {/* List */}
            <Stack spacing={1}>
              {filteredStudents.map((student) => {
                const { color, icon } = getMarkColorAndIcon(student.mark, student.status);
                const total = Number(exam?.totalMark ?? 0);
                const markNum = Number(tempMark);

                const invalid =
                  editingId === student.id &&
                  (Number.isNaN(markNum) || markNum < 0 || (total && markNum > total));

                return (
                  <Paper
                    key={student.id}
                    elevation={2}
                    sx={{
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
                      transition: "0.2s",
                      "&:hover": { transform: "translateY(-1px)" },
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ minWidth: 160 }}>
                      {student.name}
                    </Typography>

                    {editingId === student.id ? (
                      <TextField
                        type="number"
                        size="small"
                        value={tempMark}
                        onChange={(e) => setTempMark(e.target.value)}
                        sx={{ width: 140, mx: 1 }}
                        error={invalid}
                        helperText={
                          invalid
                            ? total
                              ? (t("examView.invalidMark", { total }) || `الدرجة من 0 إلى ${total}`)
                              : (t("examView.invalidNumber") || "رقم غير صالح")
                            : " "
                        }
                      />
                    ) : (
                      <Chip label={student.mark} color={color} icon={icon} sx={{ mx: 1, px: 1 }} />
                    )}

                    {editingId === student.id ? (
                      <Tooltip title={invalid ? (t("examView.fixMark") || "عدّل الدرجة أولاً") : ""}>
                        <span>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={
                              loadingUpdateMark ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />
                            }
                            disabled={invalid || loadingUpdateMark}
                            onClick={() => handleSave(student.id)}
                          >
                            {loadingUpdateMark ? (t("examView.saving") || "جاري الحفظ") : (t("examView.save") || "حفظ")}
                          </Button>
                        </span>
                      </Tooltip>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(student)}
                      >
                        {t("examView.edit") || "تعديل"}
                      </Button>
                    )}
                  </Paper>
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default FetchMarksStudents;