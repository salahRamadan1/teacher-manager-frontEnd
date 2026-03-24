import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';

const SessionsTableSkeleton = ({ rows = 5 }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        {/* ========================= */}
        {/* Table Header Skeleton */}
        {/* ========================= */}
        <TableHead>
          <TableRow>
            {Array.from({ length: 7 }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" width="80%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* ========================= */}
        {/* Table Body Skeleton */}
        {/* ========================= */}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {/* Description */}
              <TableCell>
                <Skeleton variant="text" width="90%" />
              </TableCell>

              {/* Date & Time */}
              <TableCell>
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="50%" />
              </TableCell>

              {/* Place */}
              <TableCell>
                <Skeleton variant="text" width="60%" />
              </TableCell>

              {/* Attendance */}
              <TableCell>
                <Skeleton variant="text" width="30%" />
              </TableCell>

              {/* Present */}
              <TableCell>
                <Skeleton variant="rectangular" width={30} height={20} />
              </TableCell>

              {/* Absent */}
              <TableCell>
                <Skeleton variant="rectangular" width={30} height={20} />
              </TableCell>

              {/* Action Button */}
              <TableCell>
                <Skeleton variant="rectangular" width={60} height={30} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SessionsTableSkeleton;
