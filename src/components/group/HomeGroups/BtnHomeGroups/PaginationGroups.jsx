import { Box, Pagination, Stack, useTheme } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom';

export default function PaginationGroups({ disabled, totalPages }) {
    // ==============================
    // Pagination Component
    // ==============================

    // MUI theme hook to access colors
    const theme = useTheme();

    // URL search params for pagination
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1; // Current page from URL, default 1

    // Handle page change
    const handleChange = (_, value) => {
        setSearchParams(prev => {
            prev.set("page", value); // Update page in URL query params
            return prev;
        });
    };

    return (
        <div>
            <Box
                sx={{
                    mt: 2,                // Margin top
                    display: "flex",      // Flex container
                    justifyContent: "center", // Center pagination horizontally
                }}
            >
                <Stack spacing={2}>
                    {/* MUI Pagination component */}
                    <Pagination
                        disabled={disabled}  // Optional: disable during loading
                        count={totalPages}   // Total number of pages
                        page={page}          // Controlled current page
                        onChange={handleChange} // Trigger handleChange on page click
                        color="primary"
                        shape="rounded"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                color: theme.palette.text.primary, // Text color for pagination items
                            },
                            "& .Mui-selected": {
                                backgroundColor: theme.palette.primary.main, // Selected page background
                                color: theme.palette.primary.contrastText,   // Selected page text color
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.dark, // Hover effect for selected page
                                },
                            },
                        }}
                    />
                </Stack>
            </Box>
        </div>
    );

}
