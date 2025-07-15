// src/pages/Register/Register.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import styles from "./Register.module.css";
import { registerValidation } from "./constants";

const REGISTER = gql`
  mutation Register($username: String!, $password: String!, $role: String!) {
    register(username: $username, password: $password, role: $role) {
      token
      role
    }
  }
`;

type FormData = {
  username: string;
  password: string;
  role: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
      role: "employee",
    },
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [registerMutation, { error, loading, data }] = useMutation(REGISTER, {
    onCompleted: () => {
      setSnackbarOpen(true); // show snackbar on success
      setTimeout(() => {
        navigate("/login"); // navigate after showing snackbar
      }, 3000);
    },
    onError: () => {
      // error handled in useEffect
    },
  });

  // Map server errors to specific form fields
  useEffect(() => {
    if (error) {
      const message = error.message || "";

      clearErrors();

      if (message.includes("Username already exists")) {
        setError("username", {
          type: "server",
          message: "Username already exists",
        });
      } else {
        setError("username", { type: "server", message });
      }
    }
  }, [error, setError, clearErrors]);

  const onSubmit = async (formData: FormData) => {
    clearErrors();
    await registerMutation({ variables: formData });
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper className={styles.paper}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <form
          className={styles.form}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            {...register("username", registerValidation.username)}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", registerValidation.password)}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            label="Role"
            fullWidth
            margin="normal"
            {...register("role", registerValidation.role)}
            error={!!errors.role}
            helperText={errors.role?.message || 'Enter "admin" or "employee"'}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          <Typography variant="body2" align="center" className={styles.link}>
            Already have an account?{" "}
            <Link component={RouterLink} to="/login">
              Login here
            </Link>
          </Typography>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Registered successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
