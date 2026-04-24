import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("keepalive_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("keepalive_token");
      if (window.location.pathname !== "/auth" && window.location.pathname !== "/") {
          window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

// SWR fetcher
export const fetcher = (url: string) => api.get(url).then((res) => res.data);
