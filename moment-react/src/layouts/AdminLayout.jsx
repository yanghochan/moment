import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/AdminLayout.css";

export default function AdminLayout() {
  const { isAdmin, logout } = useAuth();

  if (!isAdmin) {
    return <p className="admin-error">🚫 관리자 전용 페이지입니다.</p>;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">📂 Admin Panel</h2>
        <nav className="admin-nav">
          <NavLink to="/admin" end>📋 사용자 관리</NavLink>
          <NavLink to="/admin/register">🧑‍💼 관리자 등록</NavLink>
        </nav>
        <button onClick={logout} className="logout-btn">🚪 로그아웃</button>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}