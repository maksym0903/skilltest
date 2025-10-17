"use client";

import * as React from "react";
import { Stack, Box, Typography, Button, IconButton, Avatar, Chip, Card, CardContent, TextField } from "@mui/material";
import { GridColDef, GridRenderCellParams, DataGrid } from "@mui/x-data-grid";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  AdminPanelSettings as AdminIcon,
  VerifiedUser as VerifiedIcon,
  Add as AddIcon,
} from "@mui/icons-material";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  lastLogin: string;
  joinDate: string;
};

interface UsersTableProps {
  rows: User[];
}

export default function UsersTable({ rows }: UsersTableProps) {
  const [query, setQuery] = React.useState("");

  const filteredRows = React.useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      return Object.values(row as Record<string, unknown>).some((value) =>
        String(value).toLowerCase().includes(q)
      );
    });
  }, [rows, query]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleEditClick = (user: User) => {
    console.log('Edit clicked for user:', user);
    // Add edit functionality here
  };

  const handleDeleteClick = (user: User) => {
    console.log('Delete clicked for user:', user);
    // Add delete functionality here
  };

  const handleMoreClick = (user: User) => {
    console.log('More clicked for user:', user);
    // Add more options functionality here
  };

  const columns: GridColDef<User>[] = [
    {
      field: "name",
      headerName: "User",
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {params.row.name.split(" ").map((n: string) => n[0]).join("")}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === "Admin" ? "error" :
            params.value === "Manager" ? "warning" :
            params.value === "Developer" ? "primary" : "default"
          }
          icon={
            params.value === "Admin" ? <AdminIcon /> :
            params.value === "Manager" ? <VerifiedIcon /> : undefined
          }
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === "Active" ? "success" : "default"}
          variant={params.value === "Active" ? "filled" : "outlined"}
        />
      ),
    },
    { field: "department", headerName: "Department", width: 120 },
    {
      field: "lastLogin",
      headerName: "Last Login",
      width: 150,
      valueFormatter: (params: { value: unknown }) => {
        if (!params || !params.value) return "N/A";
        try {
          return new Date(params.value as string).toLocaleDateString();
        } catch {
          return "Invalid Date";
        }
      },
    },
    {
      field: "joinDate",
      headerName: "Join Date",
      width: 150,
      valueFormatter: (params: { value: unknown }) => {
        if (!params || !params.value) return "N/A";
        try {
          return new Date(params.value as string).toLocaleDateString();
        } catch {
          return "Invalid Date";
        }
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          height: "100%",
          width: "100%"
        }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton 
              size="small" 
              title="Edit"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(params.row);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              title="Delete" 
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(params.row);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              title="More"
              onClick={(e) => {
                e.stopPropagation();
                handleMoreClick(params.row);
              }}
            >
              <MoreIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      ),
    },
  ];

  const additionalActions = (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      size="small"
      sx={{ 
        minWidth: { xs: "auto", sm: 140 },
        maxWidth: { sm: 160 }
      }}
    >
      Add User
    </Button>
  );

  return (
    <Card>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mb: 2 }} alignItems={{ xs: "stretch", sm: "center" }}>
          <TextField
            placeholder="Search users…"
            value={query}
            onChange={handleSearchChange}
            sx={{ 
              width: { xs: "100%", sm: "auto", md: 360 },
              flex: { sm: 1, md: "none" },
              minWidth: 200,
              maxWidth: { sm: additionalActions ? "calc(100% - 300px)" : "100%", md: 360 }
            }}
            size="small"
          />
          {additionalActions && (
            <Box sx={{ flexShrink: 0, width: { xs: "100%", sm: "auto" } }}>
              {additionalActions}
            </Box>
          )}
        </Stack>

        <Box sx={{ height: 560, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            checkboxSelection={false}
            disableColumnMenu={true}
            density="standard"
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
              sorting: { sortModel: [{ field: "name", sort: "asc" }] },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            sx={{
              "& .MuiDataGrid-row": {
                cursor: "default",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                "&.Mui-selected": {
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
