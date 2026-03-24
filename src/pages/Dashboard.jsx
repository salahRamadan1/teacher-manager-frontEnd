import { Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import ThemeToggle from "../components/ThemeToggle";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";

export default function Dashboard() {
    const dispatch = useDispatch();

    return (
        <>
           
         
            
            <Typography variant="h4">Dashboard</Typography>
            
        </>
    );
}
