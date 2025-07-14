import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import HamburgerMenu from "../components/HamburgerMenu/HamburgerMenu";
import EmployeeGrid from "../components/EmployeeGrid/EmployeeGrid";
import EmployeeTileView from "../components/EmployeeTileView/EmployeeTileView";
import EmployeeDetails from "../components/EmployeeDetails/EmployeeDetails";
import "./Dashboard.css";

import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Snackbar,
  Alert,
  Fab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const ITEMS_PER_ROW = 3;

const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      id
      name
      age
      class
      attendance
      subjects
      flagged
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $name: String!
    $age: Int!
    $class: String!
    $attendance: Float!
    $subjects: [String!]!
    
  ) {
    addEmployee(
      name: $name
      age: $age
      class: $class
      attendance: $attendance
      subjects: $subjects
      flagged: $flagged
    ) {
      id
      name
      age
      class
      attendance
      subjects
      flagged
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!
    $name: String
    $age: Int
    $class: String
    $subjects: [String]
    $attendance: Float
    $flagged: Boolean
  ) {
    updateEmployee(
      id: $id
      name: $name
      age: $age
      class: $class
      subjects: $subjects
      attendance: $attendance
      flagged: $flagged
    ) {
      id
      name
      age
      class
      attendance
      subjects
      flagged
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

const Dashboard: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES);
  const [addEmployee] = useMutation(ADD_EMPLOYEE);
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE);

  const [selected, setSelected] = useState<any>(null);
  const [tileView, setTileView] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [editForm, setEditForm] = useState<any>({
    id: "",
    name: "",
    age: 0,
    class: "",
    attendance: 0,
    subjects: [],
    flagged: false,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p>Error loading employees: {error.message}</p>;

  const employees = data?.employees ?? [];

  const rows = [];
  for (let i = 0; i < employees.length; i += ITEMS_PER_ROW) {
    rows.push(employees.slice(i, i + ITEMS_PER_ROW));
  }

  // Open Edit Form with employee data
  const openEdit = (employee: any) => {
    setEditForm({ ...employee });
    setIsEditing(true);
    setIsAdding(false);
    setSelected(employee);
  };

  // Handle subjects input change (comma separated string to array)
  const handleSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arr = e.target.value.split(",").map((s) => s.trim());
    setEditForm((prev: any) => ({ ...prev, subjects: arr }));
  };

  // Save edits
  const handleSave = async () => {
    try {
      await updateEmployee({
        variables: {
          id: editForm.id,
          name: editForm.name,
          age: Number(editForm.age),
          class: editForm.class,
          attendance: Number(editForm.attendance),
          subjects: editForm.subjects,
          flagged: editForm.flagged,
        },
      });
      await refetch();
      setIsEditing(false);
      setSelected(null);
      setSnackbarMessage("Employee updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMessage("Failed to update: " + err.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Add new employee
  const handleAdd = async () => {
    try {
      await addEmployee({
        variables: {
          name: editForm.name,
          age: Number(editForm.age),
          class: editForm.class,
          attendance: Number(editForm.attendance),
          subjects: editForm.subjects,
          flagged: editForm.flagged,
        },
      });
      await refetch();
      setIsAdding(false);
      setEditForm({
        id: "",
        name: "",
        age: 0,
        class: "",
        attendance: 0,
        subjects: [],
        flagged: false,
      });
      setSnackbarMessage("Employee added successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMessage("Failed to add: " + err.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteClick = (emp: any) => {
    setEmployeeToDelete(emp);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEmployee({ variables: { id: employeeToDelete.id } });
      if (selected?.id === employeeToDelete.id) setSelected(null);
      await refetch();
      setSnackbarMessage("Deleted successfully");
      setSnackbarSeverity("success");
    } catch (err: any) {
      setSnackbarMessage("Failed to delete: " + err.message);
      setSnackbarSeverity("error");
    } finally {
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
      setSnackbarOpen(true);
    }
  };

  const handleFlagToggle = async (emp: any) => {
    try {
      await updateEmployee({
        variables: { id: emp.id, flagged: !emp.flagged },
      });
      await refetch();
    } catch (err: any) {
      setSnackbarMessage("Failed to toggle flag: " + err.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <HamburgerMenu />
      <div className="dashboardContainer">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setTileView(!tileView)}
          sx={{ mb: 3 }}
        >
          Toggle {tileView ? "Grid" : "Tile"} View
        </Button>

        {tileView ? (
          rows.map((row, idx) => (
            <div className="tileRow" key={idx}>
              {row.map((emp: any) => (
                <div className="tileItem" key={emp.id}>
                  <EmployeeTileView
                    employee={emp}
                    onClick={() => setSelected(emp)}
                    onEdit={() => openEdit(emp)}
                    onDelete={() => handleDeleteClick(emp)}
                    onFlag={() => handleFlagToggle(emp)}
                  />
                </div>
              ))}
            </div>
          ))
        ) : (
          <EmployeeGrid
            employees={employees}
            onRowClick={setSelected}
            onEdit={openEdit}
            onDelete={handleDeleteClick}
            onFlag={handleFlagToggle}
          />
        )}

        {/* Floating Add Button */}
        <Fab
          color="secondary"
          sx={{ position: "fixed", bottom: 30, right: 30 }}
          onClick={() => {
            setEditForm({
              id: "",
              name: "",
              age: 0,
              class: "",
              attendance: 0,
              subjects: [],
              flagged: false,
            });
            setIsAdding(true);
            setIsEditing(false);
            setSelected(null);
          }}
          aria-label="add"
        >
          <AddIcon />
        </Fab>

        {/* Add/Edit Dialog */}
        <Dialog
          open={!!selected || isAdding}
          onClose={() => {
            setSelected(null);
            setIsEditing(false);
            setIsAdding(false);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {isAdding
              ? "Add New Employee"
              : isEditing
              ? "Edit Employee"
              : "Employee Details"}
          </DialogTitle>
          <DialogContent>
            {selected && !isEditing && !isAdding ? (
              <>
                <EmployeeDetails employee={selected} />
                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Button
                    variant="contained"
                    onClick={() => openEdit(selected)}
                  >
                    Edit
                  </Button>
                </Box>
              </>
            ) : (
              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  label="Name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                />
                <TextField
                  label="Age"
                  type="number"
                  value={editForm.age}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      age: Number(e.target.value) || 0,
                    })
                  }
                  required
                />
                <TextField
                  label="Class"
                  value={editForm.class}
                  onChange={(e) =>
                    setEditForm({ ...editForm, class: e.target.value })
                  }
                  required
                />
                <TextField
                  label="Attendance"
                  type="number"
                  inputProps={{ step: 0.1, min: 0, max: 100 }}
                  value={editForm.attendance}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      attendance: Number(e.target.value) || 0,
                    })
                  }
                  required
                />
                <TextField
                  label="Subjects (comma separated)"
                  value={editForm.subjects.join(", ")}
                  onChange={handleSubjectsChange}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editForm.flagged}
                      onChange={(e) =>
                        setEditForm({ ...editForm, flagged: e.target.checked })
                      }
                    />
                  }
                  label="Flagged"
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelected(null);
                      setIsEditing(false);
                      setIsAdding(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={isAdding ? handleAdd : handleSave}
                    disabled={
                      !editForm.name ||
                      !editForm.class ||
                      editForm.age <= 0 ||
                      editForm.attendance < 0
                    }
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          aria-labelledby="delete-confirm-dialog-title"
          aria-describedby="delete-confirm-dialog-description"
        >
          <DialogTitle id="delete-confirm-dialog-title">
            Confirm Deletion
          </DialogTitle>
          <DialogContent dividers id="delete-confirm-dialog-description">
            Are you sure you want to delete{" "}
            <strong>{employeeToDelete?.name}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default Dashboard;
