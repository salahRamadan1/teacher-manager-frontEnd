import React, { useEffect, useState } from "react";
import {
    Paper,
    Card,
    CardContent,
    CardActions,
    Avatar,
    Box,
    Typography,
    Stack,
    Chip,
    Button,
    IconButton,
    useTheme,
    CircularProgress,
    Grid,
    alpha,
    Tooltip,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../../../features/groups/groupAction";
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import GroupsIcon from "@mui/icons-material/Groups";
import BtnAddGroup from "../BtnHomeGroups/BtnAddGroup";
import StudentsAtGroupInPageGroupData from "../../StudentsAtGroupInPageGroupData";
import { NavLink } from "react-router-dom";
import { formatDay, formatTo12Hour } from "../../../../utils/formatTimeAndData/format";
import BtnUpdateGroup from "../BtnHomeGroups/BtnUpdateGroup";
import DynamicSnackbar from "../../../alerts/DynamicSnackbar";
import GroupsSkeleton from "./GroupsSkeleton";
import { useTranslation } from "react-i18next";


export default function GroupDataIsTableOrDisk() {
    const { t } = useTranslation();
    // ==============================
    // Theme
    // ==============================
    const theme = useTheme(); // Access MUI theme for colors, spacing, etc.

    // ==============================
    // Local State
    // ==============================
    const [page, setPage] = useState(1);       // Current pagination page
    const [search, setSearch] = useState("");  // Search keyword filter
    const [grade, setGrade] = useState("");    // Grade filter
    const [sort, setSort] = useState("");      // Sort filter

    // ==============================
    // Redux
    // ==============================
    const dispatch = useDispatch();
    const {
        loadingGetGroup,      // Loading state while fetching groups
        groups                // Fetched groups array
    } = useSelector((state) => state.group);

    // ==============================
    // Fetch Groups Function
    // ==============================
    const fetchGroups = () => {
        // Base URL with pagination
        let url = `/group/getGroupsByTeacher?page=${page}`;

        // Append query params dynamically if filters exist
        if (search) url += `&keyword=${search}`;
        if (grade) url += `&grade=${grade}`;
        if (sort) url += `&sort=${sort}`;

        // Dispatch redux action to fetch groups
        dispatch(getGroups(url));
    };

    // ==============================
    // Fetch groups when any filter or page changes
    // ==============================
    useEffect(() => {
        fetchGroups();
    }, [page, search, grade, sort]);


    /* -------------------- RENDER CARDS VIEW -------------------- */
    return (
        <>
            {loadingGetGroup ? (
                <GroupsSkeleton count={3} />  // 3 كارت skeleton أثناء التحميل
            ) : (

                <Box>
                    {groups.length > 0 ? (
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {groups.map((group) => (
                                <Grid size={{ xs: 12, sm: 8, md: 4 }} key={group._id} >
                                    <Card
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",

                                            borderRadius: 2.5,
                                            border: `1px solid ${theme.palette.mode === "dark"
                                                ? "rgba(255,255,255,0.1)"
                                                : "rgba(0,0,0,0.06)"
                                                }`,
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-6px)",
                                                boxShadow:
                                                    theme.palette.mode === "dark"
                                                        ? "0 12px 40px rgba(0,0,0,0.4)"
                                                        : "0 12px 40px rgba(0,0,0,0.12)",
                                            },
                                        }}
                                    >
                                        {/* Card Header with Avatar */}
                                        <CardContent sx={{ flex: 1 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: theme.palette.primary.main,
                                                        width: 48,
                                                        height: 48,
                                                        fontWeight: 700,
                                                        fontSize: "1.2rem",
                                                    }}
                                                >
                                                    {group.name?.charAt(0) ?? "G"}
                                                </Avatar>
                                                <Box flex={1}>
                                                    <Typography fontWeight={700} noWrap>
                                                        {group.name}
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight={700} noWrap>
                                                        {group.grade}
                                                    </Typography>
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <LocationOnIcon fontSize="small" color="primary" />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {group.place}
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </Box>

                                            {/* Schedule Chip */}
                                            <Box sx={{ mb: 2 }}>
                                                <Chip
                                                    size="small"
                                                    icon={<AccessTimeIcon />}
                                                    label={`${formatDay(group.day)} • ${formatTo12Hour(group.time)}`}
                                                    sx={{
                                                        fontWeight: 600,
                                                        borderRadius: 1,
                                                        background:
                                                            theme.palette.mode === "dark"
                                                                ? "rgba(255,255,255,0.08)"
                                                                : "rgba(0,0,0,0.04)",
                                                        border: `1px solid ${theme.palette.mode === "dark"
                                                            ? "rgba(255,255,255,0.1)"
                                                            : "rgba(0,0,0,0.08)"
                                                            }`,
                                                    }}
                                                />
                                            </Box>
                                            <Box variant="body2">
                                                💰 <strong>{t("groups.payment")}:</strong>{" "}
                                                <Chip
                                                    label={group.price > 0 ? group.price : t("groups.notPaidOrFree")}
                                                    size="small"
                                                    color={group.price > 0 ? "success" : "error"}
                                                />
                                            </Box>

                                            {/* Students Info Box */}
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 1.5,
                                                    background:
                                                        theme.palette.mode === "dark"
                                                            ? "rgba(255,255,255,0.05)"
                                                            : "rgba(0,0,0,0.02)",
                                                    border: `1px solid ${theme.palette.mode === "dark"
                                                        ? "rgba(255,255,255,0.08)"
                                                        : "rgba(0,0,0,0.04)"
                                                        }`,
                                                }}
                                            >
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 44,
                                                                height: 44,
                                                                borderRadius: "50%",
                                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            <StudentsAtGroupInPageGroupData students={group.studentIds} groupName={group.name} loading={loadingGetGroup} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.25 }}>
                                                                {t("groups.totalStudents")}
                                                            </Typography>
                                                            <Typography variant="h6" fontWeight={800} color="primary.main">
                                                                {group.studentIds?.length ?? 0}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Chip
                                                        label={t("groups.enrolled")}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            background: `${theme.palette.success.main}20`,
                                                            color: theme.palette.success.main,
                                                            border: `1px solid ${theme.palette.success.main}40`,
                                                        }}
                                                    />
                                                </Box>

                                            </Paper>
                                        </CardContent>

                                        {/* Card Actions */}
                                        <CardActions
                                            sx={{
                                                justifyContent: "space-between",
                                                px: 2.5,
                                                pb: 2,
                                                pt: 1,
                                                gap: 1,
                                            }}
                                        >
                                            <NavLink to={`/GroupDetails/${group._id}`}>
                                                <Tooltip title={t("groups.viewGroup")}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<CallMissedOutgoingIcon />}
                                                        sx={{ borderRadius: 1, fontWeight: 700, textTransform: "none", flex: 1 }}
                                                    >
                                                        {t("groups.view")}
                                                    </Button>
                                                </Tooltip>
                                            </NavLink>

                                            <Stack direction="row" spacing={0.5}>
                                                <BtnUpdateGroup groupId={group._id} />


                                                <Tooltip title={t("groups.delete")}>

                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDeleteGroup(group._id)}
                                                        sx={{
                                                            borderRadius: 1,
                                                            transition: "all 0.2s ease",
                                                            "&:hover": {
                                                                background: "rgba(211, 47, 47, 0.15)",
                                                            },
                                                        }}
                                                    >
                                                 
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        /* ================= EMPTY STATE ================= */
                        <Box
                            sx={{
                                textAlign: "center",
                                py: 7,
                                px: 3,
                                borderRadius: 2.5,
                                background: `linear-gradient(135deg,
                      ${alpha(theme.palette.primary.main, 0.08)},
                      ${alpha(theme.palette.secondary.main, 0.08)})`,
                                border: `1px dashed ${theme.palette.divider}`,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 90,
                                    height: 90,
                                    mx: "auto",
                                    mb: 2.5,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                                }}
                            >
                                <GroupsIcon
                                    sx={{
                                        fontSize: 48,
                                        color: theme.palette.primary.main,
                                    }}
                                />
                            </Box>

                            <Typography variant="h5" fontWeight={800}>
                                {t("groups.emptyTitle")}
                            </Typography>

                            <Typography color="text.secondary" sx={{ mt: 1.2, mb: 3 }}>
                                {t("groups.emptySubtitle")}
                            </Typography>

                            <BtnAddGroup />
                        </Box>
                    )}
                </Box>
            )}
        </>
    )
}
