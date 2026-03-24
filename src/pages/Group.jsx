import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  TextField,
  Avatar,
  Chip,
  Paper,
  Stack,
  Badge,
  useMediaQuery,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import BtnAddGroup from '../components/group/HomeGroups/BtnHomeGroups/BtnAddGroup';
import BtnSearchGroup from '../components/group/HomeGroups/BtnHomeGroups/BtnSearchGroup';
import GroupDataIsTableOrDisk from '../components/group/HomeGroups/GroupsView/GroupDataIsTableOrDisk';
import PaginationGroups from '../components/group/HomeGroups/BtnHomeGroups/PaginationGroups';
import GradeFilterGroup from '../components/group/HomeGroups/BtnHomeGroups/GradeFilterGroup';
import SortGroup from '../components/group/HomeGroups/BtnHomeGroups/SortGroup';
import BtnResetGroup from '../components/group/HomeGroups/BtnHomeGroups/BtnResetGroup';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../features/groups/groupAction';
import { useSearchParams } from 'react-router-dom';
import { buildGroupsUrl } from '../utils/studentsUrl/buildUrl';
import { useTranslation } from "react-i18next";
export default function GroupHybrid() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const {
    groups,
    loadingGetGroup,

    totalPages,
  } = useSelector((state) => state.group);

  useEffect(() => {
    const url = buildGroupsUrl(searchParams);
    dispatch(getGroups(url));
  }, [dispatch, searchParams]);
  return (
    < >

      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GroupIcon sx={{ color: "#fff", fontSize: 28 }} />
        </Box>

        <Box>
          <Typography variant="h4" fontWeight={800}>
            {t("groups.title")}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t("groups.subtitle")}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
        }}

      >

        <BtnSearchGroup disabled={loadingGetGroup} />
        <SortGroup disabled={loadingGetGroup} />
        <GradeFilterGroup disabled={loadingGetGroup} />
        <BtnResetGroup disabled={loadingGetGroup} />
      </Box>
      <BtnAddGroup disabled={loadingGetGroup} />

      <GroupDataIsTableOrDisk />
      {
        groups.length > 0 &&
        <PaginationGroups disabled={loadingGetGroup}
          totalPages={totalPages}
        />
      }
    </ >
  );
}
