// useLogin.js
import { useState } from "react";

export default function useLogin() {
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await res.json();
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      return { success: false, message: "서버 오류 발생" };
    }
  };

  return { login, loading };
}
