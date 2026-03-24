import React, { useMemo, useState } from 'react'
import Accordion from '@mui/material/Accordion';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
    Box,
    Typography,
    Chip,
    Button,
    Grid,
    Card,
    CardContent,
    Stack,
    TextField,
    InputAdornment,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from "@mui/icons-material/School";
import BtnAddStudentToGroup from '../BtnAddStudentToGroup/BtnAddStudentToGroup';
import BtnRemoveStudentFromGroup from '../BtnRemoveStudentFromGroup/BtnRemoveStudentFromGroup';
import TransFerStdBtwGroups from './TransFerStdBtwGroups';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
export default function StudentsFetchGroup({ students, grade, groupName }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isAr = i18n.language?.startsWith("ar");
    // Use MUI theme for consistent styling
    const theme = useTheme();

    // Local state for search input
    const [searchValue, setSearchValue] = useState('');

    // Filter students based on searchValue
    // useMemo is used to memoize the filtered result for performance optimization
    const filteredStudents = useMemo(() => {
        // If search input is empty or only spaces, return all students
        if (!searchValue.trim()) return students;

        // Convert search input to lowercase for case-insensitive matching
        const lowerSearch = searchValue.toLowerCase();

        // Filter students array
        return students.filter(({ studentId }) =>
            // Check if student's name, phone, or grade includes the search input
            studentId?.name?.toLowerCase().includes(lowerSearch) ||
            studentId?.phone?.toLowerCase().includes(lowerSearch) ||
            studentId?.grade?.toLowerCase().includes(lowerSearch)
        );
    }, [students, searchValue]); // Recompute only when 'students' or 'searchValue' changes

    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{ mt: 1 }}
                >
                    <Typography component="span">{t("groups.students.title")}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "stretch", sm: "center" },
                        }}
                    >
                        <TextField
                            placeholder={t("groups.students.searchPlaceholder")}
                            size="small"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            sx={{
                                flexGrow: 1,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    background:
                                        theme.palette.mode === "dark"
                                            ? "rgba(255,255,255,0.08)"
                                            : "rgba(0,0,0,0.02)",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: "text.secondary" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <BtnAddStudentToGroup grade={grade} />

                    <Grid container spacing={3}>
                        {students && students.length > 0 ? (
                            filteredStudents.map((student) => (
                                <Grid key={student.studentId._id} size={{ xs: 12, sm: 6, md: 4 }}>
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
                                    >
                                        <CardContent>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="h6" fontWeight={700}>
                                                    {student.studentId.name}
                                                </Typography>

                                                <Chip
                                                    label={t("groups.students.gradeLabel", { grade: student.studentId.grade })}
                                                    color="secondary"
                                                    size="small"
                                                />
                                            </Stack>

                                            <Stack spacing={1} sx={{ mt: 2 }}>
                                                <Typography variant="body2">
                                                    📞 <strong>{t("groups.phone")}:</strong> {student.studentId.phone}
                                                </Typography>

                                                <Typography variant="body2">
                                                    👨‍👩‍👦 <strong>{t("groups.students.parentPhone")}:</strong>{" "}
                                                    {student.studentId.parentPhone}
                                                </Typography>

                                                <Box variant="body2">
                                                    💰 <strong>{t("groups.students.payment")}:</strong>{" "}
                                                    <Chip
                                                        label={
                                                            student.studentId.payment > 0
                                                                ? t("groups.students.paidAmount", { amount: student.studentId.payment })
                                                                : t("groups.students.notPaid")
                                                        }
                                                        size="small"
                                                        color={student.studentId.payment > 0 ? "success" : "error"}
                                                    />
                                                </Box>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{ mt: 3 }}
                                            >
                                                <Button size="small" variant="outlined"
                                                    onClick={(e) => {
                                            
                                                        navigate(`/students/${student.studentId._id}`);
                                                    }}>
                                                    {t("groups.view")}
                                                </Button>

                                                <Stack direction="row" spacing={1}>
                                                    <BtnRemoveStudentFromGroup
                                                        student={student.studentId}
                                                        groupName={groupName}
                                                    />
                                                    <TransFerStdBtwGroups grade={grade} student={student.studentId} />
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
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
                                    <SchoolIcon
                                        sx={{
                                            fontSize: 60,
                                            color: theme.palette.primary.main,
                                            mb: 2,
                                        }}
                                    />

                                    <Typography variant="h6" fontWeight={700}>
                                        {t("groups.students.emptyTitle")}
                                    </Typography>

                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        {t("groups.students.emptySubtitle")}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </AccordionDetails>
            </Accordion>



        </div>

    )
}
