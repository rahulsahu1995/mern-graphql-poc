import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql, useApolloClient } from "@apollo/client";
import HamburgerMenu from "../../components/HamburgerMenu/HamburgerMenu";
import EmployeeGrid from "../../components/EmployeeGrid/EmployeeGrid";
import EmployeeTileView from "../../components/EmployeeTileView/EmployeeTileView";
import EmployeeDetails from "../../components/EmployeeDetails/EmployeeDetails";
import "./Dashboard.css";

import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Snackbar,
  Alert,
  Fab,
} from "@mui/material";
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
    $class: String
    $attendance: Float
    $subjects: [String!]!
    $flagged: Boolean
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
    $subjects: [String!]
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
  const client = useApolloClient();

  const { loading, error, data } = useQuery(GET_EMPLOYEES);
  const [addEmployee] = useMutation(ADD_EMPLOYEE);
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE);

  // New state for role-based control
  const [role, setRole] = useState<string | null>(null);

  // Read role from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const [selected, setSelected] = useState<any>(null);
  const [tileView, setTileView] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [editForm, setEditForm] = useState<any>({
    id: "",
    name: "",
    age: "",
    class: "",
    attendance: "",
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

  const openEdit = (employee: any) => {
    if (role !== "admin") return; // Only admin can edit
    setEditForm({
      ...employee,
      age: employee.age?.toString() ?? "",
      attendance: employee.attendance?.toString() ?? "",
    });
    setIsEditing(true);
    setIsAdding(false);
    setSelected(employee);
  };

  const cleanSubjects = (subjects: any[]) => {
    return (subjects ?? []).filter(
      (s) => typeof s === "string" && s.trim() !== ""
    );
  };

  const handleSave = async () => {
    try {
      const { data: mutationData } = await updateEmployee({
        variables: {
          id: editForm.id,
          name: editForm.name,
          age: parseInt(editForm.age, 10),
          class: editForm.class,
          attendance: parseFloat(editForm.attendance),
          subjects: cleanSubjects(editForm.subjects),
          flagged: editForm.flagged,
        },
      });

      if (mutationData?.updateEmployee) {
        const existing = client.readQuery({ query: GET_EMPLOYEES });
        if (existing) {
          client.writeQuery({
            query: GET_EMPLOYEES,
            data: {
              employees: existing.employees.map((emp: any) =>
                emp.id === mutationData.updateEmployee.id
                  ? mutationData.updateEmployee
                  : emp
              ),
            },
          });
        }
      }

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

  const handleAdd = async () => {
    try {
      const { data: mutationData } = await addEmployee({
        variables: {
          name: editForm.name,
          age: parseInt(editForm.age, 10),
          class: editForm.class,
          attendance: parseFloat(editForm.attendance),
          subjects: cleanSubjects(editForm.subjects),
          flagged: editForm.flagged,
        },
      });

      if (mutationData?.addEmployee) {
        const existing = client.readQuery({ query: GET_EMPLOYEES });
        if (existing) {
          client.writeQuery({
            query: GET_EMPLOYEES,
            data: {
              employees: [...existing.employees, mutationData.addEmployee],
            },
          });
        }
      }

      setIsAdding(false);
      setEditForm({
        id: "",
        name: "",
        age: "",
        class: "",
        attendance: "",
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
    if (role !== "admin") return; // only admin can delete
    setEmployeeToDelete(emp);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEmployee({ variables: { id: employeeToDelete.id } });

      const existing = client.readQuery({ query: GET_EMPLOYEES });
      if (existing) {
        client.writeQuery({
          query: GET_EMPLOYEES,
          data: {
            employees: existing.employees.filter(
              (emp: any) => emp.id !== employeeToDelete.id
            ),
          },
        });
      }

      if (selected?.id === employeeToDelete.id) setSelected(null);
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
    if (role !== "admin") return; // only admin can flag
    try {
      const { data: mutationData } = await updateEmployee({
        variables: { id: emp.id, flagged: !emp.flagged },
      });

      if (mutationData?.updateEmployee) {
        const existing = client.readQuery({ query: GET_EMPLOYEES });
        if (existing) {
          client.writeQuery({
            query: GET_EMPLOYEES,
            data: {
              employees: existing.employees.map((e: any) =>
                e.id === mutationData.updateEmployee.id
                  ? mutationData.updateEmployee
                  : e
              ),
            },
          });
        }
      }
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
        <div className="toggleButtonWrapper">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setTileView(!tileView)}
          >
            Toggle {tileView ? "Grid" : "Tile"} View
          </Button>
        </div>

        {tileView ? (
          rows.map((row, idx) => (
            <div className="tileRow" key={idx}>
              {row.map((emp: any) => (
                <div className="tileItem" key={emp.id}>
                  <EmployeeTileView
                    employee={emp}
                    onClick={() => setSelected(emp)}
                    onEdit={role === "admin" ? () => openEdit(emp) : undefined}
                    onDelete={
                      role === "admin"
                        ? () => handleDeleteClick(emp)
                        : undefined
                    }
                    onFlag={
                      role === "admin" ? () => handleFlagToggle(emp) : undefined
                    }
                  />
                </div>
              ))}
            </div>
          ))
        ) : (
          <EmployeeGrid
            employees={employees}
            onRowClick={setSelected}
            onEdit={role === "admin" ? openEdit : undefined}
            onDelete={
              role === "admin"
                ? (id) => {
                    const emp = employees.find((e: any) => e.id === id);
                    if (emp) handleDeleteClick(emp);
                  }
                : undefined
            }
            onFlag={role === "admin" ? handleFlagToggle : undefined}
          />
        )}

        {/* Floating Add Button - only show if admin */}
        {role === "admin" && (
          <Fab
            color="secondary"
            sx={{ position: "fixed", bottom: 30, right: 30 }}
            onClick={() => {
              setEditForm({
                id: "",
                name: "",
                age: "",
                class: "",
                attendance: "",
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
        )}

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
            {isAdding ? "Add New Employee" : isEditing ? "Edit Employee" : " "}
          </DialogTitle>
          <DialogContent>
            {selected && !isEditing && !isAdding ? (
              <>
                <EmployeeDetails employee={selected} />
                {role === "admin" && (
                  <Box sx={{ mt: 2, textAlign: "right" }}>
                    <Button
                      variant="contained"
                      onClick={() => openEdit(selected)}
                    >
                      Edit
                    </Button>
                  </Box>
                )}
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
                {/* Age without spinner */}
                <TextField
                  label="Age"
                  type="text"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 3,
                    style: { MozAppearance: "textfield" }, // Firefox spinner removal
                  }}
                  value={editForm.age}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^[0-9]{0,3}$/.test(val)) {
                      setEditForm({ ...editForm, age: val });
                    }
                  }}
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
                {/* Attendance without spinner */}
                <TextField
                  label="Attendance (%)"
                  type="text"
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9]*\\.?[0-9]*",
                    maxLength: 6,
                    style: { MozAppearance: "textfield" },
                  }}
                  value={editForm.attendance}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^[0-9]*\.?[0-9]{0,2}$/.test(val)) {
                      setEditForm({ ...editForm, attendance: val });
                    }
                  }}
                  required
                />
                <TextField
                  label="Subjects (comma separated)"
                  value={editForm.subjects.join(", ")}
                  onChange={(e) => {
                    const arr = e.target.value.split(",").map((s) => s.trim());
                    setEditForm((prev: any) => ({ ...prev, subjects: arr }));
                  }}
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
                      editForm.age === "" ||
                      editForm.attendance === ""
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
