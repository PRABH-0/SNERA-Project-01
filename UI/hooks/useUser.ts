"use client";
// User load logic separate
import { useEffect, useState } from "react";

export type UserType = {
  userName?: string;
  email?: string;
  userId?: string;
};

export function useUser() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  return { user, setUser, loadingUser };
}
