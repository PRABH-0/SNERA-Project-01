import API from "@/lib/api/api"; 
export interface LoginResponse {
  userId: string;
  singerName: string;
  userEmail: string;
  accessToken: string;
  loginResponseString: string;
}

export interface StoredUser {
  userId: string;
  singerName: string;
  userEmail: string;
  accessToken: string;
}


export const login = async (payload: {
  email: string;
  password: string;
}): Promise<void> => {
  const res = await API.post<LoginResponse>("/Users/login", payload);

  const user: StoredUser = {
    userId: res.data.userId,
    singerName: res.data.singerName,
    userEmail: res.data.userEmail,
    accessToken: res.data.accessToken,
  };

  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = async (): Promise<void> => {
  await API.post("/Users/logout");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
