import { Box, IconButton, Avatar, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, Button, Badge, FormControlLabel, Switch } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import { motion, AnimatePresence } from "framer-motion";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageSwitcher';
import { useTranslation } from "react-i18next";
import { logout } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
export default function SideBar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // ✅ Main navigation items for the drawer
  const MainList = [
    { text: t("sidebar.dashboard"), icon: <DashboardIcon />, path: "/dashboard" },
    { text: t("sidebar.students"), icon: <PersonIcon />, path: "/students" },
    { text: t("sidebar.group"), icon: <GroupsIcon />, path: "/Group" },
    { text: t("sidebar.session"), icon: <EventIcon />, path: "/sessions" },
 
  ];
  useEffect(() => {
    // Close the drawer when the user logs out
    console.log(user);

  }, [user]);
  // ✅ Secondary navigation items (usually profile/settings)
  const SecondaryList = [
    { text: t("sidebar.profile"), icon: <AccountCircleIcon />, path: "/admin/profile" },
    { text: t("sidebar.settings"), icon: <SettingsIcon />, path: "/admin/settings" },
  ];

  // ✅ State to control whether the drawer is open or closed
  const [open, setOpen] = React.useState(false);

  // ✅ Access the MUI theme to use colors dynamically (dark/light mode)
  const theme = useTheme();

  // ✅ React Router hooks to navigate and get current location
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({}); // Track open submenu per item

  const handleToggleSubmenu = (text) => {
    setOpenSubmenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };
  // ✅ Function to toggle the drawer open/close
  const toggleDrawer = (newOpen) => () => setOpen(newOpen);
  // ===== Animations =====



  // ✅ The content of the drawer
  const DrawerList = (
    <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          width: 270,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* ===== Header ===== */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 3,
              gap: 2,
              cursor: "pointer",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: theme.palette.primary.contrastText,
            }}
            onClick={toggleDrawer(false)}
          >
            <Avatar
              alt="Teacher"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 60, height: 60, border: "3px solid rgba(255,255,255,0.4)" }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {user?.name}

              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {user?.role === "admin" ? t("sidebar.admin") : t("sidebar.teacher")}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ bgcolor: theme.palette.divider }} />

          {/* ===== Main Navigation ===== */}
          <List>
            {MainList.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              return (
                <Box key={item.text}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        if (hasSubmenu) handleToggleSubmenu(item.text);
                        else {
                          navigate(item.path);
                          toggleDrawer(false)();
                        }
                      }}
                      sx={{
                        bgcolor: isActive ? theme.palette.secondary.main : "transparent",
                        color: isActive
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.primary,
                        "& .MuiListItemIcon-root": {
                          color: isActive
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.primary,
                        },
                        "&:hover": {
                          bgcolor: isActive ? theme.palette.secondary.dark : theme.palette.action.hover,
                        },
                        borderRadius: 1,
                        my: 0.4,
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                      {hasSubmenu && (
                        <motion.div
                          animate={{ rotate: openSubmenus[item.text] ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ExpandMoreIcon />
                        </motion.div>
                      )}
                    </ListItemButton>
                  </ListItem>

                  {/* Submenu */}
                  {hasSubmenu && (
                    <Collapse in={openSubmenus[item.text]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.submenu.map((sub) => (
                          <ListItemButton
                            key={sub.text}
                            sx={{
                              pl: 6,
                              bgcolor: location.pathname.startsWith(sub.path)
                                ? theme.palette.secondary.light
                                : "transparent",
                              "&:hover": { bgcolor: theme.palette.action.hover },
                              borderRadius: 1,
                              my: 0.2,
                            }}
                            onClick={() => {
                              navigate(sub.path);
                              toggleDrawer(false)();
                            }}
                          >
                            <ListItemIcon>{sub.icon}</ListItemIcon>
                            <ListItemText primary={sub.text} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              );
            })}
          </List>

          <Divider sx={{ bgcolor: theme.palette.divider, my: 1 }} />

          {/* ===== Secondary List ===== */}
          {/* <List>
            {SecondaryList.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      toggleDrawer(false)();
                    }}
                    sx={{
                      bgcolor: isActive ? theme.palette.primary.main : "transparent",
                      color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
                      "& .MuiListItemIcon-root": {
                        color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
                      },
                      "&:hover": {
                        bgcolor: isActive ? theme.palette.primary.dark : theme.palette.action.hover,
                      },
                      borderRadius: 1,
                      my: 0.2,
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List> */}
        </Box>

        {/* ===== Footer ===== */}
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <ThemeToggle />
          <LanguageToggle />

          <Typography variant="body2" color="textSecondary">
            {t("sidebar.copyright")}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 1, borderRadius: 2 }}
            onClick={() => dispatch(logout())}
          >
            {t("sidebar.logout")}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );


  return (
    <div>
      {/* IconButton لفتح الـ Drawer */}
      <Box sx={{ mr: 2, }}>
        <IconButton
          size="large"
          onClick={toggleDrawer(true)} // لما تضغط، تفتح الـ Drawer
          sx={{ color: theme.palette.text.primary }} // لون الأيقونة يتغير حسب theme (dark/light)
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* الـ Drawer نفسه */}
      <Drawer
        open={open} // يتحكم بظهور الـ Drawer حسب state
        onClose={toggleDrawer(false)} // يغلق الـ Drawer لما تضغط خارج المنطقة
      >
        {/* محتوى الـ Drawer: header + main list + secondary list + footer */}
        {DrawerList}
      </Drawer>
    </div>
  );

}
