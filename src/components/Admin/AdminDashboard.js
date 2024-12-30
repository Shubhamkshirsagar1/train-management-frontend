import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import { getBookedUsers, resetSeats } from "../../services.js/api";

const AdminDashboard = () => {
  const [bookedUsers, setBookedUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchBookedUsers();
  }, []);

  const fetchBookedUsers = async () => {
    try {
      const { data } = await getBookedUsers();
      setBookedUsers(data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error fetching booked users."
      );
    }
  };

  const handleResetSeats = async () => {
    try {
      await resetSeats();
      setSuccessMessage("All seats have been reset successfully.");
      setBookedUsers([]);
      setErrorMessage(null);
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(
        error.response?.data?.message || "Error resetting seats."
      );
    }
  };

  return (
    <Grid container justifyContent="center" mt={5}>
      <Grid item xs={12} md={10} lg={8}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <Box mt={3}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleResetSeats}
              fullWidth
            >
              Reset All Seats
            </Button>
          </Box>

          <Box mt={4}>
            <Typography variant="h5">Users Who Have Booked Tickets</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Booked Seats</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookedUsers.length > 0 ? (
                    bookedUsers.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell>{user.user_id}</TableCell>
                        <TableCell>
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.reservations
                            .map(
                              (res) =>
                                `Seat ${res.seat_number} (Row ${res.row})`
                            )
                            .join(", ")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
