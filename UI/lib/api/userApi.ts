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
  singerName: string;
  accessToken: string;
  loginResponseString: string;
}

 
const userApi = {
  // 🔐 Register user
  register: (data: RegisterPayload) => {
    return API.post("/Users/register", data);
  },

  // 🔐 Login user
  login: (data: LoginPayload) => {
    return API.post<LoginResponse>("/Users/login", data);
  },

  // 👥 Get all users
  getAll: () => {
    return API.get("/Users/getall");
  },


};

export default userApi;
