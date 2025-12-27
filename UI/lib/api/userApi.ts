"use client";

import API from "./api";

 

 
const userApi = {
  // 🔐 Register user
  register: (data: unknown) => {
    return API.post("/Users/register", data);
  },

  // 🔐 Login user
  login: (data: unknown) => {
    return API.post("/Users/login", data);
  },

  // 👥 Get all users
  getAll: () => {
    return API.get("/Users/getall");
  },
};

export default userApi;
