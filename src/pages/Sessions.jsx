import React, { useEffect } from 'react'
import SessionGrid from '../components/session/PageSessions/SessionGrid'
import { useDispatch, useSelector } from 'react-redux';
import { getSessionsTeacher } from '../features/session/sessionAction';
import SessionGridSkeleton from '../components/session/PageSessions/SessionGridSkeleton';
import { useSearchParams } from 'react-router-dom';
import { buildSessionUrl } from '../utils/studentsUrl/buildUrl';
import SearchSessions from '../components/session/PageSessions/BtnSessionsPage/SearchSessions';
import GrideFilterSessions from '../components/session/PageSessions/BtnSessionsPage/GrideFilterSessions';
import PaginationStudents from '../components/students/Btnstudents/PaginationStudents';
import SortSession from '../components/session/PageSessions/BtnSessionsPage/SortSession';
import ResetSessionValue from '../components/session/PageSessions/BtnSessionsPage/ResetSessionValue';
import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Sessions() {
    const { t } = useTranslation();

    const [searchParams] = useSearchParams();
    const { loading, sessions } = useSelector((state) => state.session);
    const dispatch = useDispatch();


    useEffect(() => {
        // Build API URL based on current query parameters
        const url = buildSessionUrl(searchParams);

        // Dispatch Redux action to fetch students
        dispatch(getSessionsTeacher(url));

    }, [dispatch, searchParams]);

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Filters Row */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                mb={3}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
            >
                <SearchSessions disabled={loading} />
                <GrideFilterSessions disabled={loading} />
                <SortSession disabled={loading} />
                <ResetSessionValue disabled={loading} />
            </Stack>

            {/* Session Grid */}
            <Box sx={{ minHeight: 400 }}>
                {loading ? (
                    <SessionGridSkeleton count={6} />
                ) : (
                    <SessionGrid sessions={sessions.session} loading={loading} />
                )}
            </Box>

            {/* Pagination */}
            {sessions.session?.length > 0 && (
                <Box mt={3} display="flex" justifyContent="center">
                    <PaginationStudents
                        disabled={loading}
                        totalPages={sessions.totalPages}
                    />
                </Box>
            )}
        </Box>
    )
}
