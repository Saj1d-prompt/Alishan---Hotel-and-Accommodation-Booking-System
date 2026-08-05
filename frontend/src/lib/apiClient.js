import axios from "axios";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL
    ?? "http://127.0.0.1:8000/api/v1",

  headers: {
    Accept: "application/json",
  },

  timeout: 30000,
});

export default apiClient;