import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Container,
    Paper,
    Typography,
    Stack,
    Divider,
    Chip,
    IconButton,
    Button,
    Grid,
    Skeleton,
    Alert,
    Tooltip,
    Avatar,
    useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PhoneIcon from "@mui/icons-material/Phone";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import PaidIcon from "@mui/icons-material/Paid";
import PersonIcon from "@mui/icons-material/Person";
import ReplayIcon from "@mui/icons-material/Replay";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Tabs,
    Tab,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";

import LaunchIcon from "@mui/icons-material/Launch";
import { makeStateIsEmpityStudent } from "../features/students/studentSlice";
import { fetchStudentDetails } from "../features/students/studentAction";
import SendReportToParentBtn from "../components/students/SendReportToParentBtn";
 

 import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
// optional: لو عندك format utils
// import { formatDay, formatTo12Hour } from "../utils/formatTimeAndData/format";

function InfoRow({ icon, label, value, actions }) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ gap: 2, py: 1 }}
        >
            <Stack direction="row" alignItems="center" sx={{ gap: 1.5, minWidth: 0 }}>
                <Avatar sx={{ width: 34, height: 34 }}>{icon}</Avatar>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">
                        {label}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                        {value ?? "—"}
                    </Typography>
                </Box>
            </Stack>

            {actions ? <Stack direction="row" sx={{ gap: 0.5 }}>{actions}</Stack> : null}
        </Stack>
    );
}

function CardShell({ title, icon, children, right }) {
    const theme = useTheme();
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                backgroundImage:
                    theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
                        : "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.00))",
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                    <Avatar sx={{ width: 38, height: 38 }}>{icon}</Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        {title}
                    </Typography>
                </Stack>
                {right}
            </Stack>
            <Divider sx={{ mb: 1.5 }} />
            {children}
        </Paper>
    );
}

