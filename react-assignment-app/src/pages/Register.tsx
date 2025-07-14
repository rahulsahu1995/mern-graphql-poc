// src/pages/Register.tsx
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const REGISTER = gql`
  mutation Register($username: String!, $password: String!, $role: String!) {
    register(username: $username, password: $password, role: $role) {
      token
      role
    }
  }
`;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "admin",
  });
  const [register, { error }] = useMutation(REGISTER, {
    onCompleted: ({ register }) => {
      localStorage.setItem("token", register.token);
      localStorage.setItem("role", register.role);
      navigate("/");
    },
  });

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4">Register</Typography>
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <TextField
          fullWidth
          label="Role"
          margin="normal"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={() => register({ variables: form })}
        >
          Register
        </Button>
        {error && <Typography color="error">Registration failed</Typography>}
      </Box>
    </Container>
  );
};

export default Register;
