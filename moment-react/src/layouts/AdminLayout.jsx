// /src/layouts/AdminLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiUsers, FiUserPlus, FiBarChart2, FiLogOut } from "react-icons/fi";
import "../styles/AdminLayout.css";

export default function AdminLayout() {
  const { isAdmin, logout } = useAuth();

  if (!isAdmin) {
    return <p className="admin-error">🚫 관리자 전용 페이지입니다.</p>;
  }

  return (
    <div className="admin-layout">
      {/* ✅ 사이드바 */}
      <aside className="admin-sidebar">
        {/* 🔰 로고 */}
        <div className="admin-logo">
          <img
            src="/logo/admin-logo.svg"
            alt="Moment Admin"
            className="admin-logo-img"
          />
          <span>Admin Panel</span>
        </div>

        {/* 📂 메뉴 */}
        <nav className="admin-nav">
          <NavLink to="/admin" end title="전체 사용자 관리">
            <FiUsers className="icon" />
            사용자 관리
          </NavLink>
          <NavLink to="/admin/register" title="관리자 계정 등록">
            <FiUserPlus className="icon" />
            관리자 등록
          </NavLink>
          <NavLink to="/admin/analytics" title="분석 및 통계">
            <FiBarChart2 className="icon" />
            통계 대시보드
          </NavLink>
        </nav>

        {/* 🚪 로그아웃 */}
        <button onClick={logout} className="logout-btn" title="로그아웃">
          <FiLogOut className="icon" />
          로그아웃
        </button>
      </aside>

      {/* ▶️ 콘텐츠 */}
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
