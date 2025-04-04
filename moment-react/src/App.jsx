// App.jsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./styles/theme.css";
import "./styles/global.css";
import "./styles/Header.css";

export default function App() {
  const { username, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-icon">📸</span>
          Moment
        </Link>

        <nav className="nav-links">
          {username ? (
            <>
              <button onClick={() => navigate(`/user/${username}`)} className="btn">
                마이페이지
              </button>
              <button onClick={() => navigate("/write")} className="btn">
                ✍️ 글쓰기
              </button>
              {isAdmin && (
                <button onClick={() => navigate("/admin")} className="btn header-admin-btn">
                  🔐 관리자
                </button>
              )}
              <button onClick={logout} className="btn">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">로그인</Link>
              <Link to="/register" className="btn">회원가입</Link>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
