import React from "react";
import { Grid, Card, CardContent, CardActions, Box, Skeleton, Paper, Stack, Chip, Avatar } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

const GroupsSkeleton = ({ count = 3 }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {[...Array(count)].map((_, idx) => (
        <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 2.5,
              border: `1px solid ${
                theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"
              }`,
            }}
          >
            {/* Card Content Skeleton */}
            <CardContent sx={{ flex: 1 }}>
              {/* Header */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box flex={1}>
                  <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="50%" height={20} />
                </Box>
              </Box>

              {/* Schedule Chip */}
              <Skeleton variant="rectangular" width="50%" height={30} sx={{ borderRadius: 1, mb: 2 }} />

              {/* Payment Chip */}
              <Skeleton variant="rectangular" width="40%" height={28} sx={{ borderRadius: 1, mb: 2 }} />

              {/* Students Box */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                  border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"}`,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="circular" width={44} height={44} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={18} />
                    <Skeleton variant="text" width="40%" height={18} />
                  </Box>
                  <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                </Stack>
              </Paper>
            </CardContent>

            {/* Card Actions Skeleton */}
            <CardActions sx={{ justifyContent: "space-between", px: 2.5, pb: 2, pt: 1, gap: 1 }}>
              <Skeleton variant="rectangular" width="45%" height={36} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="45%" height={36} sx={{ borderRadius: 1 }} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default GroupsSkeleton;
