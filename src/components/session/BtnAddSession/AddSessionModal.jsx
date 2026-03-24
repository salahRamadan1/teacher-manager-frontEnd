import React, { useMemo, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Tooltip,
    useTheme,
    Grid,
    InputAdornment,
    CircularProgress,
    Autocomplete,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { validateCreateSession } from '../../../utils/validation/sessionsValidations';
import { useDispatch, useSelector } from 'react-redux';
import { addSession } from '../../../features/session/sessionAction';
import { makeStateIsEmpitySession } from '../../../features/session/sessionSlice';
import DynamicSnackbar from '../../alerts/DynamicSnackbar';
import SessionWarningDialog from './SessionWarningDialog';
import SessionCreatedDialog from './SessionCreatedDialog';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function AddSessionModal({ groupId, students, place, grade }) {
    const { t } = useTranslation();

    // ======================== Imports & Theme ========================

    // Access Material UI theme (colors, spacing, dark/light mode)
    const theme = useTheme();

    // Redux dispatch function
    const dispatch = useDispatch();

    // Extract session-related state from Redux store
    const {
        errorAddSessionGrade,
        errorAddSessionPlace,
        errorAddSessionDescription,
        errorAddSessionSessionPrice,
        errorAddSessionCenterPrice,
        loadingSession,
        errorAddSession,
        errorAddSessionNetWork,
        messageSessionExist,
        sessionId
    } = useSelector((state) => state.session);

    // ======================== Form State ========================

    // Main form state for creating a session
    const [formData, setFormData] = useState({
        grade: grade,               // Default grade passed as prop
        place: place,               // Default place passed as prop
        description: '',            // Session description
        sessionPrice: '',           // Price paid by student
        centerPrice: '',            // Center cost
        presentStudents: [],        // Students added to the session
        groupId: groupId            // Group ID passed as prop
    });

    // ======================== Search State ========================

    // Search input value used to filter students in the table
    const [searchStudent, setSearchStudent] = useState("");

    // ======================== Added Students IDs ========================

    // Create a Set of student IDs that are already added to the session
    // Used to prevent showing or selecting the same student again
    const addedStudentIds = useMemo(() => {
        return new Set(
            // Student ID may exist as studentId or _id depending on data structure
            formData.presentStudents.map((s) => s.studentId || s._id)
        );
    }, [formData.presentStudents]);

    // ======================== Available Students ========================

    // Filter students list to exclude students already added to the session
    // Used for select / autocomplete component
    const availableStudents = useMemo(() => {
        return students.filter(
            (s) => !addedStudentIds.has(s.studentId._id)
        );
    }, [students, addedStudentIds]);

    // ======================== Filtered Students ========================

    // Filter students added to the session based on search input
    // Used to render students in the table
    const filteredStudents = useMemo(() => {
        return formData.presentStudents
            // Filter out students based on ID tracking
            .filter((student) => !addedStudentIds.has(student._id))
            // Filter by student name using search input
            .filter((student) =>
                student.name
                    .toLowerCase()
                    .includes(searchStudent.toLowerCase())
            );
    }, [formData.presentStudents, addedStudentIds, searchStudent]);

    // ======================== Student Selection State ========================

    // Currently selected student from dropdown/autocomplete
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Temporary student data before adding to the session
    const [newStudent, setNewStudent] = useState({
        name: "",
        studentId: "",
        payment: 0,
        note: ""
    });

    // ======================== Edit Student Dialog State ========================
    const [openSessionDialog, setOpenSessionDialog] = useState(false);
    const [createdSessionId, setCreatedSessionId] = useState(null);
    // Controls edit dialog visibility
    const [openEditDialog, setOpenEditDialog] = useState(false);

    // Stores the student currently being edited
    const [editingStudent, setEditingStudent] = useState(null);

    // ======================== Add Session Modal State ========================

    // Controls add session modal visibility
    const [openModal, setOpenModal] = useState(false);

    // Stores frontend validation errors
    const [errors, setErrors] = useState({});

    // Indicates successful session creation
    const [Success, setSuccess] = useState(false);

    // Controls duplicate-session warning dialog
    const [openWarning, setOpenWarning] = useState(false);

    // ======================== Input Handlers ========================

    // Handle changes for main session form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear frontend errors on input change
        setErrors({});

        // Reset session-related Redux state
        dispatch(makeStateIsEmpitySession());
    };

    // ======================== Student Selection Handlers ========================

    // Handle selecting a student from dropdown/autocomplete
    const handleSelectStudent = (e) => {
        const studentId = e.target.value;

        // Find the selected student from the students list
        const student = students.find(
            s => (s.studentId._id || s.studentId.id) === studentId
        );

        if (!student) return;

        // Store selected student
        setSelectedStudent(student.studentId);

        // Initialize newStudent data
        setNewStudent({
            name: student.studentId.name,
            studentId: student.studentId._id,
            payment: student.studentId.payment,
            note: ""
        });
    };

    // Handle note input change before adding student
    const handleNoteChange = (e) => {
        setNewStudent(prev => ({
            ...prev,
            note: e.target.value
        }));
    };

    // ======================== Student List Handlers ========================

    // Add selected student to presentStudents list
    const handleAddStudent = () => {
        if (!newStudent.studentId) return;

        setFormData(prev => ({
            ...prev,
            presentStudents: [...prev.presentStudents, { ...newStudent }]
        }));

        // Reset student selection state
        setNewStudent({ studentId: "", payment: 0, note: "" });
        setSelectedStudent(null);
    };

    // Remove a student from presentStudents list by index
    const handleRemoveStudent = (index) => {
        setFormData(prev => ({
            ...prev,
            presentStudents: prev.presentStudents.filter((_, i) => i !== index),
        }));
    };

    // ======================== Edit Student Dialog Handlers ========================

    // Open edit dialog and store student data with index
    const handleOpenEdit = (student, index) => {
        setEditingStudent({ ...student, index });
        setOpenEditDialog(true);
    };

    // Close edit dialog and reset editing state
    const handleCloseEdit = () => {
        setOpenEditDialog(false);
        setEditingStudent(null);
    };

    // Update edited student data in presentStudents list
    const handleUpdateStudent = () => {
        setFormData(prev => {
            const newPresentStudents = [...prev.presentStudents];
            newPresentStudents[editingStudent.index] = editingStudent;
            return { ...prev, presentStudents: newPresentStudents };
        });

        handleCloseEdit();
    };

    // ======================== Add Session Modal Handlers ========================

    // Open add session modal
    const handleOpenModal = () => setOpenModal(true);

    // Close modal and reset errors and Redux session state
    const handleCloseModal = () => {
        setOpenModal(false);
        setErrors({});
        dispatch(makeStateIsEmpitySession());
    };

    // ======================== Form Submission Handler ========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ---------- Frontend Validation ----------
        const validationErrors = validateCreateSession(formData);
        if (validationErrors) {
            const errObj = {};
            validationErrors.forEach(err => errObj[err.path] = err.message);
            setErrors(errObj);
            return;
        }

        // ---------- Prepare Session Data ----------
        const sessionData = {
            ...formData,
            groupId,
            sessionPrice: Number(formData.sessionPrice),
            centerPrice: Number(formData.centerPrice),
            presentStudents: formData.presentStudents.map(student => ({
                ...student,
                payment: Number(student.payment)
            }))
        };

        // ---------- Dispatch Create Session ----------
        const res = await dispatch(addSession(sessionData));
        console.log(res);

        // ---------- Handle Response ----------
        if (
            res.type === "session/createsession/fulfilled" &&
            res.payload.message === "Session created successfully"
        ) {
            setSuccess(true);
            setCreatedSessionId(res.payload.sessionId); // حفظ id
            setOpenSessionDialog(true); // فتح الدايلوج
        } else if (
            res.type === "session/createsession/fulfilled" &&
            res.payload.message ===
            "There is already a session scheduled today. You cannot create another session for the same day"
        ) {
            setOpenWarning(true);
        }
    };
    const navigate = useNavigate()
    const goToSession = () => {
        navigate(`/session/${createdSessionId}`);
    };
    return (
        <>

            {errorAddSession && (

                <DynamicSnackbar type="error" message={errorAddSession} />
            )}
            {errorAddSessionNetWork && (
                <DynamicSnackbar type="error" message={errorAddSessionNetWork} />
            )}
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenModal}
                sx={{
                    px: 3,
                    py: 1.2,
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    background: theme.palette.mode === 'dark'
                        ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                        : `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                    color: theme.palette.getContrastText(theme.palette.primary.main),
                    boxShadow: theme.shadows[3],
                    transition: 'all 0.3s ease',
                    "&:hover": {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[6],
                    },
                }}
            >
                {t("sessions.addSession.openBtn")}
            </Button>
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>

                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        fontWeight: 'bold',
                        fontSize: '1.3rem',
                        bgcolor: theme.palette.mode === 'dark'
                            ? theme.palette.grey[900]
                            : theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        py: 2,
                    }}
                >
                    <EventAvailableIcon />

                    {t("sessions.addSession.title")}

                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {/* TextField */}
                    <Grid container sx={{ mt: 3 }} spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                        {/* Grade */}
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                                error={!!errors?.Grade || !!errorAddSessionGrade}
                                helperText={errors?.Grade || errorAddSessionGrade}
                                sx={{
                                    width: "100%",
                                    '&:hover .MuiSvgIcon-root': { opacity: 1 },
                                }}
                                label={t("sessions.addSession.fields.grade")}

                                value={formData.grade}
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <Tooltip title= {t("sessions.addSession.fields.readOnly")}>

                                            <InputAdornment position="end">
                                                <InfoOutlinedIcon
                                                    sx={{
                                                        opacity: 0,
                                                        transition: 'opacity 0.2s',
                                                        color: "red"
                                                    }}
                                                />
                                            </InputAdornment>
                                        </Tooltip>

                                    ),
                                }}
                            />
                        </Grid>
                        {/* Place */}
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                                label={t("sessions.addSession.fields.place")}

                                name="place"
                                value={formData.place}
                                onChange={handleInputChange}
                                fullWidth
                                size="small"
                                placeholder="e.g., smart, offline"
                                error={!!errors?.place || !!errorAddSessionPlace}
                                helperText={errors?.place || errorAddSessionPlace}
                            />
                        </Grid>
                        {/* Session Price */}
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                                label={t("sessions.addSession.fields.sessionPrice")}

                                name="sessionPrice"
                                type="number"
                                value={formData.sessionPrice}
                                onChange={handleInputChange}
                                fullWidth
                                size="small"
                                inputProps={{ step: '0.01' }}
                                error={!!errors?.sessionPrice || !!errorAddSessionSessionPrice}
                                helperText={errors?.sessionPrice || errorAddSessionSessionPrice}
                            />
                        </Grid>
                        {/* Center Price */}
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                                label={t("sessions.addSession.fields.centerPrice")}
                                name="centerPrice"
                                type="number"
                                value={formData.centerPrice}
                                onChange={handleInputChange}
                                fullWidth
                                size="small"
                                inputProps={{ step: '0.01' }}
                                error={!!errors?.centerPrice || !!errorAddSessionCenterPrice}
                                helperText={errors?.centerPrice || errorAddSessionCenterPrice}
                            />
                        </Grid>
                    </Grid>
                    {/* Description */}
                    <TextField
                        label={t("sessions.addSession.fields.discription")}

                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        sx={{ mt: 3 }}
                        error={!!errors?.description || !!errorAddSessionDescription}
                        helperText={errors?.description || errorAddSessionDescription}
                    />

                    {/* Present Students Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2, // margin bottom
                                fontWeight: 700,
                                color: theme.palette.mode === 'dark'
                                    ? theme.palette.grey[100]  // نص فاتح في الداكن
                                    : theme.palette.text.primary, // نص أساسي في اللايت
                                borderBottom: `2px solid ${theme.palette.divider}`, // خط تحتي
                                pb: 1, // padding bottom
                            }}
                        >
                            {t("sessions.addStudents")}

                        </Typography>

                        {/* Add Student Form */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1.5fr auto" }, // responsive: full width on mobile
                                gap: 1.5,
                                mb: 2,
                                p: 2,
                                bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[900] : "#f5f5f5",
                                borderRadius: 2,
                                boxShadow: theme.palette.mode === "dark" ? "0 1px 3px rgba(255,255,255,0.05)" : "0 1px 3px rgba(0,0,0,0.1)",
                                alignItems: "center",
                            }}
                        >
                            {/* search student select */}
                            <Autocomplete
                                options={availableStudents}
                                size="small"
                                fullWidth
                                getOptionLabel={(option) => option.studentId?.name || ""}
                                isOptionEqualToValue={(option, value) =>
                                    option.studentId._id === value.studentId._id
                                }
                                value={
                                    students.find(
                                        (s) => s.studentId?._id === selectedStudent?._id
                                    ) || null
                                }
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        handleSelectStudent({
                                            target: {
                                                value: newValue.studentId._id || newValue.studentId.id,
                                            },
                                        });
                                    }
                                }}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.studentId._id}>
                                        {option.studentId.name}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField {...params} label={t("sessions.serachStudentPlaceholder")}
                                    />
                                )}
                            />


                            {/* Display Payment */}
                            <Box sx={{ mt: { xs: 1, sm: 0 } }}>
                                <Typography variant="body2" color={theme.palette.text.secondary}>
                                    💰 {t("sessions.addSession.fields.price")}: {selectedStudent?.payment || 0}
                                </Typography>
                            </Box>

                            {/* Note input */}
                            <TextField
                                label={t("sessions.addSession.fields.note")}
                                name="note"
                                value={newStudent.note}
                                onChange={handleNoteChange}
                                size="small"
                                fullWidth
                                sx={{
                                    bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#fff",
                                    "& .MuiInputBase-input": { color: theme.palette.text.primary },
                                }}
                            />

                            {/* Add button */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddStudent}
                                startIcon={<AddIcon />}
                                sx={{ height: "40px", mt: { xs: 1, sm: 0 } }}
                            >
                             {t("sessions.addSession.actions.add")}
                            </Button>
                        </Box>
                        {/* Search Bar */}

                        < Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                mb: 2,
                                alignItems: "center",
                            }}
                        >
                            <TextField
                                size="small"
                                fullWidth
                                placeholder={t("sessions.serachStudentPlaceholder")}
                                value={searchStudent}
                                onChange={(e) => setSearchStudent(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {/* <SearchIcon fontSize="small" /> */}
                                        </InputAdornment>
                                    ),
                                }}
                            />


                        </Box>

                        {/* Students Table */}
                        {filteredStudents.length > 0 && (
                            <TableContainer component={Paper} sx={{
                                bgcolor: theme.palette.background.paper, // متوافق مع Dark/Light mode
                                borderRadius: 2,
                                boxShadow: theme.shadows[3],
                                overflowX: "auto", // يسمح بالتمرير الأفقي على الموبايل
                            }}>
                                <Table size="small">
                                    {/* Table Head */}
                                    <TableHead sx={{
                                        bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                                    }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>👤 {t("sessions.addSession.fields.studentName")}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }} align="right">💰 {t("sessions.addSession.fields.price")}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>📝 {t("sessions.addSession.fields.note")}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }} align="center">{t("sessions.addSession.fields.action")}</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    {/* Table Body */}
                                    <TableBody>
                                        {filteredStudents.map((student, index) => (
                                            <TableRow
                                                key={index}
                                                hover
                                                sx={{
                                                    '&:hover': { backgroundColor: theme.palette.action.hover },
                                                    transition: 'background-color 0.2s ease',
                                                }}
                                            >
                                                <TableCell>{student.name}</TableCell>
                                                <TableCell align="right">{student.payment}</TableCell>
                                                <TableCell>
                                                    {student.note ? (
                                                        <Tooltip title={student.note}>
                                                            <span>{student.note.length > 20 ? student.note.slice(0, 20) + '...' : student.note}</span>
                                                        </Tooltip>
                                                    ) : (
                                                        <Typography variant="caption" color="text.secondary">{t("sessions.addSession.fields.noNote")}</Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                        {/* Delete Button */}
                                                        <Tooltip title={t("sessions.addSession.actions.delete")}>
                                                            <IconButton color="error" size="small" onClick={() => handleRemoveStudent(index)}>
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        {/* Edit Button */}
                                                        <Tooltip title={t("sessions.addSession.actions.update")}>
                                                            <IconButton
                                                                color="primary"
                                                                size="small"
                                                                onClick={() => handleOpenEdit(student, index)}
                                                                sx={{
                                                                    borderRadius: 1,
                                                                    transition: 'all 0.2s ease',
                                                                    "&:hover": {
                                                                        backgroundColor: `${theme.palette.primary.main}15`,
                                                                    },
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        )}
                        {/* Students  empty */}
                        {filteredStudents.length === 0 && (
                            <Box
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
                                    color: theme.palette.text.secondary,
                                    fontWeight: 500,
                                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' }, // responsive font size
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                    minHeight: 80,
                                }}
                            >
                                <Typography sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' } }}>👀</Typography>
                                <Typography>{t("sessions.addSession.noStudentYet")}</Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                {/* action button */}
                <DialogActions
                    sx={{
                        p: 2,
                        bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
                        borderTop: `1px solid ${theme.palette.divider}`,
                        justifyContent: 'flex-end',
                    }}
                >
                    {/* Cancel button */}
                    <Button
                        onClick={handleCloseModal}
                        color="inherit"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: 100,
                        }}
                    >
                        {t("sessions.addSession.actions.cancel")}
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={loadingSession} // Disable button while loading
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            minWidth: 120,
                            boxShadow: theme.shadows[2],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            "&:hover": {
                                boxShadow: theme.shadows[4],
                            },
                        }}
                    >
                        {loadingSession ? (
                            <CircularProgress size={20} color="inherit" /> // Loader inside button
                        ) : (
                            t("sessions.addSession.actions.add")
                        )}
                    </Button>
                </DialogActions>


                <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
                    {/* Dialog Title */}
                    <DialogTitle
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.primary.main,
                            color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.primary.contrastText,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            py: 1.5,
                            px: 2,
                            mb: 3,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <EditIcon fontSize="small" />
                        {t("sessions.addSession.editStudentNote")}
                    </DialogTitle>

                    {/* Dialog Content */}
                    <DialogContent sx={{ pt: 2 }}>
                        {/* Student Name Display */}
                        <Box sx={{ p: 1.5, bgcolor: theme.palette.action.hover, borderRadius: 1, mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                {t("sessions.addSession.fields.studentName")}
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                                {editingStudent?.name || "No name"}
                            </Typography>
                        </Box>

                        {/* Note Field */}
                        <TextField
                            label={`📝 ${t("sessions.addSession.fields.note")}`}
                            fullWidth
                            multiline
                            rows={3}
                            value={editingStudent?.note || ""}
                            onChange={(e) =>
                                setEditingStudent(prev => ({ ...prev, note: e.target.value }))
                            }
                            sx={{
                                bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#f9f9f9',
                                borderRadius: 1,
                                mt: 1,
                            }}
                        />
                    </DialogContent>

                    {/* Dialog Actions */}
                    <DialogActions
                        sx={{
                            p: 2,
                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
                            borderTop: `1px solid ${theme.palette.divider}`,
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button
                            onClick={handleCloseEdit}
                            color="inherit"
                            sx={{ textTransform: 'none', fontWeight: 500, minWidth: 100 }}
                        >
                            {t("sessions.addSession.actions.cancel")}
                        </Button>
                        <Button
                            onClick={handleUpdateStudent}
                            variant="contained"
                            color="primary"
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                minWidth: 120,
                                boxShadow: theme.shadows[2],
                                "&:hover": { boxShadow: theme.shadows[4] },
                            }}
                        >
                            {t("sessions.addSession.actions.save")}
                        </Button>
                    </DialogActions>
                </Dialog>
                <SessionCreatedDialog
                    open={openSessionDialog}
                    onClose={() => setOpenSessionDialog(false)}
                    onGoToSession={goToSession}
                    sessionId={createdSessionId}
                />
                <SessionWarningDialog
                    open={openWarning}
                    onClose={() => setOpenWarning(false)}
                    sessionId={sessionId}
                    message={messageSessionExist}
                />
            </Dialog >
        </>
    );
}
