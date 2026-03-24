import React, { useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Paper,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import GroupsIcon from "@mui/icons-material/Groups";
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PaidIcon from "@mui/icons-material/Paid";
import TodayIcon from "@mui/icons-material/Today";

import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { fetchDashboardSummary } from "../features/dashboard/dashboardActions";
import { clearDashboardError, selectDashboard } from "../features/dashboard/dashboardSlice";

function StatCard({ icon, title, value, subtitle, colorKey = "primary" }) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette[colorKey].main, 0.25)}`,
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette[colorKey].main, 0.08)
            : alpha(theme.palette[colorKey].main, 0.06),
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: alpha(theme.palette[colorKey].main, theme.palette.mode === "dark" ? 0.18 : 0.12),
            color: theme.palette[colorKey].main,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
            {value}
          </Typography>
          {subtitle ? (
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </Paper>
  );
}

function SimpleTable({ title, rows, columns, emptyText }) {
  const theme = useTheme();

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}` }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
        <Chip size="small" label={rows?.length || 0} />
      </Stack>

      <Divider sx={{ my: 1.5 }} />

      {(!rows || rows.length === 0) ? (
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          {emptyText}
        </Typography>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box component="thead">
              <Box component="tr">
                {columns.map((c) => (
                  <Box
                    key={c.key}
                    component="th"
                    style={{ textAlign: "start" }}
                    sx={{
                      py: 1,
                      fontSize: 12,
                      opacity: 0.75,
                      borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.label}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box component="tbody">
              {rows.map((r, idx) => (
                <Box
                  key={idx}
                  component="tr"
                  sx={{
                    "& td": {
                      py: 1,
                      borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  {columns.map((c) => (
                    <Box key={c.key} component="td" sx={{ pr: 2 }}>
                      {c.render ? c.render(r) : r?.[c.key]}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { summary, loading, error } = useSelector(selectDashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const isAr = i18n.language?.startsWith("ar");

  const s = summary?.students;
  const g = summary?.groups;
  const se = summary?.sessions;
  const att = summary?.attendance;
  const money = summary?.money;

  const attendancePercent = useMemo(() => {
    const rate = att?.rateThisWeek ?? 0;
    return Math.round(rate * 100);
  }, [att]);

  const topStudents = summary?.groups?.topByStudents || [];
  const topAttendance = summary?.topGroups?.byAttendance || [];
  const topRevenue = summary?.topGroups?.byRevenue || [];
  const risk = summary?.studentsAtRisk || [];

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {t("dashboard.title")}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              {t("dashboard.subtitle")}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title={t("dashboard.refresh")}>
              <span>
                <IconButton
                  onClick={() => dispatch(fetchDashboardSummary())}
                  disabled={loading}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>

            <Button
              variant="contained"
              onClick={() => dispatch(fetchDashboardSummary())}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} /> : <RefreshIcon />}
              sx={{ fontWeight: 900 }}
            >
              {t("dashboard.refresh")}
            </Button>
          </Stack>
        </Stack>

        {error ? (
          <Alert
            severity="error"
            onClose={() => dispatch(clearDashboardError())}
            sx={{ mb: 2 }}
          >
            {typeof error === "string" ? error : t("common.error")}
          </Alert>
        ) : null}

        {loading && !summary ? (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress />
              <Typography sx={{ fontWeight: 800 }}>{t("common.loading")}</Typography>
            </Stack>
          </Paper>
        ) : null}

        {summary ? (
          <>
            {/* ===== Stats Cards ===== */}
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item  size={{ xs: 2, sm: 4, md: 4 }}>
                <StatCard
                  icon={<PeopleIcon />}
                  title={t("dashboard.totalStudents")}
                  value={s?.total ?? 0}
                  subtitle={`${t("dashboard.new7d")}: ${s?.new7d ?? 0} • ${t("dashboard.new30d")}: ${s?.new30d ?? 0}`}
                  colorKey="primary"
                />
              </Grid>

              <Grid item  size={{ xs: 2, sm: 4, md: 4 }}>
                <StatCard
                  icon={<GroupsIcon />}
                  title={t("dashboard.totalGroups")}
                  value={g?.total ?? 0}
                  subtitle={t("dashboard.groupsHint")}
                  colorKey="secondary"
                />
              </Grid>

              <Grid item  size={{ xs: 2, sm: 4, md: 4 }}>
                <StatCard
                  icon={<TodayIcon />}
                  title={t("dashboard.sessionsToday")}
                  value={se?.today ?? 0}
                  subtitle={`${t("dashboard.sessionsThisWeek")}: ${se?.thisWeek ?? 0}`}
                  colorKey="info"
                />
              </Grid>

              <Grid item  size={{ xs: 2, sm: 4, md: 4 }}>
                <StatCard
                  icon={<EventAvailableIcon />}
                  title={t("dashboard.attendanceThisWeek")}
                  value={`${attendancePercent}%`}
                  subtitle={`${t("dashboard.present")}: ${att?.presentThisWeek ?? 0} • ${t("dashboard.absent")}: ${att?.absentThisWeek ?? 0}`}
                  colorKey="success"
                />
              </Grid>

              <Grid item  size={{ xs: 2, sm: 4, md: 4 }}>
                <StatCard
                  icon={<TrendingUpIcon />}
                  title={t("dashboard.teacherRevenueThisMonth")}
                  value={money?.teacherRevenueThisMonth ?? 0}
                  subtitle={t("dashboard.currency")}
                  colorKey="success"
                />
              </Grid>

              <Grid item  size={{ xs: 2, sm: 4, md: 4 }}>
                <StatCard
                  icon={<PaidIcon />}
                  title={t("dashboard.teacherRevenueToday")}
                  value={money?.teacherRevenueToday ?? 0}
                  subtitle={t("dashboard.currency")}
                  colorKey="info"
                />
              </Grid>

              <Grid item  size={{ xs: 2, sm: 4, md: 4 }}>
                <StatCard
                  icon={<WarningAmberIcon />}
                  title={t("dashboard.unpaidThisMonth")}
                  value={money?.unpaidThisMonth ?? 0}
                  subtitle={t("dashboard.unpaidHint")}
                  colorKey="warning"
                />
              </Grid>
            </Grid>

            {/* ===== Tables ===== */}
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item size={{ xs: 2, sm: 4, md: 4 }} >
                <SimpleTable
                  title={t("dashboard.topGroupsByStudents")}
                  rows={topStudents}
                  emptyText={t("dashboard.empty")}
                  columns={[
                    { key: "name", label: t("dashboard.group") },
                    { key: "grade", label: t("dashboard.grade") },
                    { key: "day", label: t("dashboard.day") },
                    { key: "time", label: t("dashboard.time") },
                    { key: "studentsCount", label: t("dashboard.students") },
                  ]}
                />
              </Grid>

              <Grid item size={{ xs: 2, sm: 4, md: 4 }} >
                <SimpleTable
                  title={t("dashboard.topGroupsByAttendance")}
                  rows={topAttendance}
                  emptyText={t("dashboard.empty")}
                  columns={[
                    { key: "name", label: t("dashboard.group") },
                    { key: "grade", label: t("dashboard.grade") },
                    { key: "sessionsCount", label: t("dashboard.sessions") },
                    { key: "totalPresent", label: t("dashboard.present") },
                  ]}
                />
              </Grid>

              <Grid item size={{ xs: 2, sm: 4, md: 4 }} >
                <SimpleTable
                  title={t("dashboard.topGroupsByRevenue")}
                  rows={topRevenue}
                  emptyText={t("dashboard.empty")}
                  columns={[
                    { key: "name", label: t("dashboard.group") },
                    { key: "grade", label: t("dashboard.grade") },
                    { key: "sessionsCount", label: t("dashboard.sessions") },
                    { key: "teacherRevenue", label: t("dashboard.revenue") },
                  ]}
                />
              </Grid>

              <Grid item size={{ xs: 2, sm: 4, md: 4 }} >
                <SimpleTable
                  title={t("dashboard.studentsAtRisk")}
                  rows={risk}
                  emptyText={t("dashboard.noRisk")}
                  columns={[
                    {
                      key: "name",
                      label: t("dashboard.student"),
                      render: (r) => (
                        <Stack spacing={0.2}>
                          <Typography sx={{ fontWeight: 800, fontSize: 13 }}>{r?.name}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.75 }}>
                            {r?.phone}
                          </Typography>
                        </Stack>
                      ),
                    },
                    { key: "grade", label: t("dashboard.grade") },
                    { key: "absentCount30d", label: t("dashboard.absent30d") },
                    { key: "unpaid30d", label: t("dashboard.unpaid30d") },
                  ]}
                />
              </Grid>
            </Grid>
          </>
        ) : null}
      </Container>
    </Box>
  );
}