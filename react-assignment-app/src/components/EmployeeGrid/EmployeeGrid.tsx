import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridPaginationModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FlagIcon from "@mui/icons-material/Flag";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./EmployeeGrid.module.css";
import { Employee } from "../../types/Employee";

interface Props {
  employees: Employee[];
  onRowClick: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onFlag: (employee: Employee) => void;
}

const EmployeeGrid: React.FC<Props> = ({
  employees,
  onRowClick,
  onEdit,
  onDelete,
  onFlag,
}) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });

  const columns: GridColDef<Employee>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "age",
      headerName: "Age",
      width: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "class",
      headerName: "Class",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "attendance",
      headerName: "Attendance (%)",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params: { value: number }) =>
        typeof params.value === "number" ? `${params.value}%` : "",
    },
    {
      field: "subjects",
      headerName: "Subjects",
      flex: 2,
      minWidth: 250,
      headerAlign: "center",
      align: "left",
      valueFormatter: (params: { value: Employee["subjects"] }) =>
        Array.isArray(params.value) ? params.value.join(", ") : "",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(params.row);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Flag">
            <IconButton
              size="small"
              color="warning"
              onClick={(e) => {
                e.stopPropagation();
                onFlag(params.row);
              }}
            >
              <FlagIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(params.row.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div className={styles.gridContainer}>
      <DataGrid
        rows={employees}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        onRowClick={(params: GridRowParams<Employee>) => onRowClick(params.row)}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        className={styles.grid}
        density="comfortable"
      />
    </div>
  );
};

export default EmployeeGrid;
