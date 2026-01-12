"use client";

import axios, { AxiosError } from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 🍪 IMPORTANT
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Request interceptor
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("user");
    if (raw) {
      const user = JSON.parse(raw);
      config.headers.Authorization = `Bearer ${user.accessToken}`;
      config.headers.UserId = user.userId;
    }
  }
  return config;
});

// 🔄 Response interceptor (refresh token flow)
API.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // ❌ refresh API khud retry na kare
    if (originalRequest?.url?.includes("/Users/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await API.post("/Users/refresh");
        const newAccessToken = (res.data as any).accessToken;

        const raw = localStorage.getItem("user");
        if (!raw) throw new Error("No user");

        const user = JSON.parse(raw);

        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, accessToken: newAccessToken })
        );

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch {
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
