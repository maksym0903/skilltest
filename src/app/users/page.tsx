"use client";

import * as React from "react";
import {
  Stack, Typography, Grid, Card, CardContent, Box
} from "@mui/material";
import {
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  VerifiedUser as VerifiedIcon,
} from "@mui/icons-material";
import UsersTable from "@/components/Table/UsersTable";

// Mock users data
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Admin",
    status: "Active",
    department: "Engineering",
    lastLogin: "2024-01-15T11:30:00Z",
    joinDate: "2023-08-12T00:00:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Manager",
    status: "Active",
    department: "Marketing",
    lastLogin: "2024-01-14T09:15:00Z",
    joinDate: "2023-06-20T00:00:00Z",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Developer",
    status: "Active",
    department: "Engineering",
    lastLogin: "2024-01-15T08:45:00Z",
    joinDate: "2023-09-10T00:00:00Z",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "Developer",
    status: "Inactive",
    department: "Engineering",
    lastLogin: "2024-01-10T16:20:00Z",
    joinDate: "2023-07-15T00:00:00Z",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@company.com",
    role: "Analyst",
    status: "Active",
    department: "Data Science",
    lastLogin: "2024-01-15T14:30:00Z",
    joinDate: "2023-11-05T00:00:00Z",
  },
];

export default function UsersPage() {

  const activeUsers = users.filter((user) => user.status === "Active").length;
  const adminUsers = users.filter((user) => user.role === "Admin").length;
  const totalUsers = users.length;

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Users
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <PersonIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {totalUsers}
                  </Typography>
                  <Typography color="text.secondary">Total Users</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <VerifiedIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {activeUsers}
                  </Typography>
                  <Typography color="text.secondary">Active Users</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <AdminIcon color="error" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {adminUsers}
                  </Typography>
                  <Typography color="text.secondary">Admin Users</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table Component */}
      <UsersTable rows={users} />
    </Stack>
  );
}