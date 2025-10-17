"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  Stack,
  TextField,
  Box,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridValidRowModel,
  GridToolbarQuickFilter,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";

interface DataTableProps<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  rows: T[];
  columns: GridColDef<T>[];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  additionalActions?: React.ReactNode;
  height?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  checkboxSelection?: boolean;
  disableColumnMenu?: boolean;
  density?: "compact" | "standard" | "comfortable";
  columnVisibilityModel?: Record<string, boolean>;
}

function Toolbar() {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1 }}>
      <GridToolbarQuickFilter />
      <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Stack>
    </Stack>
  );
}

export default function DataTable<T extends GridValidRowModel = GridValidRowModel>({
  rows,
  columns,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  additionalActions,
  height = 560,
  pageSize = 10,
  sortField,
  sortDirection = "asc",
  checkboxSelection = true,
  disableColumnMenu = true,
  density = "standard",
  columnVisibilityModel,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState(searchValue);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      return Object.values(row as Record<string, unknown>).some((value) =>
        String(value).toLowerCase().includes(q)
      );
    });
  }, [rows, query]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearchChange?.(value);
  };

  const handleRowClick = (params: GridRowParams<T>, event: React.MouseEvent) => {
    // Prevent row selection on click
    event?.stopPropagation();
    return false;
  };

  return (
    <Card>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mb: 2 }} alignItems={{ xs: "stretch", sm: "center" }}>
          <TextField
            placeholder={searchPlaceholder}
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
          height, 
          width: "100%",
          "& .MuiDataGrid-root": {
            border: "none",
          }
        }}>
          <DataGrid
            rows={filtered}
            columns={columns}
            checkboxSelection={checkboxSelection}
            disableColumnMenu={disableColumnMenu}
            density={density}
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            onRowClick={handleRowClick}
            columnHeaderHeight={52}
            rowHeight={52}
            autoHeight={false}
            disableVirtualization={false}
            disableColumnResize={true}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize } },
              sorting: sortField ? { sortModel: [{ field: sortField, sort: sortDirection }] } : undefined,
              columns: columnVisibilityModel ? { columnVisibilityModel } : undefined,
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            slots={{ toolbar: Toolbar }}
            sx={{
              "& .MuiDataGrid-row": {
                cursor: "default",
                display: "table-row !important",
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
              "& .MuiDataGrid-columnHeadersRow": {
                display: "table-row !important",
              },
              "& .MuiDataGrid-columnHeader": {
                display: "table-cell !important",
                width: "auto !important",
              },
              "& .MuiDataGrid-cell": {
                display: "table-cell !important",
                width: "auto !important",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
