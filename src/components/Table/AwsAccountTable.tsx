"use client";

import * as React from "react";
import { Stack, Box, Typography, IconButton, Chip, Card, CardContent, TextField } from "@mui/material";
import { GridColDef, GridRenderCellParams, DataGrid } from "@mui/x-data-grid";
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Cloud as CloudIcon,
} from "@mui/icons-material";
import CreateNewAwsAccount from "../Buttons/CreateNewAwsAccount";
import { AwsAccount } from "@/services/types";

interface AwsAccountTableProps {
  rows: AwsAccount[];
  onViewClick?: (account: AwsAccount) => void;
  onEditClick?: (account: AwsAccount) => void;
  onDeleteClick?: (account: AwsAccount) => void;
}

export default function AwsAccountTable({ rows, onViewClick, onEditClick, onDeleteClick }: AwsAccountTableProps) {
  const [query, setQuery] = React.useState("");

  const filteredRows = React.useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      return Object.values(row as unknown as Record<string, unknown>).some((value) =>
        String(value).toLowerCase().includes(q)
      );
    });
  }, [rows, query]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleViewClick = (account: AwsAccount) => {
    if (onViewClick) {
      onViewClick(account);
    } else {
      console.log('View clicked for AWS account:', account);
    }
  };


  const handleDeleteClick = (account: AwsAccount) => {
    if (onDeleteClick) {
      onDeleteClick(account);
    } else {
      console.log('Delete clicked for AWS account:', account);
    }
  };

  const columns: GridColDef[] = [
    { 
      field: "no", 
      headerName: "No", 
      width: 60, 
      hideable: false,
      sortable: false,
      valueGetter: (value, row) => {
        const index = filteredRows.findIndex(r => r.id === row.id);
        return index !== -1 ? index + 1 : '';
      }
    },
    { 
      field: "name", 
      headerName: "Account Name", 
      width: 200,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<AwsAccount>) => (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1,
          height: "100%",
          py: 0.5 
        }}>
          <CloudIcon sx={{ color: "primary.main", fontSize: 20 }} />
          <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    { 
      field: "accountId", 
      headerName: "Account ID", 
      width: 180,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<AwsAccount>) => (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          height: "100%",
          py: 0.5 
        }}>
          <Typography variant="body2" sx={{ 
            fontFamily: "monospace",
            fontSize: "0.875rem",
          }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    { field: "region", headerName: "Region", width: 140 },
    {
      field: "registrationMethod",
      headerName: "Registration Method",
      width: 160,
      renderCell: (params: GridRenderCellParams<AwsAccount>) => (
        <Chip
          label={params.value === "access-key" ? "Access Key" : "SSO"}
          color={params.value === "sso" ? "primary" : "secondary"}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "permissions",
      headerName: "Permission Level",
      width: 140,
      renderCell: (params: GridRenderCellParams<AwsAccount>) => (
        <Chip
          label={params.value?.level || "Unknown"}
          color={
            params.value?.level === "admin" ? "error" :
            params.value?.level === "read-only" ? "success" :
            params.value?.level === "limited" ? "warning" : "default"
          }
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "created_at",
      headerName: "Created",
      width: 120,
      hideable: true,
      renderCell: (params: GridRenderCellParams<AwsAccount>) => {
        if (!params || !params.value) return "N/A";
        try {
          const date = new Date(params.value as string);
          return (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              height: "100%",
              py: 0.5 
            }}>
              <Typography variant="body2">
                {date.toLocaleDateString()}
              </Typography>
            </Box>
          );
        } catch (error) {
          console.error('Date parsing error:', error, 'Value:', params.value);
          return (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              height: "100%",
              py: 0.5 
            }}>
              <Typography variant="body2" color="error">
                Invalid Date
              </Typography>
            </Box>
          );
        }
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<AwsAccount>) => (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          height: "100%",
          width: "100%"
        }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton 
              size="small" 
              color="primary" 
              title="View"
              onClick={(e) => {
                e.stopPropagation();
                handleViewClick(params.row);
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
            {/* <IconButton 
              size="small" 
              color="secondary" 
              title="Edit"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(params.row);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton> */}
            <IconButton 
              size="small" 
              color="error" 
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(params.row);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      ),
    },
  ];

  const additionalActions = (
    <CreateNewAwsAccount 
      size="small" 
      fullWidth={{ xs: true, sm: false }}
      sx={{ 
        minWidth: { xs: "auto", sm: 180 },
        maxWidth: { sm: 200 }
      }}
    />
  );

  return (
    <Card>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mb: 2 }} alignItems={{ xs: "stretch", sm: "center" }}>
          <TextField
            placeholder="Search AWS accounts…"
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
              sorting: { sortModel: [{ field: "created_at", sort: "desc" }] },
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
