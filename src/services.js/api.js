import axios from "axios";

// const API = axios.create({ baseURL: "http://3.110.136.131:8080/api/v1" });
const API = axios.create({ baseURL: "http://localhost:8080/api/v1" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const register = (formData) => API.post("/auth/register", formData);
export const login = (formData) => API.post("/auth/login", formData);

export const reserveSeats = (data) => API.post("/seats/reserve", data);
export const cancelReservation = (data) => API.post("/seats/cancel", data);
// export const resetSeats = () => API.post("/seats/reset");
export const getSeats = () => API.get("/seats");
export const getUserSeats = () => API.get("/seats/user-seats");
export const getBookedUsers = () => API.get("/seats/booked-users");
export const resetSeats = () => API.post("/seats/reset-seats");

