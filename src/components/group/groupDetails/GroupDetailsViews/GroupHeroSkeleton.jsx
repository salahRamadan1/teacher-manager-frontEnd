import React from "react";
import { Card, CardContent, Grid, Box, Stack, Skeleton, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const GroupHeroSkeleton = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        mb: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: '#fff',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          {/* Header Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <Skeleton variant="circular" width={70} height={70} />
              <Box>
                <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
          </Box>

          {/* Quick Stats */}
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {[...Array(8)].map((_, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }}key={idx}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 1.5, borderRadius: 1.5 }}>
                  <Skeleton variant="text" width="60%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="40%" height={28} />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Students Section */}
          <Box sx={{ mt: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GroupHeroSkeleton;
