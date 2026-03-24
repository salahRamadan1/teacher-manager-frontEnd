import { Box } from '@mui/material';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>

            <Box sx={{ flexGrow: 1 }}>
                <TopBar />
                <Box component="main" sx={{ p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}