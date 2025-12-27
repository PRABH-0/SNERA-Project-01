"use client";

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ SAFE interceptor (client-only)
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const user = JSON.parse(raw);
          const token = user?.accessToken;
          const userId = user?.userId;

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          if (userId) {
            config.headers.UserId = userId;
          }
        }
      } catch {
        // silent fail (no crash)
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
