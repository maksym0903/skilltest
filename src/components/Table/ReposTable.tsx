"use client";

import * as React from "react";
import { Stack, Box, Typography, IconButton, Chip, Card, CardContent, TextField } from "@mui/material";
import { GridColDef, GridRenderCellParams, DataGrid } from "@mui/x-data-grid";
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import Link from "next/link";
import CreateNewRepo from "../Buttons/CreateNewRepo";
import { Repository } from "@/services/types";

interface ReposTableProps {
  rows: Repository[];
  onViewClick?: (repo: Repository) => void;
  onEditClick?: (repo: Repository) => void;
  onDeleteClick?: (repo: Repository) => void;
}

export default function ReposTable({ rows, onViewClick, onEditClick, onDeleteClick }: ReposTableProps) {
  const [query, setQuery] = React.useState("");

  // Create a permanent creation order map (1 = first created repo)
  const creationOrderMap = React.useMemo(() => {
    const sortedByCreation = [...rows].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB; // Oldest first for numbering
    });
    
    const orderMap = new Map<string, number>();
    sortedByCreation.forEach((row, index) => {
      orderMap.set(row.id, index + 1);
    });
    return orderMap;
  }, [rows]);

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

  const handleViewClick = (repo: Repository) => {
    if (onViewClick) {
      onViewClick(repo);
    } else {
      // Use URL from API response
      if (repo.url) {
        window.open(repo.url, '_blank', 'noopener,noreferrer');
      } else {
        console.error('No URL available for this repository:', repo);
        alert('Repository URL not available');
      }
    }
  };


  const handleDeleteClick = (repo: Repository) => {
    if (onDeleteClick) {
      onDeleteClick(repo);
    } else {
      console.log('Delete clicked for repository:', repo);
    }
  };

  const columns: GridColDef<Repository>[] = [
    {
      field: "no",
      headerName: "No",
      width: 60,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<Repository>) => (
        <Typography variant="body2" color="text.secondary">
          {creationOrderMap.get(params.row.id) || '-'}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 0,
      minWidth: 0,
      maxWidth: 0,
      sortable: true,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: "name",
      headerName: "Repository",
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<Repository>) => (
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          py: 0.5 
        }}>
          <Link 
            href={`/repos/${params.row.id}`}
            style={{ 
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <Typography 
              variant="body2" 
              fontWeight={600} 
              sx={{ 
                lineHeight: 1.2,
                color: "primary.main",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline"
                }
              }}
            >
              {params.row.name}
            </Typography>
          </Link>
          {params.row.description && (
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
              {params.row.description}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams<Repository>) => (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          height: "100%",
          py: 0.5 
        }}>
          <Chip
            label={params.value}
            size="small"
            color={
              params.value === "active" ? "success" :
              params.value === "inactive" ? "warning" :
              params.value === "archived" ? "default" : "info"
            }
            variant="outlined"
          />
        </Box>
      ),
    },
    {
      field: "visibility",
      headerName: "Visibility",
      width: 120,
      renderCell: (params: GridRenderCellParams<Repository>) => (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          height: "100%",
          py: 0.5 
        }}>
          <Chip
            label={params.value === 1 ? "Private" : "Public"}
            size="small"
            color={params.value === 1 ? "error" : "success"}
            variant="outlined"
          />
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Repository>) => (
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
    <CreateNewRepo 
      size="small" 
      fullWidth={{ xs: true, sm: false }}
      sx={{ 
        minWidth: { xs: "auto", sm: 140 },
        maxWidth: { sm: 160 }
      }}
    />
  );

  return (
    <Card>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mb: 2 }} alignItems={{ xs: "stretch", sm: "center" }}>
          <TextField
            placeholder="Search repositories…"
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
              sorting: { sortModel: [{ field: "createdAt", sort: "asc" }] },
              columns: {
                columnVisibilityModel: {
                  createdAt: false,
                },
              },
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
