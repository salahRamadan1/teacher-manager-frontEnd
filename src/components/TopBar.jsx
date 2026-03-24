import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SchoolIcon from "@mui/icons-material/School";
import ThemeToggle from './ThemeToggle';
import { useTheme } from "@mui/material/styles";
import SideBar from './SideBar';
import LanguageToggle from './LanguageSwitcher';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
    const theme = useTheme();
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor:
                    theme.palette.mode === "light"
                        ? theme.palette.secondary.main
                        : theme.palette.secondary.paper, // background حسب mode
                color:
                    theme.palette.mode === "light"
                        ? theme.palette.common.white
                        : theme.palette.text.primary, // لون الخط حسب mode
            }}
        >
            <Container maxWidth="">
                <Toolbar disableGutters>
                    {/* Menu Icon */}

                    <SideBar />
                    {/* Title */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: "center",
                            marginX: "auto",
                            textAlign: "center"
                        }}
                    >
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                flexGrow: 1,
                                color: theme.palette.text.contrastText, // اللون حسب theme
                            }}
                        >
                            Teacher Manager
                        </Typography>
                    </Box>

                    {/* Right side: ThemeToggle + Avatar */}
                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ThemeToggle />
                        <LanguageToggle />
               
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>

    );
}
export default ResponsiveAppBar;
