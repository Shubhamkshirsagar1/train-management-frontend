import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { getSeats, reserveSeats } from "../../services.js/api";

const SeatsGrid = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const { data } = await getSeats();
      setSeats(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };

  const handleSelectSeat = (seat) => {
    if (seat.status === "reserved") return;
    if (selectedSeats.includes(seat.seat_number)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.seat_number));
    } else {
      if (selectedSeats.length < 7) {
        setSelectedSeats([...selectedSeats, seat.seat_number]);
      }
    }
  };

  const handleReserve = async () => {
    if (selectedSeats.length === 0) return alert("No seats selected.");
    try {
      await reserveSeats({ seat_count: selectedSeats.length });
      alert("Seats reserved successfully.");
      fetchSeats();
      setSelectedSeats([]);
    } catch (error) {
      console.error("Reservation failed:", error.response?.data?.message);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ backgroundColor: "#f4f4f4" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: "12px", mb: 3 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={2}>
          Reserve Your Seats
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          color="textSecondary"
          mb={3}
        >
          Select up to 7 seats. Reserved seats are marked and unavailable.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container justifyContent="center" spacing={2} sx={{ mb: 2 }}>
          <Grid item>
            <Button
              variant="contained"
              disabled
              sx={{
                backgroundColor: "#d32f2f",
                color: "white",
                cursor: "not-allowed",
                pointerEvents: "none",
                fontSize: "12px",
                padding: "6px 12px",
              }}
            >
              Reserved
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1976d2",
                color: "white",
                fontSize: "12px",
                padding: "6px 12px",
              }}
            >
              Available
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#1976d2",
                color: "#1976d2",
                fontWeight: "bold",
                fontSize: "12px",
                padding: "6px 12px",
              }}
            >
              Selected
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, borderRadius: "12px" }}>
        <Grid container spacing={1} justifyContent="center">
          {seats.map((seat) => (
            <Grid item xs={1} key={seat.seat_number}>
              <Button
                variant={
                  seat.status === "reserved"
                    ? "contained"
                    : selectedSeats.includes(seat.seat_number)
                    ? "outlined"
                    : "text"
                }
                color={seat.status === "reserved" ? "error" : "primary"}
                onClick={() => handleSelectSeat(seat)}
                disabled={seat.status === "reserved"}
                sx={{
                  width: "45px",
                  height: "45px",
                  fontSize: "14px",
                  fontWeight: selectedSeats.includes(seat.seat_number)
                    ? "bold"
                    : "normal",
                  borderRadius: "4px",
                  backgroundColor:
                    seat.status === "reserved"
                      ? "#d32f2f"
                      : selectedSeats.includes(seat.seat_number)
                      ? "#e3f2fd"
                      : "#ffffff",
                  color: selectedSeats.includes(seat.seat_number)
                    ? "#1976d2"
                    : "inherit",
                  border: selectedSeats.includes(seat.seat_number)
                    ? "2px solid #1976d2"
                    : "1px solid #cccccc",
                }}
              >
                {seat.seat_number}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Box textAlign="center" mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReserve}
            disabled={selectedSeats.length === 0}
            sx={{
              padding: "10px 20px",
              fontWeight: "bold",
              fontSize: "14px",
              textTransform: "none",
              borderRadius: "6px",
            }}
          >
            Confirm Reservation
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SeatsGrid;
