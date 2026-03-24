import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Button,

} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { NavLink, useParams } from 'react-router-dom';
import HeaderGroupDeTails from '../components/group/groupDetails/GroupDetailsViews/HeaderGroupDeTails';
import FetchSessionAtGroup from '../components/session/sessonAtGroupDetails/FetchSessionAtGroup';
import { useDispatch } from 'react-redux';
import { getGroupById } from '../features/groups/groupAction';
import { useTranslation } from "react-i18next";
import i18next from 'i18next';
export default function GroupDetails() {
    const { t } = useTranslation();
    const { id } = useParams();
    const dispatch = useDispatch();

    // Fetch Group Data When Dialog Opens
    // ==============================
    useEffect(() => {
        dispatch(getGroupById(id));
    }, [id, dispatch]);
    const isAr = i18next.language?.startsWith("ar");
    return (
        < >
            {/* ---------------- Back Button ---------------- */}
            <Box sx={{ mb: 3 }}>
                <NavLink to="/Group" style={{ textDecoration: "none" }}>
                    <Button

                        startIcon={isAr ? null : <ArrowBackIcon />} endIcon={isAr ? <ArrowBackIcon /> : null}
                        variant="text"
                        sx={(theme) => ({
                            color:
                                theme.palette.mode === "dark"
                                    ? theme.palette.grey[300]
                                    : theme.palette.grey[800],
                            "&:hover": {
                                bgcolor:
                                    theme.palette.mode === "dark"
                                        ? "rgba(255,255,255,0.08)"
                                        : "rgba(0,0,0,0.05)",
                            },
                        })}
                    >
                        <span style={{ marginInlineEnd: "10px" }}>
                            {t("groups.backToGroups")}</span>
                    </Button>
                </NavLink>
            </Box>

            {/* ---------------- Hero Header ---------------- */}
            <HeaderGroupDeTails />
            <FetchSessionAtGroup />
        </ >
    );
}
