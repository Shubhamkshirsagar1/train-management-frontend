import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Alert,
} from "@mui/material";
import { getUserSeats, cancelReservation } from "../../services.js/api";

const CancelReservation = () => {
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchUserBookedSeats();
  }, []);

  const fetchUserBookedSeats = async () => {
    try {
      const { data } = await getUserSeats();
      setBookedSeats(data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error fetching booked seats."
      );
    }
  };

  const handleCancelReservation = async () => {
    if (selectedSeats.length === 0) {
      setErrorMessage("Please select at least one seat to cancel.");
      return;
    }

    try {
      for (const seat of selectedSeats) {
        await cancelReservation({ seat_number: seat });
      }
      setSuccessMessage("Reservation(s) cancelled successfully.");
      setErrorMessage(null);
      fetchUserBookedSeats(); // Refresh booked seats after cancellation
      setSelectedSeats([]); // Clear selected seats
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(
        error.response?.data?.message || "Error cancelling reservations."
      );
    }
  };

  return (
    <Grid container justifyContent="center" mt={5}>
      <Grid item xs={12} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Cancel Reservation
          </Typography>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Box mt={2}>
            <FormControl fullWidth>
              <InputLabel>Select Seats</InputLabel>
              <Select
                multiple
                value={selectedSeats}
                onChange={(e) => setSelectedSeats(e.target.value)}
                renderValue={(selected) => selected.join(", ")}
              >
                {bookedSeats.map((seat) => (
                  <MenuItem key={seat.seat_number} value={seat.seat_number}>
                    <Checkbox
                      checked={selectedSeats.includes(seat.seat_number)}
                    />
                    <ListItemText
                      primary={`Seat ${seat.seat_number} (Row ${seat.row})`}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mt={2}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleCancelReservation}
              disabled={bookedSeats.length === 0}
            >
              Cancel Selected Reservations
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CancelReservation;
