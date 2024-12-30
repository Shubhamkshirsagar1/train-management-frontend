import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { login } from "../../services.js/api";

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    email: "admin@gmail.com",
    password: "admin@123",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(formData);
      localStorage.setItem("token", data.token);
      const decoded = jwtDecode(data.token);
      setAuth({
        isAuthenticated: true,
        isAdmin: decoded.role === "admin",
      }); // Update auth state
      navigate(decoded.role === "admin" ? "/admin" : "/");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <Grid container justifyContent="center" mt={5}>
      <Grid item xs={12} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Login
          </Typography>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
