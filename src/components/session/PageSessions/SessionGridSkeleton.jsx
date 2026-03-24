import { Grid, Card, CardContent, Skeleton, Stack, Divider, useTheme } from "@mui/material";

const SessionGridSkeleton = ({ count = 6 }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {Array.from(new Array(count)).map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Card
            sx={{
              height: "100%",
              bgcolor: theme.palette.mode === "dark" ? "#2c2c2c" : "#fff",
            }}
          >
            <CardContent>
              {/* Header */}
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Skeleton
                    variant="circular"
                    width={20}
                    height={20}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width={80}
                    height={20}
                    animation="wave"
                  />
                </Stack>
                <Skeleton
                  variant="rectangular"
                  width={40}
                  height={24}
                  animation="wave"
                />
              </Stack>

              {/* Date */}
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <Skeleton variant="circular" width={16} height={16} animation="wave" />
                <Skeleton variant="text" width={60} height={16} animation="wave" />
              </Stack>

              {/* Description */}
              <Skeleton variant="text" width="100%" height={40} sx={{ mb: 2 }} animation="wave" />

              <Divider sx={{ mb: 2 }} />

              {/* Prices */}
              <Skeleton variant="text" width="60%" height={16} sx={{ mb: 0.5 }} animation="wave" />
              <Skeleton variant="text" width="50%" height={16} sx={{ mb: 2 }} animation="wave" />

              <Divider sx={{ mb: 2 }} />

              {/* Totals */}
              <Skeleton variant="text" width="70%" height={16} sx={{ mb: 0.5 }} animation="wave" />
              <Skeleton variant="text" width="70%" height={16} sx={{ mb: 2 }} animation="wave" />

              {/* Attendance */}
              <Stack spacing={1}>
                <Skeleton variant="text" width="60%" height={16} animation="wave" />
                <Skeleton variant="text" width="60%" height={16} animation="wave" />
                <Skeleton variant="text" width="60%" height={16} animation="wave" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SessionGridSkeleton;
