// src/pages/Login.tsx
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      role
    }
  }
`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [login, { error }] = useMutation(LOGIN, {
    onCompleted: ({ login }) => {
      localStorage.setItem("token", login.token);
      localStorage.setItem("role", login.role);
      navigate("/");
    },
  });

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4">Login</Typography>
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
        <Button
          variant="contained"
          fullWidth
          onClick={() => login({ variables: form })}
        >
          Login
        </Button>
        {error && <Typography color="error">Login failed</Typography>}
      </Box>
    </Container>
  );
};

export default Login;
