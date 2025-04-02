// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminRoute({ children }) {
  const { username, isAdmin } = useAuth();

  if (!username) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    alert("관리자 권한이 필요합니다.");
    return <Navigate to="/" />;
  }

  return children;
}
