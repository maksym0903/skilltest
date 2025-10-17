"use client";

import * as React from "react";
import { Stack, Box, IconButton, Chip, Card, CardContent, TextField, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams, DataGrid } from "@mui/x-data-grid";
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { Environment } from "@/services/types";

// Type for transformed environment data used in the table
interface TransformedEnvironment {
  id: string;
  name: string;
  app: string;
  branch: string;
  subdomain: string;
  status: string;
  version: string;
  domain: string;
  created_at: string;
  originalData: Environment;
}

interface EnvironmentTableProps {
  rows: TransformedEnvironment[];
  onRefresh?: () => void;
  onDeleteClick?: (environment: Environment) => void;
}

export default function EnvironmentTable({ rows, onDeleteClick }: EnvironmentTableProps) {
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

  const handleViewClick = (env: TransformedEnvironment) => {
    console.log('View clicked for environment:', env);
    // Add view functionality here - could open a modal or navigate to details page
    if (env.originalData.amplify_app_url) {
      window.open(env.originalData.amplify_app_url, '_blank');
    }
  };


  const handleDeleteClick = (env: TransformedEnvironment) => {
    if (onDeleteClick) {
      onDeleteClick(env.originalData);
    } else {
      console.log('Delete clicked for environment:', env);
    }
  };

  const columns: GridColDef<TransformedEnvironment>[] = [
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
      headerName: "Name", 
      flex: 1, 
      minWidth: 120, 
      hideable: false,
      renderCell: (params: GridRenderCellParams<TransformedEnvironment>) => (
        <Link 
          href={`/environment/${params.row.id}`}
          style={{ 
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <Typography 
            variant="body2" 
            color="primary.main"
            sx={{ 
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline"
              }
            }}
          >
            {params.value}
          </Typography>
        </Link>
      ),
    },
    { field: "branch", headerName: "Branch", flex: 0.8, minWidth: 100, hideable: true },
    { field: "subdomain", headerName: "Subdomain", flex: 1, minWidth: 120, hideable: true },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      minWidth: 80,
      hideable: false,
      renderCell: (params: GridRenderCellParams<TransformedEnvironment>) => (
        <Chip
          label={params.value}
          color={
            params.value === "Active" ? "success" :
            params.value === "Inactive" ? "default" :
            params.value === "Maintenance" ? "warning" : "error"
          }
          size="small"
        />
      ),
    },
    { field: "version", headerName: "Version", flex: 0.6, minWidth: 80, hideable: true },
    { field: "domain", headerName: "Domain", flex: 1, minWidth: 120, hideable: true },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      minWidth: 100,
      sortable: false,
      filterable: false,
      hideable: false,
      renderCell: (params: GridRenderCellParams<TransformedEnvironment>) => (
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


  return (
    <Card>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mb: 2 }} alignItems={{ xs: "stretch", sm: "center" }}>
          <TextField
            placeholder="Search environments…"
            value={query}
            onChange={handleSearchChange}
            sx={{ 
              width: { xs: "100%", sm: "auto", md: 360 },
              flex: { sm: 1, md: "none" },
              minWidth: 200,
              maxWidth: { sm: "100%", md: 360 }
            }}
            size="small"
          />
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
