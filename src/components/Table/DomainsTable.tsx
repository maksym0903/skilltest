"use client";

import * as React from "react";
import { Stack, Box, Typography, IconButton, Chip, Card, CardContent, TextField } from "@mui/material";
import { GridColDef, GridRenderCellParams, DataGrid } from "@mui/x-data-grid";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import CreateNewDomain from "../Buttons/CreateNewDomain";
import DeleteConfirmationDialog from "../Modal/DeleteConfirmationDialog";
import type { Domain } from "@/services/types";
import DomainsService from "@/services/domains";

interface DomainsTableProps {
  rows: Domain[];
}

export default function DomainsTable({ rows }: DomainsTableProps) {
  const [query, setQuery] = React.useState("");
  
  // Debug logging
  React.useEffect(() => {
    console.log('DomainsTable received rows:', rows);
    console.log('Rows count:', rows.length);
    if (rows.length > 0) {
      console.log('Sample row:', rows[0]);
      console.log('All row IDs:', rows.map(row => row.id));
    }
  }, [rows]);
  
  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean;
    domain: Domain | null;
    isLoading: boolean;
  }>({
    open: false,
    domain: null,
    isLoading: false,
  });

  // Filter rows based on search query
  const filteredRows = React.useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const searchableFields = [
        row.domain,
        row.name, // Keep for backward compatibility
        row.status,
        row.accountId,
        row.accountID, // Keep for backward compatibility
        row.hosted_zone_id,
        row.app_id,
        row.certificate_arn
      ];
      return searchableFields.some((value) =>
        value && String(value).toLowerCase().includes(q)
      );
    });
  }, [rows, query]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleDeleteClick = (domain: Domain) => {
    console.log("Delete clicked for domain:", domain);
    setDeleteDialog({
      open: true,
      domain,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.domain || !deleteDialog.domain.id) return;

    setDeleteDialog(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await DomainsService.deleteDomain(deleteDialog.domain.id);
      if (response.success) {
        setDeleteDialog({ open: false, domain: null, isLoading: false });
        window.location.reload();
      } else {
        alert("Failed to delete domain. Please try again.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete domain. Please try again.");
    } finally {
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, domain: null, isLoading: false });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'pending':
        return <ScheduleIcon color="warning" fontSize="small" />;
      case 'inactive':
        return <WarningIcon color="error" fontSize="small" />;
      default:
        return <CheckCircleIcon color="disabled" fontSize="small" />;
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: "domain",
      headerName: "Domain Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          height: "100%",
          py: 0.5 
        }}>
          <Typography 
            variant="body2" 
            fontWeight={600} 
            sx={{ 
              lineHeight: 1.2,
              color: "primary.main",
            }}
          >
            {params.row.domain}
          </Typography>
        </Box>
      ),
    },
    {
      field: "accountId",
      headerName: "Account ID",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          width: "100%"
        }}>
          <Typography variant="body2" color={params.value ? "text.primary" : "text.secondary"}>
            {params.value || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "hosted_zone_id",
      headerName: "Hosted Zone ID",
      flex: 1,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          width: "100%"
        }}>
          <Typography variant="body2" color={params.value ? "text.primary" : "text.secondary"} sx={{ fontFamily: 'monospace' }}>
            {params.value || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          gap: 0.5
        }}>
          {getStatusIcon(params.value)}
          <Chip
            label={params.value}
            size="small"
            color={getStatusColor(params.value)}
            variant="outlined"
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>
      ),
    },
    {
      field: "available",
      headerName: "Available",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%"
        }}>
          <Chip
            label={params.value ? "Yes" : "No"}
            size="small"
            color={params.value ? "success" : "error"}
            variant="filled"
          />
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          height: "100%",
          width: "100%"
        }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton 
              size="small" 
              title="Edit"
              color="secondary"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement edit functionality
                console.log("Edit domain:", params.row);
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
          </Stack>
        </Box>
      ),
    },
  ];

  const additionalActions = (
    <CreateNewDomain 
      size="small" 
      fullWidth={{ xs: true, sm: false }}
      sx={{ 
        minWidth: { xs: "auto", sm: 140 },
        maxWidth: { sm: 160 }
      }}
    />
  );

  return (
    <>
      <Card sx={{ width: "100%", minWidth: "100%" }}>
        <CardContent sx={{ width: "100%", minWidth: "100%" }}>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mb: 2 }} alignItems={{ xs: "stretch", sm: "center" }}>
            <TextField
              placeholder="Search domains…"
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

          <Box sx={{ 
            height: 560, 
            width: "100%",
            minWidth: "100%",
            overflow: "hidden"
          }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              getRowId={(row) => row.id}
              checkboxSelection={false}
              disableColumnMenu={true}
              density="standard"
              disableRowSelectionOnClick
              hideFooterSelectedRowCount
              autoPageSize={false}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
                sorting: { sortModel: [{ field: "domain", sort: "asc" }] },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              sx={{
                width: "100%",
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
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Domain"
        message="Are you sure you want to delete this domain? This action cannot be undone and will permanently remove the domain configuration."
        itemName={deleteDialog.domain?.name}
        isLoading={deleteDialog.isLoading}
      />
    </>
  );
}

