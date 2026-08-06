import axios from "axios";

import {
  getAdminToken,
  removeAdminToken,
} from "@/lib/authStorage";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL
    ?? "http://127.0.0.1:8000/api/v1",

  headers: {
    Accept: "application/json",
  },

  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      getAdminToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
);

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401
    ) {
      removeAdminToken();
    }

    return Promise.reject(error);
  },
);

export default apiClient;