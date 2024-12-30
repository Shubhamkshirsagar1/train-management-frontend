import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import jwtDecode from "jwt-decode";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import SeatsGrid from "./components/Seats/SeatsGrid";
import CancelReservation from "./components/Seats/CancelReservation";
import AdminDashboard from "./components/Admin/AdminDashboard";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

const App = () => {
  const [auth, setAuth] = useState({ isAuthenticated: false, isAdmin: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);

        if (decoded.exp * 1000 > Date.now()) {
          setAuth({
            isAuthenticated: true,
            isAdmin: decoded.role === "admin",
          });
        } else {
          console.warn("Token expired");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false); // Finish token processing
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth({ isAuthenticated: false, isAdmin: false });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <AppBar position="static" sx={{ marginBottom: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Train Seat Reservation
          </Typography>
          {auth.isAuthenticated ? (
            <>
              {auth.isAdmin ? (
                <Button color="inherit" component={Link} to="/admin">
                  Admin Panel
                </Button>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/">
                    Dashboard
                  </Button>
                  <Button color="inherit" component={Link} to="/cancel">
                    Cancel Reservation
                  </Button>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            auth.isAuthenticated && auth.isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* User Dashboard */}
        <Route
          path="/"
          element={
            auth.isAuthenticated ? (
              auth.isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <SeatsGrid />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Cancel Reservation */}
        <Route
          path="/cancel"
          element={
            auth.isAuthenticated && !auth.isAdmin ? (
              <CancelReservation />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Login */}
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        {/* Register */}
        <Route path="/register" element={<Register />} />
        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <Typography variant="h5" textAlign="center">
              404 - Page Not Found
            </Typography>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
