import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import styles from "./Login.module.css";
import { loginValidation } from "./constants";

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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: ({ login }) => {
      localStorage.setItem("token", login.token);
      localStorage.setItem("role", login.role);
      navigate("/");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // clear error on input change
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    Object.entries(loginValidation).forEach(([field, rules]) => {
      const value = form[field as keyof typeof form];
      if (rules.required && !value) errors[field] = rules.required;
      else if (rules.minLength && value.length < rules.minLength.value)
        errors[field] = rules.minLength.message;
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApolloErrors = (errors: readonly any[]) => {
    const serverErrors: { [key: string]: string } = {};

    errors.forEach((error) => {
      const message = error.message.toLowerCase();

      if (message.includes("invalid username")) {
        serverErrors.username = "Username not found";
      } else if (message.includes("incorrect password")) {
        serverErrors.password = "Password is incorrect";
      } else if (message.includes("invalid username or password")) {
        serverErrors.username = "Invalid username or password";
        serverErrors.password = "Invalid username or password";
      } else {
        serverErrors.username = "Login failed";
        serverErrors.password = "Please try again later";
      }
    });

    setFormErrors(serverErrors);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const result = await login({ variables: form });

      if (result.errors && result.errors.length > 0) {
        handleApolloErrors(result.errors);
        return;
      }
    } catch (err: any) {
      handleApolloErrors([err]);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper className={styles.paper}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form className={styles.form} noValidate autoComplete="off">
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={form.username}
            onChange={handleChange}
            error={!!formErrors.username}
            helperText={formErrors.username}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={styles.button}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Typography variant="body2" align="center" className={styles.link}>
            Don't have an account?{" "}
            <Link component={RouterLink} to="/register">
              Register here
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
