import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme,
    useMediaQuery,
    Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeaderExam from "./HeaderExam";
import { useDispatch, useSelector } from "react-redux";
import { addMarkandStudentInExams, getExamBySession } from "../../features/exam/examAction";
import { useParams } from "react-router-dom";
import FetchMarksStudents from "./FetchMarksStudents";
import { useTranslation } from "react-i18next";
const AddExamMarks = ({ examId, attendance }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { id } = useParams()

    const isSmall = useMediaQuery(theme.breakpoints.down("sm")); // responsive
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const { exam, loadingGetExam,
        errorGetExam } = useSelector((state) => state.exam);

    useEffect(() => {


        if (attendance && attendance.length > 0) {
            const prepared = attendance.map((a) => ({
                _id: a.studentId._id,
                name: a.studentId.name,
                phone: a.studentId.phone,
                mark: a.status === "absent" ? 0 : "", // absent -> 0
                status: a.status, // present or absent
            }));

            // Sort present first
            prepared.sort((a, b) => (a.status === "present" ? -1 : 1));

            setStudents(prepared);
        }
        dispatch(getExamBySession(id));

    }, [attendance, dispatch]);

    const handleMarkChange = (id, value) => {
        setStudents((prev) =>
            prev.map((s) =>
                s._id === id ? { ...s, mark: s.status === "absent" ? 0 : value } : s
            )
        );
    };

    const handleSubmit = async () => {
        const payload = {
            examId: exam._id,
            students: students.map((s) => ({
                studentId: s._id,
                mark: s.mark === "" ? 0 : Number(s.mark),
            })),
        };
        console.log("Payload to send:", payload);
        const res = await dispatch(addMarkandStudentInExams(payload));

    };

    const filteredStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.phone.includes(search)
    );

    return (
        <>
            {errorGetExam && <Alert severity="error" sx={{ mb: 2 }}>
                {errorGetExam}
            </Alert>}

            {exam && !exam.studentId.length ? <>
                <Box
                    sx={{
                        width: "100%",
                        mx: "auto",
                        my: 2,
                        p: 2,
                        borderRadius: 2,
                        boxShadow: 3,
                        bgcolor: theme.palette.mode === "dark" ? "#222" : "#fff",
                    }}
                >
                    <HeaderExam
                        title={exam?.title}
                        totalMark={exam?.totalMark}
                    />

                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="student-table-content"
                            id="student-table-header"
                        >
                            <Typography>{t("examMarks.studentsAndMarks")}</Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Stack spacing={2}>
                                <TextField
                                    label={t("examMarks.searchPlaceholder")}

                                    size="small"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    fullWidth
                                />

                                <Box sx={{ maxHeight: 300, overflowY: "auto", mt: 1 }}>
                                    <Paper sx={{ width: "100%", borderRadius: 1 }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        sx={{
                                                            position: "sticky",
                                                            left: 0,
                                                            backgroundColor: theme.palette.background.paper,
                                                            zIndex: 2,
                                                        }}
                                                    >
                                                        {t("examMarks.name")}
                                                    </TableCell>
                                                    {!isSmall && <TableCell> </TableCell>}
                                                    <TableCell>{t("examMarks.status")}</TableCell>
                                                    <TableCell>{t("examMarks.mark")}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredStudents.map((s) => (
                                                    <TableRow
                                                        key={s._id}
                                                        sx={{
                                                            bgcolor:
                                                                s.status === "present"
                                                                    ? "rgba(76, 175, 80, 0.15)"
                                                                    : "rgba(244, 67, 54, 0.15)",
                                                        }}
                                                    >
                                                        <TableCell
                                                            sx={{
                                                                position: "sticky",
                                                                left: 0,
                                                                backgroundColor: theme.palette.background.paper,
                                                                zIndex: 1,
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            {s.name}
                                                        </TableCell>
                                                        {!isSmall && <TableCell>{s.phone}</TableCell>}
                                                        <TableCell>
                                                            <Typography
                                                                sx={{
                                                                    color:
                                                                        s.status === "present"
                                                                            ? theme.palette.success.main
                                                                            : theme.palette.error.main,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {s.status === "present" ? t("attendance.present") : t("attendance.absent")}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                type="number"
                                                                size="small"
                                                                value={s.mark}
                                                                onChange={(e) =>
                                                                    handleMarkChange(s._id, e.target.value)
                                                                }
                                                                disabled={s.status === "absent"}
                                                                sx={{ width: 80 }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {filteredStudents.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={4} align="center">
                                                            {t("examMarks.noStudents")}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                </Box>

                                <Stack direction="row" justifyContent="flex-end">
                                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                                        {t("examMarks.submitMarks")}
                                    </Button>
                                </Stack>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </> : <FetchMarksStudents exam={exam} />


            }
        </>
    );
};

export default AddExamMarks;
