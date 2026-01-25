"use client";

import axios, { AxiosError } from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 🍪 refresh token cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// 🔐 REQUEST INTERCEPTOR
// ===============================
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("user");
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
    }
  }
  return config;
});

// ===============================
// 🔄 REFRESH TOKEN HELPERS
// ===============================
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ===============================
// 🔄 RESPONSE INTERCEPTOR
// ===============================
API.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // ❌ refresh endpoint khud retry na kare
    if (originalRequest?.url?.includes("/Users/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // ⏳ agar already refresh chal rahi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🔄 refresh token call
        const res = await API.post("/Users/refresh");
        const newAccessToken = (res.data as any).accessToken;

        const raw = localStorage.getItem("user");
        if (!raw) throw new Error("No user in storage");

        const user = JSON.parse(raw);

        // 💾 update access token
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, accessToken: newAccessToken })
        );

        API.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        // 🔁 retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (err) {
        // ❌ refresh fail → logout
        processQueue(err, null);
        localStorage.removeItem("user");
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
