import { Box, Pagination, Stack, useTheme } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom';

export default function PaginationSessions({ disabled, totalPages, pageNum }) {
    // ==============================
    // Theme & URL Search Params
    // ==============================
    const theme = useTheme(); // Access MUI theme for colors and mode
    const [searchParams, setSearchParams] = useSearchParams(); // Manage URL query params

    // Get current page from URL params, default to 1
    const page = Number(searchParams.get("page")) || 1;

    // ==============================
    // Pagination Change Handler
    // ==============================
    // Update "page" param in URL when user clicks a pagination item
    const handleChange = (_, value) => {
        setSearchParams(prev => {
            prev.set("page", value);
            return prev;
        });
    };

    return (
        <div>
            {/* ==============================
            Pagination Container
            Centered Box with margin-top
        ============================== */}
            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Stack spacing={2}>
                    {/* ==============================
                    Material-UI Pagination Component
                    - disabled: whether user can interact
                    - count: total number of pages
                    - page: current page
                    - onChange: handles page click
                    - color & shape styling
                ============================== */}
                    <Pagination
                        disabled={disabled}
                        count={totalPages}
                        page={page || pageNum} // fallback if page is undefined
                        onChange={handleChange}
                        color="primary"
                        shape="rounded"
                        sx={{
                            // ==============================
                            // Pagination Items Styling
                            // Changes color based on theme
                            // ==============================
                            "& .MuiPaginationItem-root": {
                                color: theme.palette.text.primary, // text color based on light/dark mode
                            },
                            "& .Mui-selected": {
                                backgroundColor: theme.palette.primary.main, // selected item background
                                color: theme.palette.primary.contrastText, // text color of selected item
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.dark, // hover effect
                                },
                            },
                        }}
                    />
                </Stack>
            </Box>
        </div>
    );

}
