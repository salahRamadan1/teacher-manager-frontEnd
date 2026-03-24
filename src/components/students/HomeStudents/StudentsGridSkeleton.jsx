import {
  Grid,
  Card,
  CardContent,
  Box,
  Skeleton,
  Stack,
} from "@mui/material";

const StudentsGridSkeleton = ({ count = 6 }) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardContent>
              {/* ==============================
                  Name + Grade
              ============================== */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="rounded" width={70} height={24} />
              </Stack>

              {/* ==============================
                  Student Info
              ============================== */}
              <Stack spacing={1.2} sx={{ mt: 2 }}>
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="rounded" width={120} height={22} />
              </Stack>

              {/* ==============================
                  Actions
              ============================== */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 3 }}
              >
                <Skeleton variant="rounded" width={60} height={32} />

                <Stack direction="row" spacing={1}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="circular" width={32} height={32} />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StudentsGridSkeleton;
