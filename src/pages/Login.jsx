// src/pages/Login.jsx
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

import { login } from "../features/auth/authAction";
import { makeStateIsEmpityAuth } from "../features/auth/authSlice";
import { validateLogin } from "../utils/validation/loginValidation";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// لو عندك ThemeToggle سيبه
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageSwitcher";

export default function Login() {
  const theme = useTheme();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const {
    token,
    loadingLogIn,
    errorLogIn,
    errorLogInNetWork,
    errorLogInPassword,
    errorLogInEmail,
  } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({ email: "", password: "" });

  const [errorEmailValidation, setErrorEmailValidation] = useState(null);
  const [errorPasswordValidation, setErrorPasswordValidation] = useState(null);

  // ضبط اتجاه الصفحة حسب اللغة (RTL/LTR)
  useEffect(() => {
    const lang = localStorage.getItem("lang") || i18n.language || "en";
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, []);

  const handleTogglePassword = () => setShowPassword((p) => !p);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    dispatch(makeStateIsEmpityAuth());

    setErrorEmailValidation(null);
    setErrorPasswordValidation(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateLogin(form);

    if (errors?.length) {
      errors.forEach((err) => {
        if (err.path === "email") setErrorEmailValidation(err.message);
        if (err.path === "password") setErrorPasswordValidation(err.message);
      });
      return;
    }

    const res = await dispatch(login(form));

    if (
      res.type === "auth/login/fulfilled" &&
      res.payload?.message === "Logged in successfully" &&
      res.payload?.token
    ) {
      localStorage.setItem("token", res.payload.token);
    }
  };

  const changeLang = async (lang) => {
    await i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  if (token) return <Navigate to="/" />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #333 0%, #555 100%)",
        py: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            borderRadius: 4,
            p: 4,
            background: theme.palette.background.paper,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Top bar */}
          <LanguageToggle />

          <Divider sx={{ mb: 3 }} />

          {/* Header */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Box
              sx={{
                background: theme.palette.primary.main,
                borderRadius: "50%",
                p: 2,
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SchoolIcon sx={{ fontSize: 40, color: theme.palette.primary.contrastText }} />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: theme.palette.primary.main,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                textAlign: "center",
              }}
            >
              {t("appName")}
            </Typography>

         
          </Box>

          {/* Errors */}
          {errorLogIn && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {errorLogIn}
            </Alert>
          )}
          {errorLogInNetWork && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {errorLogInNetWork}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t("email")}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
              error={!!errorLogInEmail}
              helperText={errorLogInEmail || " "}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                },
              }}
            />
            {errorEmailValidation && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {errorEmailValidation}
              </Alert>
            )}

            <TextField
              fullWidth
              label={t("password")}
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
              error={!!errorLogInPassword}
              helperText={errorLogInPassword || " "}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                },
              }}
            />
            {errorPasswordValidation && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {errorPasswordValidation}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loadingLogIn}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: 2,
                background: theme.palette.primary.main,
                boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  transform: loadingLogIn ? "none" : "translateY(-2px)",
                  boxShadow: loadingLogIn
                    ? "0 8px 16px rgba(102, 126, 234, 0.3)"
                    : "0 12px 24px rgba(102, 126, 234, 0.4)",
                },
              }}
            >
              {loadingLogIn ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                t("login")
              )}
            </Button>
          </form>

      
        </Paper>
      </Container>
    </Box>
  );
}
