import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  useTheme,
  Tooltip,
  Badge,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getSessionsByGroup } from '../../../features/session/sessionAction';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import SessionsTableSkeleton from './SessionsTableSkeleton';
import { useTranslation } from "react-i18next";

export default function FetchSessionAtGroup() {
  const { t } = useTranslation();
  // 🎨 Access the current theme colors (supports Dark / Light mode)
  const theme = useTheme();

  // 📌 Get the group ID from the URL parameters
  const { id } = useParams();

  // 🧠 Redux dispatch function
  const dispatch = useDispatch();

  // 📦 Select session-related state from Redux store
  const {
    loadingSessionByGroupByGroup,   // Loading state while fetching sessions
    errorGetSessionByGroup,         // Backend/server error
    errorGetSessionByGroupNetWork,  // Network error (no internet / server down)
    sessionsByOneGroup,             // Sessions belonging to the selected group
    lengthSessionsByOneGroup        // Total number of sessions
  } = useSelector((state) => state.session);

  // 🚀 Fetch data when the component mounts
  useEffect(() => {
    dispatch(getSessionsByGroup(id));
  }, [dispatch, id]);
  return (
    <Box sx={{ p: 3 }}>

      {/* ========================= */}
      {/* Loading State */}
      {/* ========================= */}
      {loadingSessionByGroupByGroup && <SessionsTableSkeleton rows={6} />}


      {/* ========================= */}
      {/* Backend Error */}
      {/* ========================= */}
      {errorGetSessionByGroup && (
        <Alert severity="error">
          {errorGetSessionByGroup || 'Something went wrong while fetching sessions'}
        </Alert>
      )}

      {/* ========================= */}
      {/* Empty State (No Sessions) */}
      {/* ========================= */}
      {!sessionsByOneGroup || sessionsByOneGroup.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: theme.palette.background.paper,
            border: `1px dashed ${theme.palette.divider}`,
          }}
        >
          {/* Empty icon */}
          <EventBusyIcon
            sx={{
              fontSize: 60,
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          />



          {/* Empty state description */}
          <Typography variant="body2" color="text.secondary">
            {t("sessions.noSessions.title")}
            <br />
            {t("sessions.noSessions.subtitle")}
          </Typography>
        </Paper>
      ) : (
        <>
          {/* ========================= */}
          {/* Page Title + Badge */}
          {/* ========================= */}
          <Typography variant="h5" gutterBottom>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Sessions count badge */}
              <Badge
                badgeContent={lengthSessionsByOneGroup}
                color="primary"
                overlap="circular"
              >
                <EventNoteIcon fontSize="large" />
              </Badge>

              {t("sessions.subtitle")}

            </Box>
          </Typography>

          {/* ========================= */}
          {/* Attendance Legend */}
          {/* ========================= */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: theme.palette.success.main,
                borderRadius: '4px',
              }}
            />
            <Typography variant="body2">{t("sessions.addSession.fields.Present")}</Typography>

            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: theme.palette.error.main,
                borderRadius: '4px',
              }}
            />
            <Typography variant="body2">{t("sessions.addSession.fields.Absent")}</Typography>
          </Box>

          {/* ========================= */}
          {/* Sessions Table */}
          {/* ========================= */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <TableContainer
              component={Paper}
              sx={{
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                overflowX: "auto",
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead
                  sx={{
                    bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200],
                  }}
                >
                  <TableRow>
                    <TableCell sx={{textAlign:"center"}}><strong> {t("sessions.addSession.fields.discription")} </strong></TableCell>
                    <TableCell><strong>{t("sessions.addSession.fields.date")}</strong></TableCell>
                    <TableCell><strong>{t("sessions.addSession.fields.place")}</strong></TableCell>
                    <TableCell><strong>{t("sessions.addSession.fields.attendance")}</strong></TableCell>
                    <TableCell><strong>{t("sessions.addSession.fields.Present")}</strong></TableCell>
                    <TableCell><strong>{t("sessions.addSession.fields.Absent")}</strong></TableCell>
                    <TableCell><strong>{t("sessions.addSession.fields.action")}</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessionsByOneGroup.map((session) => (
                    <TableRow
                      key={session._id}
                      sx={{
                        "&:hover": {
                          bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[100],
                        },
                      }}
                    >
                      <TableCell>
                        <Tooltip title={session.description || "No description"} arrow>
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 150,
                              cursor: "pointer",
                            }}
                          >
                            {session.description || "No description"}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(session.createdAt).toLocaleDateString("en-GB")}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {new Date(session.createdAt).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{session.place}</TableCell>
                      <TableCell>{session.attendance.length}</TableCell>
                      <TableCell sx={{ color: theme.palette.success.main, fontWeight: "bold" }}>
                        {session.presentStudents.length}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.error.main, fontWeight: "bold" }}>
                        {session.absentStudents.length}
                      </TableCell>
                      <TableCell>
                        <NavLink to={`/session/${session._id}`}>
                          <Button size="small" variant="outlined">
                            {t("sessions.View")}
                          </Button>
                        </NavLink>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* ================= Mobile Cards ================= */}
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} sx={{ display: { xs: "flex", md: "none" }, mt: 1 }}>
            {sessionsByOneGroup.map((session) => (
              <Grid size={{ xs: 12, }} key={session._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      {session.description || "No description"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📅 {new Date(session.createdAt).toLocaleDateString("en-GB")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ⏰ {new Date(session.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📍 Place: {session.place}
                    </Typography>
                    <Typography variant="body2" color={theme.palette.success.main}>
                      ✅ Present: {session.presentStudents.length}
                    </Typography>
                    <Typography variant="body2" color={theme.palette.error.main}>
                      ❌ Absent: {session.absentStudents.length}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <NavLink to={`/session/${session._id}`}>
                        <Button size="small" variant="outlined" fullWidth>
                          View
                        </Button>
                      </NavLink>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>

  );
}
