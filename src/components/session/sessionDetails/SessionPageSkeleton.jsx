import React from "react";
import { Container, Box, Stack, Paper, Typography, Grid, Card, CardContent, Avatar, Divider, LinearProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button } from "@mui/material";
import { School, Person, AccessTime, Edit, Delete, ArrowBack } from "@mui/icons-material";
import Skeleton from "@mui/material/Skeleton";

export default function SessionPageSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} aligns="center" sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" width={100} height={40} />
        </Stack>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Box>
            <Skeleton variant="text" width="60%" height={50} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" height={30} sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: 'wrap' }}>
              <Skeleton variant="rectangular" width={100} height={30} />
              <Skeleton variant="rectangular" width={120} height={30} />
            </Stack>
          </Box>
        </Paper>
      </Box>

      {/* Pricing Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 3 }} />
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} sx={{ mb: 2 }}>
          {[...Array(4)].map((_, i) => (
            <Grid  size={{ xs: 6, sm: 6, md: 3 }}key={i}>
              <Skeleton variant="text" width="60%" height={25} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={35} />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Attendance Section */}
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} sx={{ mb: 2 }} >
        {[...Array(4)].map((_, i) => (
          <Grid  size={{ xs: 6, sm: 6, md: 3 }}key={i}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', aligns: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                  <Skeleton variant="text" width="50%" height={20} />
                </Box>
                <Skeleton variant="text" width="40%" height={30} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={15} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Session Statistics */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Skeleton variant="text" width="50%" height={25} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={10} sx={{ mb: 1, borderRadius: 5 }} />
        <Skeleton variant="text" width="30%" height={15} />
      </Paper>

      {/* Students Table */}
      <Paper elevation={2} sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width="40%" height={25} sx={{ mb: 2 }} />
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[...Array(4)].map((_, i) => (
                  <TableCell key={i}><Skeleton variant="text" width="80%" /></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(4)].map((_, j) => (
                    <TableCell key={j}><Skeleton variant="text" width="90%" /></TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Skeleton variant="rectangular" width={150} height={50} />
        <Skeleton variant="rectangular" width={150} height={50} />
      </Box>
    </Container>
  );
}
