import { Avatar, Box, Card, CardContent, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material'

import {

    Group as GroupIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,

} from '@mui/icons-material';
import { useSelector } from 'react-redux';

import { formatDay, formatTo12Hour } from '../../../../utils/formatTimeAndData/format';
import StudentsFetchGroup from './StudentsFetchGroup';
import BtnUpdateGroup from '../../HomeGroups/BtnHomeGroups/BtnUpdateGroup';
import AddSessionModal from '../../../session/BtnAddSession/AddSessionModal';
import GroupHeroSkeleton from './GroupHeroSkeleton';
import { useTranslation } from "react-i18next";

export default function HeaderGroupDeTails() {
    const { t } = useTranslation();

    const theme = useTheme();

    const {
        loadingGetGroupById,
        GroupById,
    } = useSelector((state) => state.group);
    const {

        lengthSessionsByOneGroup
    } = useSelector((state) => state.session);


    return (

        <Box>
            {loadingGetGroupById ? (
                <GroupHeroSkeleton />
            ) : (
                <>


                    {/* ================= Hero Header ================= */}
                    {/* Display the main group info if data is loaded */}
                    {GroupById &&
                        < Card
                            sx={{
                                mb: 4,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                color: '#fff',
                                borderRadius: 2,
                                overflow: 'hidden',
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Stack spacing={2}>

                                    {/* ================= Header Row ================= */}
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, alignItems: "center", justifyContent: 'space-between' }}>

                                        {/* Left Side: Avatar + Group Name */}
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1 }}>
                                            <Avatar
                                                sx={{
                                                    width: 70,
                                                    height: 70,
                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                    border: '3px solid rgba(255,255,255,0.3)',
                                                    fontSize: '1.5rem',
                                                }}
                                            >
                                                <GroupIcon sx={{ fontSize: 40 }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h3" fontWeight={800} gutterBottom>
                                                    {GroupById.name} {/* Display group name */}
                                                </Typography>

                                            </Box>
                                        </Box>
                                        <AddSessionModal students={GroupById.studentIds} grade={GroupById.grade} place={GroupById.place} groupId={GroupById._id} />

                                        {/* Right Side: Update Button */}
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{
                                                bgcolor: 'background.paper',
                                                color: 'success.main',
                                                '&:hover': {
                                                    bgcolor: 'grey.100',
                                                },
                                                borderRadius: 1,
                                            }}
                                        >
                                            <BtnUpdateGroup /> {/* Button to update group info */}
                                        </Stack>
                                    </Box>

                                    {/* ================= Quick Stats ================= */}
                                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

                                        {/* Number of Students */}
                                        <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 1.5, borderRadius: 1.5 }}>
                                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                                                    🎓  {t("groups.totalStudents")}
                                                  
                                                </Typography>
                                                <Typography variant="h5" fontWeight={700}>
                                                    {GroupById.studentIds.length}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        {/* Number of Sessions */}
                                        <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 1.5, borderRadius: 1.5 }}>
                                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                                                    📚
                                                    {t("groups.session")}  
                                                </Typography>
                                                <Typography variant="h5" fontWeight={700}>
                                                    {/* Hardcoded for now */}
                                                    {lengthSessionsByOneGroup || 0}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        {/* Group Grade */}
                                        <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 1.5, borderRadius: 1.5 }}>
                                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                                                    🎓  {t("groups.grade")}  
                                                </Typography>
                                                <Typography variant="h5" fontWeight={700}>
                                                    {GroupById.grade ? t(`groups.filters.grades.${GroupById.grade}`) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        {/* Group Price */}
                                        <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 1.5, borderRadius: 1.5 }}>
                                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                                                    💰 {t("groups.price")}
                                                </Typography>
                                                <Typography variant="h5" fontWeight={700}>
                                                    {GroupById.price || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        {/* Day & Time */}
                                        <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 1.5, borderRadius: 1.5 }}>
                                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                                                    🗓️ {t("groups.date&time")}
                                                </Typography>
                                                <Typography variant="h6" fontWeight={700}>
                                                    {GroupById.day && GroupById.time
                                                        ? `${formatDay(GroupById.day)} · ${formatTo12Hour(GroupById.time)}`
                                                        : "—"}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        {/* Place */}
                                        <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 1.5, borderRadius: 1.5 }}>
                                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                                                    📍 {t("groups.place")}
                                                </Typography>
                                                <Typography variant="h6" fontWeight={700}>
                                                    {GroupById.place || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        {/* Exam */}
                                        <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 1.5, borderRadius: 1.5 }}>
                                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                                                    🧠 {t("groups.exam")}
                                                </Typography>
                                                <Typography variant="h6" fontWeight={700}>
                                                    3 {/* Hardcoded for now */}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Stack>

                                {/* ================= Students Section ================= */}
                                {/* Component to list all students in this group */}
                                <StudentsFetchGroup
                                    students={GroupById.studentIds}
                                    grade={GroupById.grade}
                                    groupName={GroupById.name}
                                />
                            </CardContent>
                        </Card>
                    }
                </>
            )
            }

        </Box >

    )
}
