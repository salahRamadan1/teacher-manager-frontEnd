import React, { useEffect } from 'react'
import DisplaySessionDetails from '../components/session/sessionDetails/DisplaySessionDetails'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSession } from '../features/session/sessionAction';
import SessionPageSkeleton from '../components/session/sessionDetails/SessionPageSkeleton';

import { Alert, Slide, Box } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import InfoIcon from "@mui/icons-material/Info";
export default function SessionDetails() {
    const dispatch = useDispatch();
    const {
        loadingGetSessionById,
        errorGetSessionById,
        errorGetSessionByIdNetWork,
    } = useSelector((state) => state.session);
    const { id } = useParams();
    // Fetch Group Data When Dialog Opens
    // ==============================
    useEffect(() => {
        dispatch(getSession(id));

    }, [id, dispatch]);

    // ==============================
    // Populate Form When Group Data Arrives
    // ==============================
    useEffect(() => {
        // console.log(GroupById.studentIds);

    }, [id]);
    // Convert 24h time → 12h AM/PM
    return (
        <div>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
                {errorGetSessionById && (
                    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
                        <Alert
                            severity="error"
                            icon={<ErrorOutlineIcon />}
                            sx={{ fontWeight: 500 }}
                        >
                            {errorGetSessionById}
                        </Alert>
                    </Slide>
                )}

                {errorGetSessionByIdNetWork && (
                    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
                        <Alert
                            severity="warning"
                            icon={<WifiOffIcon />}
                            sx={{ fontWeight: 500 }}
                        >
                            {errorGetSessionByIdNetWork}
                        </Alert>
                    </Slide>
                )}
            </Box>
            {loadingGetSessionById ?
                <SessionPageSkeleton /> :
                <DisplaySessionDetails />
            }

        </div>
    )
}
