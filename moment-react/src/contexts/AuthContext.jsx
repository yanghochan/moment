// src/contexts/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";

// 1. Context 생성
const AuthContext = createContext();

// 2. Provider 컴포넌트
export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 초기화
  useEffect(() => {
    const storedUser = localStorage.getItem("moment_user");
    const isStoredAdmin = localStorage.getItem("moment_admin") === "true";

    if (storedUser) setUsername(storedUser);
    if (isStoredAdmin) setIsAdmin(true);

    const sync = () => {
      const user = localStorage.getItem("moment_user");
      const admin = localStorage.getItem("moment_admin") === "true";
      setUsername(user);
      setIsAdmin(admin);
    };

    window.addEventListener("authchange", sync);
    return () => window.removeEventListener("authchange", sync);
  }, []);

  // 로그인
  const login = (name, admin = false) => {
    localStorage.setItem("moment_user", name);
    localStorage.setItem("moment_admin", admin.toString());
    setUsername(name);
    setIsAdmin(admin);
    window.dispatchEvent(new Event("authchange"));
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem("moment_user");
    localStorage.removeItem("moment_admin");
    setUsername(null);
    setIsAdmin(false);
    window.dispatchEvent(new Event("authchange"));
  };

  return (
    <AuthContext.Provider value={{ username, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. 커스텀 훅
export function useAuth() {
  return useContext(AuthContext);
}
