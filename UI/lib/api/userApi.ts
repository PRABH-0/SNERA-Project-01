"use client";

import API from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_Name: string;
  email: string;
  password: string;
  profile_Type: string;
  current_Role: string;
  experience: string;
  bio?: string;
  userSkills: string[];
}

 
export interface LoginResponse {
  userId: string;
  userEmail: string;
  userName: string;
  loginResponseString: string;
}

const userApi = {
  // 📝 Register
  register: (data: RegisterPayload) => {
    return API.post("/Users/register", data);
  },

  // 🔐 Login
   login: (data: LoginPayload) => {
    return API.post<LoginResponse>("/Users/login", data);
    // 👉 backend cookies set karega (access + refresh)
  },

  // 🔓 Logout
  logout: () => {
    return API.post("/Users/logout");
    // 👉 backend cookies delete karega
  },

  // 👤 Get current user (token decode backend karega)
  getMe: () => {
    return API.get("/Users/my-profile");
  },

  // 👥 Get all users
  getAll: () => {
    return API.get("/Users/getall");
  },
};

export default userApi;