export default function StudentDetailsPage() {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const isAr = i18n.language?.toLowerCase()?.startsWith("ar");
    const [tab, setTab] = useState(0); // 0 sessions, 1 exams
    const [attFilter, setAttFilter] = useState("all"); // all | present | absent
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { student, loading, error } = useSelector((s) => s.student);

    const [copiedKey, setCopiedKey] = useState(null);

    useEffect(() => {
        dispatch(fetchStudentDetails(id));
        return () => dispatch(makeStateIsEmpityStudent());
    }, [dispatch, id]);

    const headerTitle = student?.name || t("studentDetails");

    const gradeChip = useMemo(() => {
        const g = student?.grade;
        if (!g) return null;
        const map = { "1st": "1", "2nd": "2", "3rd": "3" };
        return (
            <Chip
                icon={<SchoolIcon />}
                label={`${t("grade")}: ${map[g] || g}`}
                sx={{ fontWeight: 900, px: 2 }}
                variant="outlined"
            />
        );
    }, [student?.grade, t]);

    const copy = async (text, key) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 1200);
        } catch (_) { }
    };

    const skeletonBlock = (
        <Stack sx={{ gap: 1.2 }}>
            <Skeleton height={34} />
            <Skeleton height={34} />
            <Skeleton height={34} />
            <Skeleton height={34} />
            <Skeleton height={34} />
        </Stack>
    );

    return (
<Box
  sx={{
    minHeight: "100vh",
    py: { xs: 2, md: 4 },
    direction: isAr ? "rtl" : "ltr",
    background: (theme) =>
      theme.palette.mode === "dark"
        ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
        : `linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)`,
  }}
>
  <Container maxWidth="xl">
    {/* Top Hero Header */}
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        mb: 3,
        borderRadius: 5,
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(135deg, rgba(34,40,49,0.95) 0%, rgba(24,28,36,0.96) 100%)`
            : `linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(245,249,255,0.98) 100%)`,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.28)"
            : "0 10px 30px rgba(31, 78, 121, 0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          insetInlineEnd: -50,
          top: -50,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(76,175,80,0.18) 0%, rgba(76,175,80,0) 70%)"
              : "radial-gradient(circle, rgba(76,175,80,0.16) 0%, rgba(76,175,80,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <Stack
        direction={{ xs: "column", lg: "row" }}
        alignItems={{ xs: "flex-start", lg: "center" }}
        justifyContent="space-between"
        spacing={2.5}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <IconButton
              onClick={() => navigate(-1)}
              aria-label="back"
              sx={{
                marginX: "5px",
           
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.85)",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,1)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Avatar
              sx={{
                marginX: 2,
                width: 58,
                height: 58,
                fontWeight: 900,
                fontSize: 22,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 8px 20px rgba(0,0,0,0.35)"
                    : "0 8px 20px rgba(25,118,210,0.22)",
              }}
            >
              {student?.name?.charAt(0)?.toUpperCase() || "S"}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 1000,
                  lineHeight: 1.1,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                {headerTitle}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 0.7, fontWeight: 500 }}
              >
                {t("students.studentDetails")}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            alignItems="center"
          >
            {gradeChip}

            <Chip
              icon={<GroupsIcon />}
              label={
                student?.groupId
                  ? t("students.currentGroup")
                  : t("students.noGroup")
              }
              color={student?.groupId ? "success" : "default"}
              variant={student?.groupId ? "filled" : "outlined"}
              sx={{
                fontWeight: 800,
                px: 1,
                borderRadius: 999,
              }}
            />

            <Chip
              icon={<PaidIcon />}
              label={`${t("students.payment")}: ${student?.payment ?? "—"}`}
              variant="outlined"
              sx={{
                fontWeight: 800,
                px: 1,
                borderRadius: 999,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.7)",
              }}
            />
          </Stack>
        </Stack>

        <Box
          sx={{
            width: { xs: "100%", lg: "auto" },
            display: "flex",
            justifyContent: { xs: "stretch", lg: "flex-end" },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "fit-content" },
              p: 1,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(255,255,255,0.7)",
            }}
          >
            <SendReportToParentBtn studentId={student?._id} />
          </Box>
        </Box>
      </Stack>

      {error ? (
        <Alert
          severity="error"
          sx={{
            mt: 2.5,
            borderRadius: 3,
          }}
          action={
            <Button
              size="small"
              startIcon={<ReplayIcon />}
              onClick={() => dispatch(fetchStudentDetails(id))}
              sx={{ fontWeight: 700 }}
            >
              {t("students.retry")}
            </Button>
          }
        >
          {error}
        </Alert>
      ) : null}
    </Paper>

    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>
      {/* Basic Info */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            height: "100%",
            p: 2.2,
            borderRadius: 5,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 24px rgba(0,0,0,0.22)"
                : "0 8px 24px rgba(15, 23, 42, 0.05)",
          }}
        >
          <CardShell
            title={t("students.basicInfo")}
            icon={<PersonIcon />}
            right={null}
          >
            {loading ? (
              skeletonBlock
            ) : !student ? (
              <Alert severity="info" sx={{ borderRadius: 3 }}>
                {t("students.notFound")}
              </Alert>
            ) : (
              <Stack divider={<Divider flexItem />} sx={{ gap: 0.8 }}>
                <InfoRow
                  icon={<PersonIcon fontSize="small" />}
                  label={t("students.name")}
                  value={student?.name}
                />

                <InfoRow
                  icon={<PhoneIcon fontSize="small" />}
                  label={t("students.phone")}
                  value={student?.phone}
                  actions={[
                    <Tooltip key="copyPhone" title={t("students.copyPhone")}>
                      <IconButton
                        onClick={() => copy(student?.phone, "phone")}
                        sx={{ borderRadius: 2 }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>,
                    copiedKey === "phone" ? (
                      <Chip
                        key="copied1"
                        size="small"
                        label={t("students.copied")}
                        color="success"
                        variant="soft"
                      />
                    ) : null,
                  ]}
                />

                <InfoRow
                  icon={<PhoneIcon fontSize="small" />}
                  label={t("students.parentPhone")}
                  value={student?.parentPhone}
                  actions={[
                    <Tooltip key="copyParent" title={t("students.copyParentPhone")}>
                      <IconButton
                        onClick={() => copy(student?.parentPhone, "parentPhone")}
                        sx={{ borderRadius: 2 }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>,
                    copiedKey === "parentPhone" ? (
                      <Chip
                        key="copied2"
                        size="small"
                        label={t("students.copied")}
                        color="success"
                      />
                    ) : null,
                  ]}
                />

                <InfoRow
                  icon={<SchoolIcon fontSize="small" />}
                  label={t("students.grade")}
                  value={t(`students.gradeFilter.grades.${student?.grade}`)}
                />
              </Stack>
            )}
          </CardShell>
        </Paper>
      </Grid>

      {/* Current Group */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            height: "100%",
            p: 2.2,
            borderRadius: 5,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 24px rgba(0,0,0,0.22)"
                : "0 8px 24px rgba(15, 23, 42, 0.05)",
          }}
        >
          <CardShell title={t("students.currentGroup")} icon={<GroupsIcon />}>
            {loading ? (
              skeletonBlock
            ) : !student ? (
              <Alert severity="info" sx={{ borderRadius: 3 }}>
                {t("students.notFound")}
              </Alert>
            ) : !student?.groupId ? (
              <Alert severity="warning" sx={{ borderRadius: 3 }}>
                {t("students.noGroup")}
              </Alert>
            ) : (
              <Stack divider={<Divider flexItem />} sx={{ gap: 0.8 }}>
                <InfoRow
                  icon={<GroupsIcon fontSize="small" />}
                  label={t("students.place")}
                  value={student.groupId?.place}
                />
                <InfoRow
                  icon={<SchoolIcon fontSize="small" />}
                  label={t("students.grade")}
                  value={student.groupId?.grade}
                />
                <InfoRow
                  icon={<PaidIcon fontSize="small" />}
                  label={t("students.price")}
                  value={student.groupId?.price}
                />
                <InfoRow
                  icon={<CalendarTodayIcon fontSize="small" />}
                  label={t("students.day")}
                  value={student.groupId?.day}
                />
                <InfoRow
                  icon={<AccessTimeIcon fontSize="small" />}
                  label={t("students.time")}
                  value={student.groupId?.time}
                />

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  sx={{ pt: 1.5, gap: 1.2 }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      fontWeight: 900,
                      borderRadius: 3,
                      py: 1.1,
                    }}
                    onClick={() => navigate(`/GroupDetails/${student.groupId?._id}`)}
                  >
                    {isAr ? "عرض المجموعة" : "Open Group"}
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      fontWeight: 900,
                      borderRadius: 3,
                      py: 1.1,
                    }}
                    onClick={() => navigate(`/students`)}
                  >
                    {t("back")}
                  </Button>
                </Stack>
              </Stack>
            )}
          </CardShell>
        </Paper>
      </Grid>

      {/* Previous Groups */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            height: "100%",
            p: 2.2,
            borderRadius: 5,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 24px rgba(0,0,0,0.22)"
                : "0 8px 24px rgba(15, 23, 42, 0.05)",
          }}
        >
          <CardShell title={t("students.previousGroups")} icon={<GroupsIcon />}>
            {loading ? (
              <Stack sx={{ gap: 1 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} height={58} sx={{ borderRadius: 3 }} />
                ))}
              </Stack>
            ) : !student ? (
              <Alert severity="info" sx={{ borderRadius: 3 }}>
                {t("students.notFound")}
              </Alert>
            ) : (student?.previousGroupIds?.length || 0) === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 3 }}>
                {isAr ? "لا يوجد مجموعات سابقة" : "No previous groups"}
              </Alert>
            ) : (
              <Stack sx={{ gap: 1.2 }}>
                {student.previousGroupIds.map((g) => (
                  <Paper
                    key={g?._id}
                    variant="outlined"
                    sx={{
                      p: 1.6,
                      borderRadius: 3.5,
                      transition: "0.2s ease",
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(248,250,252,0.9)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 8px 20px rgba(0,0,0,0.25)"
                            : "0 8px 20px rgba(15,23,42,0.07)",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Stack sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 900 }} noWrap>
                          {g?.place || (isAr ? "مجموعة" : "Group")}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" noWrap>
                          {`${t("day")}: ${g?.day ?? "—"} • ${t("time")}: ${
                            g?.time ?? "—"
                          }`}
                        </Typography>
                      </Stack>

                      <Button
                        size="small"
                        variant="text"
                        sx={{ fontWeight: 900, borderRadius: 2 }}
                        onClick={() => navigate(`/GroupDetails/${g?._id}`)}
                      >
                        {isAr ? "فتح" : "Open"}
                      </Button>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </CardShell>
        </Paper>
      </Grid>

      {/* Sessions + Exams */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            height: "100%",
            p: 2.2,
            borderRadius: 5,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 24px rgba(0,0,0,0.22)"
                : "0 8px 24px rgba(15, 23, 42, 0.05)",
          }}
        >
          <CardShell
            title={`${t("students.sessions")} • ${t("students.exams")}`}
            icon={<SchoolIcon />}
            right={
              <Chip
                label={`${student?.sessionIds?.length || 0} ${t("students.sessions")} • ${
                  student?.examsIds?.length || 0
                } ${t("students.exams")}`}
                sx={{ fontWeight: 900, borderRadius: 999 }}
                variant="outlined"
              />
            }
          >
            {loading ? (
              <Stack sx={{ gap: 1 }}>
                <Skeleton height={50} sx={{ borderRadius: 3 }} />
                <Skeleton height={50} sx={{ borderRadius: 3 }} />
                <Skeleton height={50} sx={{ borderRadius: 3 }} />
              </Stack>
            ) : !student ? (
              <Alert severity="info" sx={{ borderRadius: 3 }}>
                {t("notFound")}
              </Alert>
            ) : (
              <StudentSessionsExamsPanel
                student={student}
                isAr={isAr}
                t={t}
                tab={tab}
                setTab={setTab}
                attFilter={attFilter}
                setAttFilter={setAttFilter}
                navigate={navigate}
              />
            )}
          </CardShell>
        </Paper>
      </Grid>
    </Grid>
  </Container>
</Box>
    );
}
function StudentSessionsExamsPanel({
    student,
    isAr,
    t,
    tab,
    setTab,
    attFilter,
    setAttFilter,
    navigate,
}) {
    const sid = String(student?._id);

    // ===== Helpers =====
    const getSessionStatus = (s) => {
        const a = s?.attendance?.find((x) => String(x.studentId) === sid);
        return a?.status || "absent";
    };

    const getStudentMetaFromSession = (s) => {
        const p = s?.presentStudents?.find((x) => String(x.studentId) === sid);
        const a = s?.absentStudents?.find((x) => String(x.studentId) === sid);
        const meta = p || a || null;
        return {
            paid: meta?.payment ?? 0,
            note: meta?.note || "",
        };
    };

    const fmtDate = (d) =>
        d
            ? new Date(d).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
            })
            : "—";

    // ===== Sessions list (filtered) =====
    const allSessions = Array.isArray(student?.sessionIds) ? student.sessionIds : [];
    const sessionsSorted = [...allSessions].sort(
        (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
    );

    const sessionsFiltered = sessionsSorted.filter((s) => {
        const st = getSessionStatus(s);
        if (attFilter === "present") return st === "present";
        if (attFilter === "absent") return st === "absent";
        return true;
    });

    const totalPaid = sessionsSorted.reduce((sum, s) => {
        const { paid } = getStudentMetaFromSession(s);
        return sum + (Number(paid) || 0);
    }, 0);

    // ===== Exams list =====
    const allExams = Array.isArray(student?.examsIds) ? student.examsIds : [];
    const examsSorted = [...allExams].sort(
        (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
    );

    const getExamMark = (ex) => {
        // exam.studentId: [{ studentId, mark }]
        const rec = ex?.studentId?.find((x) => String(x.studentId) === sid);
        return typeof rec?.mark === "number" ? rec.mark : null;
    };

    return (
        <Stack sx={{ gap: 1.5 }}>
            {/* Tabs Header */}
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="fullWidth"
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    "& .MuiTab-root": { fontWeight: 900 },
                }}
            >
                <Tab label={t("students.sessions")} />
                <Tab label={t("students.exams")} />
            </Tabs>

            {tab === 0 ? (
                // ===================== Sessions Tab =====================
                <Stack sx={{ gap: 1.2 }}>
                    {/* Top tools */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "stretch", sm: "center" }}
                        justifyContent="space-between"
                        sx={{ gap: 1 }}
                    >
                        <ToggleButtonGroup
                            exclusive
                            value={attFilter}
                            onChange={(_, v) => v && setAttFilter(v)}
                            size="small"
                        >
                            <ToggleButton value="all" sx={{ fontWeight: 900 }}>
                                {t("students.all")}
                            </ToggleButton>
                            <ToggleButton value="present" sx={{ fontWeight: 900 }}>
                                {t("students.presentOnly")}
                            </ToggleButton>
                            <ToggleButton value="absent" sx={{ fontWeight: 900 }}>
                                {t("students.absentOnly")}
                            </ToggleButton>
                        </ToggleButtonGroup>


                    </Stack>

                    {sessionsFiltered.length === 0 ? (
                        <Alert severity="info">{t("students.noSessions")}</Alert>
                    ) : (
                        <Stack sx={{ gap: 1 }}>
                            {sessionsFiltered.slice(0, 8).map((s) => {
                                const status = getSessionStatus(s);
                                const { paid, note } = getStudentMetaFromSession(s);

                                return (
                                    <Paper key={s?._id} variant="outlined" sx={{ p: 1.25, borderRadius: 3 }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
                                            <Stack sx={{ minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 900 }} noWrap>
                                                    {s?.place || (isAr ? "حصة" : "Session")} • {fmtDate(s?.createdAt)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {isAr ? "سعر الحصة" : "Session price"}: {s?.sessionPrice ?? "—"} •{" "}
                                                    {isAr ? "دفع" : "Paid"}: {paid}
                                                </Typography>
                                            </Stack>

                                            <Stack direction="row" alignItems="center" sx={{ gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
                                                <Chip
                                                    label={status === "present" ? (isAr ? "حاضر" : "Present") : (isAr ? "غايب" : "Absent")}
                                                    color={status === "present" ? "success" : "error"}
                                                    size="small"
                                                    sx={{ fontWeight: 900 }}
                                                />

                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    endIcon={<LaunchIcon />}
                                                    sx={{ fontWeight: 900, borderRadius: 3 }}
                                                    onClick={() => navigate(`/session/${s?._id}`)}
                                                >
                                                    {t("students.openSession")}
                                                </Button>
                                            </Stack>
                                        </Stack>

                                        {note ? (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                <b>{isAr ? "ملاحظة:" : "Note:"}</b> {note}
                                            </Typography>
                                        ) : null}
                                    </Paper>
                                );
                            })}

                            {sessionsFiltered.length > 8 ? (
                                <Typography variant="caption" color="text.secondary">
                                    {isAr ? "تم عرض آخر 8 حصص فقط." : "Showing latest 8 sessions only."}
                                </Typography>
                            ) : null}
                        </Stack>
                    )}
                </Stack>
            ) : (
                // ===================== Exams Tab =====================
                <Stack sx={{ gap: 1.2 }}>
                    {examsSorted.length === 0 ? (
                        <Alert severity="info">{t("students.noExams")}</Alert>
                    ) : (
                        <Stack sx={{ gap: 1 }}>
                            {examsSorted.slice(0, 8).map((ex) => {
                                const total = ex?.totalMark ?? 0;
                                const mark = getExamMark(ex);
                                const pct =
                                    typeof mark === "number" && total > 0 ? Math.round((mark / total) * 100) : null;

                                return (
                                    <Paper key={ex?._id} variant="outlined" sx={{ p: 1.25, borderRadius: 3 }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
                                            <Stack sx={{ minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 900 }} noWrap>
                                                    {ex?.title || (isAr ? "امتحان" : "Exam")} • {fmtDate(ex?.createdAt)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {isAr ? "الدرجة الكلية" : "Total"}: {total}

                                                    {ex?.sessionId && (
                                                        <>
                                                            {" • "}
                                                            <Typography
                                                                component="span"
                                                                onClick={() => navigate(`/session/${ex.sessionId}`)}
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    fontWeight: 700,
                                                                    color: "primary.main",
                                                                    textDecoration: "underline",
                                                                    "&:hover": {
                                                                        opacity: 0.8,
                                                                    },
                                                                }}
                                                            >
                                                                {isAr ? "مرتبط بحصة" : "Linked to session"}
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Typography>

                                            </Stack>

                                            <Stack direction="row" alignItems="center" sx={{ gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
                                                <Chip
                                                    label={
                                                        typeof mark === "number"
                                                            ? `${isAr ? "درجة" : "Mark"}: ${mark}/${total}`
                                                            : t("students.notGraded")
                                                    }
                                                    color={typeof mark === "number" ? "success" : "default"}
                                                    size="small"
                                                    sx={{ fontWeight: 900 }}
                                                    variant={typeof mark === "number" ? "filled" : "outlined"}
                                                />
                                                {pct !== null ? (
                                                    <Chip label={`${pct}%`} size="small" variant="outlined" sx={{ fontWeight: 900 }} />
                                                ) : null}
                                            </Stack>
                                        </Stack>
                                    </Paper>
                                );
                            })}

                            {examsSorted.length > 8 ? (
                                <Typography variant="caption" color="text.secondary">
                                    {isAr ? "تم عرض آخر 8 امتحانات فقط." : "Showing latest 8 exams only."}
                                </Typography>
                            ) : null}
                        </Stack>
                    )}
                </Stack>
            )}
        </Stack>
    );
}