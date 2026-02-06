import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ⭐ very important
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/Users/refresh")
    ) {
      originalRequest._retry = true;

      try {
        await API.post("/Users/refresh");
        return API(originalRequest);
      } catch (err) {
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    if (error.response?.status === 403) {
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);


export default API;
