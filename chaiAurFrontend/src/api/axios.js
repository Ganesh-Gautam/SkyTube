import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5173/api/v1";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true
});

export default axiosInstance;
