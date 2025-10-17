"use client";

import * as React from "react";
import { Stack, Box, Typography, Button, IconButton, CircularProgress, Tabs, Tab, Card, CardContent, TextField, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { GridColDef, GridRenderCellParams, DataGrid } from "@mui/x-data-grid";
import {
  RocketLaunch as RocketIcon,
  Delete as DeleteIcon,
  Domain as DomainIcon,
} from "@mui/icons-material";
import CreateNewApp from "../Buttons/CreateNewApp";
import AdoptApp from "../Buttons/AdoptApp";
import Link from "next/link";
import AppsService from "@/services/apps";
import DeleteConfirmationDialog from "../Modal/DeleteConfirmationDialog";
import DeployConfirmationDialog from "../Modal/DeployConfirmationDialog";
import DomainAssociation from "../Slide/DomainAssociation";

import type { Application } from "@/services/types";

interface AppsTableProps {
  rows: Application[];
  onAdoptClick: () => void;
  onRowsUpdate?: (updatedRows: Application[]) => void;
}

export default function AppsTable({ rows, onAdoptClick, onRowsUpdate }: AppsTableProps) {
  const currentRowsRef = React.useRef(rows);
  const [activeTab, setActiveTab] = React.useState(0);
  const [query, setQuery] = React.useState("");
  
  // Domain menu state
  const [domainMenuAnchor, setDomainMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [selectedAppForDomain, setSelectedAppForDomain] = React.useState<string | null>(null);
  
  // Slide over state
  const [slideOverOpen, setSlideOverOpen] = React.useState(false);
  const [selectedDomain, setSelectedDomain] = React.useState<string | null>(null);
  
  // Mock domain data
  const mockDomains = [
    { id: '1', name: 'example.com', status: 'available' },
    { id: '2', name: 'myapp.com', status: 'available' },
    { id: '3', name: 'company.com', status: 'available' },
    { id: '4', name: 'business.net', status: 'available' },
    { id: '5', name: 'webapp.io', status: 'available' },
  ];
  
  // Update ref when rows change
  React.useEffect(() => {
    currentRowsRef.current = rows;
  }, [rows]);

  // Create a permanent creation order map (1 = first created app)
  const creationOrderMap = React.useMemo(() => {
    const sortedByCreation = [...rows].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeA - timeB; // Oldest first for numbering
    });
    
    const orderMap = new Map<string, number>();
    sortedByCreation.forEach((row, index) => {
      orderMap.set(row.id, index + 1);
    });
    return orderMap;
  }, [rows]);

  // Filter rows based on active tab
  const filteredRows = React.useMemo(() => {
    let filtered = rows;
    switch (activeTab) {
      case 1: // New apps
        filtered = rows.filter(row => row.creation_type === 'create_new' || !row.creation_type);
        break;
      case 2: // Adopted apps
        filtered = rows.filter(row => row.creation_type === 'adopt_app');
        break;
      default: // All apps
        filtered = rows;
    }

    // Apply search filter
    if (!query.trim()) return filtered;
    const q = query.trim().toLowerCase();
    return filtered.filter((row) => {
      const searchableFields = [
        row.name,
        row.description,
        row.org,
        row.repo_name,
        row.environment?.name,
        row.status,
        row.deployed_url
      ];
      return searchableFields.some((value) =>
        value && String(value).toLowerCase().includes(q)
      );
    });
  }, [rows, activeTab, query]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Domain menu handlers
  const handleDomainClick = (event: React.MouseEvent<HTMLElement>, appId: string) => {
    setDomainMenuAnchor(event.currentTarget);
    setSelectedAppForDomain(appId);
  };

  const handleDomainMenuClose = () => {
    setDomainMenuAnchor(null);
    setSelectedAppForDomain(null);
  };

  const handleDomainSelect = (domainName: string) => {
    console.log('Domain selected:', domainName, 'for app:', selectedAppForDomain);
    setSelectedDomain(domainName);
    handleDomainMenuClose();
    setSlideOverOpen(true);
  };

  const handleSlideOverClose = () => {
    setSlideOverOpen(false);
    setSelectedDomain(null);
    setSelectedAppForDomain(null);
  };

  const handleDomainAssociate = (config: {
    domain: string;
    appId: string;
    environmentMappings: Array<{
      environmentId: string;
      environmentName: string;
      amplifyBranch: string;
      subdomainPrefix: string;
      error?: string;
    }>;
    certificateType: 'amplify' | 'custom';
    certificateArn?: string;
    enablePreviewSubdomains: boolean;
    previewPattern?: string;
  }) => {
    console.log('Associating domain:', config);
    // Domain association logic will be implemented here
    // You can call your API here with the complete configuration
  };

  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean;
    app: Application | null;
    isLoading: boolean;
  }>({
    open: false,
    app: null,
    isLoading: false,
  });

  const [deployDialog, setDeployDialog] = React.useState<{
    open: boolean;
    app: Application | null;
    isLoading: boolean;
  }>({
    open: false,
    app: null,
    isLoading: false,
  });

  const handleDeleteClick = (app: Application) => {
    console.log("Delete clicked for app:", app);
    setDeleteDialog({
      open: true,
      app,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.app) return;

    setDeleteDialog(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await AppsService.deleteApp(deleteDialog.app.id);
      if (response.success) {
        setDeleteDialog({ open: false, app: null, isLoading: false });
        window.location.reload();
      } else {
        alert("Failed to delete app. Please try again.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete app. Please try again.");
    } finally {
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, app: null, isLoading: false });
  };

  const handleDeployClick = (app: Application) => {
    console.log("Deploy clicked for app:", app);
    setDeployDialog({
      open: true,
      app,
      isLoading: false,
    });
  };

  const handleDeployConfirm = async () => {
    if (!deployDialog.app) return;

    setDeployDialog(prev => ({ ...prev, isLoading: true }));

    try {
      const app = deployDialog.app;
      
      // Extract required IDs from the app data
      const appId = app.id;
      const environmentId = app.env_id ? String(app.env_id) : null;
      const repoId = app.repo_id ? String(app.repo_id) : null;

      console.log("Deploy validation - App data:", {
        appId,
        environmentId,
        repoId,
        environment: app.environment?.name,
        repository: app.repo_name,
        fullApp: app
      });

      // Validate required data
      if (!environmentId) {
        throw new Error("No environment found for this app. Please create an environment first.");
      }
      if (!repoId) {
        throw new Error("No repository found for this app. Please create a repository first.");
      }

      // Call the deploy API with proper parameters
      const response = await AppsService.deployApp(
        appId,
        environmentId,
        repoId,
        { buildCommand: "npm run build", baseDirectory: "dist" },
        { NODE_ENV: "production", API_URL: "https://api.myapp.com" },
        { "X-Custom-Header": "value" }
      );

      if (response.success) {
        const deploymentData = response.data;
        
        // Close the dialog
        setDeployDialog({ open: false, app: null, isLoading: false });
        
        // Update the app status to building and add URL if provided
        const updatedRows = rows.map(row => 
          row.id === appId 
            ? { 
                ...row, 
                status: 'building',
                deployed_url: deploymentData?.deployed_url || ''
              }
            : row
        );
        
        if (onRowsUpdate) {
          onRowsUpdate(updatedRows);
        }
        
        setTimeout(() => {
          const finalUpdatedRows = currentRowsRef.current.map(row => 
            row.id === appId 
              ? { ...row, status: 'active' }
              : row
          );
          if (onRowsUpdate) {
            onRowsUpdate(finalUpdatedRows);
          }
        }, 150000);
      } else {
        throw new Error(response.message || "Deployment failed");
      }
    } catch (error) {
      console.error("Deployment failed:", error);
      alert(`Deployment failed: ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setDeployDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeployCancel = () => {
    setDeployDialog({ open: false, app: null, isLoading: false });
  };

  const columns: GridColDef[] = [
    {
      field: "no",
      headerName: "No",
      width: 60,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" color="text.secondary">
          {creationOrderMap.get(params.row.id) || '-'}
        </Typography>
      ),
    },
    {
      field: "created_at",
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
      headerName: "App Name",
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
          <Link 
            href={`/apps/${params.row.id}`}
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
              {params.row.name || `App ${params.row.id}`}
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
    // { field: "organization", headerName: "Organization", width: 140 },
    {
      field: "repo_name",
      headerName: "Repository",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%"
          }}>
            <Typography variant="body2" color={params.value ? "text.primary" : "text.secondary"}>
              {params.value || "-"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "environment",
      headerName: "Environment",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => {
        const envName = params.row.environment?.name;
        return (
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%"
          }}>
            <Typography variant="body2" color={envName ? "text.primary" : "text.secondary"}>
              {envName || "-"}
            </Typography>
          </Box>
        );
      },
    },
    // {
    //   field: "type",
    //   headerName: "Type",
    //   width: 100,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params: GridRenderCellParams) => {
    //     const creationType = params.row.creation_type || params.value;
    //     return (
    //       <Box sx={{
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "center",
    //         height: "100%",
    //         width: "100%"
    //       }}>
    //         <Typography 
    //           variant="body2" 
    //           sx={{
    //             color: creationType === 'adopt_app' ? 'secondary.main' : 'primary.main',
    //             fontWeight: 600,
    //             textTransform: 'capitalize'
    //           }}
    //         >
    //           {creationType === 'adopt_app' ? 'Adopted' : 'New'}
    //         </Typography>
    //       </Box>
    //     );
    //   },
    // },
    { field: "status", headerName: "Status", width: 100, align: "center", headerAlign: "center" },
    {
      field: "deployed_url",
      headerName: "URL",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) {
          return (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              height: "100%",
              py: 0.5 
            }}>
              <Typography variant="body2" color="text.secondary">
                Not deployed
              </Typography>
            </Box>
          );
        }
        return (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            height: "100%",
            py: 0.5 
          }}>
            <Button
              component="a"
              href={params.value}
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              size="small"
              sx={{
                textTransform: "none",
                color: "primary.main",
                textDecoration: "underline",
                minWidth: "auto",
                p: 0.5,
                fontSize: "0.875rem",
                fontWeight: 400,
                justifyContent: "flex-start",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
              }}
            >
              Click here
            </Button>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
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
            {/* <IconButton 
              size="small" 
              title="Open"
              color="success"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenClick(params.row);
              }}
            >
              <ExternalIcon fontSize="small" />
            </IconButton> */}
            {/* <IconButton 
              size="small" 
              title="Edit"
              color="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(params.row);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton> */}
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
    {
      field: "deploy",
      headerName: "Deploy",
      width: 100,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => {
        // Check if repository and environment exist
        const hasRepository = params.row.repo_id && params.row.repo_name;
        const hasEnvironment = params.row.env_id && params.row.environment?.name;
        const canDeploy = hasRepository && hasEnvironment;
        
        return (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            height: "100%",
            width: "100%"
          }}>
            {params.row.status === 'building' ? (
              <CircularProgress size={20} color="primary" />
            ) : (
              <IconButton 
                size="small" 
                title={canDeploy ? "Deploy" : "Create repository and environment first"}
                color="primary"
                disabled={!canDeploy}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeployClick(params.row);
                }}
              >
                <RocketIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      },
    },
    {
      field: "domain",
      headerName: "Domain",
      width: 80,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            height: "100%",
            width: "100%"
          }}>
            <IconButton 
              size="small" 
              title="Manage Domain"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleDomainClick(e, params.row.id);
              }}
            >
              <DomainIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const additionalActions = (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
      <CreateNewApp 
        size="small" 
        fullWidth={{ xs: true, sm: false }}
        sx={{ 
          minWidth: { xs: "auto", sm: 140 },
          maxWidth: { sm: 160 }
        }}
      />
      <AdoptApp 
        size="small" 
        fullWidth={{ xs: true, sm: false }}
        sx={{ 
          minWidth: { xs: "auto", sm: 120 },
          maxWidth: { sm: 140 }
        }}
        onClick={onAdoptClick}
      />
    </Stack>
  );

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
            }
          }}
        >
          <Tab 
            label={`All (${rows.length})`} 
            sx={{ minWidth: 100 }}
          />
          <Tab 
            label={`New (${rows.filter(row => row.creation_type === 'create_new' || !row.creation_type).length})`} 
            sx={{ minWidth: 100 }}
          />
          <Tab 
            label={`Adopt (${rows.filter(row => row.creation_type === 'adopt_app').length})`} 
            sx={{ minWidth: 100 }}
          />
        </Tabs>
      </Box>
      
      <Card sx={{ width: "100%", minWidth: "100%" }}>
        <CardContent sx={{ width: "100%", minWidth: "100%" }}>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mb: 2 }} alignItems={{ xs: "stretch", sm: "center" }}>
            <TextField
              placeholder="Search apps…"
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
              checkboxSelection={false}
              disableColumnMenu={true}
              density="standard"
              disableRowSelectionOnClick
              hideFooterSelectedRowCount
              autoPageSize={false}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
                sorting: { sortModel: [{ field: "created_at", sort: "asc" }] },
                columns: {
                  columnVisibilityModel: {
                    created_at: false,
                  },
                },
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
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone and will permanently remove the application and all its associated data."
        itemName={deleteDialog.app?.name}
        isLoading={deleteDialog.isLoading}
      />

      {/* Deploy Confirmation Dialog */}
      <DeployConfirmationDialog
        open={deployDialog.open}
        onClose={handleDeployCancel}
        onConfirm={handleDeployConfirm}
        appName={deployDialog.app?.name || ""}
        environmentName={deployDialog.app?.environment?.name}
        repositoryName={deployDialog.app?.repo_name}
        isLoading={deployDialog.isLoading}
      />

      {/* Domain Selection Menu */}
      <Menu
        anchorEl={domainMenuAnchor}
        open={Boolean(domainMenuAnchor)}
        onClose={handleDomainMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {mockDomains.map((domain) => (
          <MenuItem 
            key={domain.id} 
            onClick={() => handleDomainSelect(domain.name)}
            sx={{ minWidth: 200 }}
          >
            <ListItemIcon>
              <DomainIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary={domain.name}
              secondary={domain.status}
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Domain Configuration Slide Over */}
      <DomainAssociation
        open={slideOverOpen}
        onClose={handleSlideOverClose}
        selectedDomain={selectedDomain}
        selectedAppId={selectedAppForDomain}
        appName={rows.find(row => row.id === selectedAppForDomain)?.name || null}
        onAssociate={handleDomainAssociate}
      />
    </>
  );
}
