// src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AdminUserList from "../components/admin/AdminUserList";
import "../styles/AdminPage.css"; // ⬅️ 클래스명만 바꾼 최신 CSS를 연결해야 함

export default function AdminPage() {
  const { isAdmin, username } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // 🔐 관리자 권한 확인 및 유저 목록 로딩
  useEffect(() => {
    if (!isAdmin) {
      alert("❌ 접근 권한이 없습니다.");
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/auth/users");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("유저 목록 불러오기 실패:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [isAdmin, navigate]);

  // 🗑️ 계정 삭제 핸들러
  const handleDelete = async (targetUsername) => {
    if (targetUsername === username) {
      alert("❌ 본인 계정은 삭제할 수 없습니다.");
      return;
    }

    const confirmed = window.confirm(`${targetUsername} 계정을 삭제할까요?`);
    if (!confirmed) return;

    try {
      const res = await fetch("/api/auth/deleteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: targetUsername }),
      });
      const result = await res.json();

      if (result.success) {
        alert("✅ 삭제 완료");
        setUsers((prev) => prev.filter((u) => u.username !== targetUsername));
      } else {
        alert("❌ 삭제 실패: " + result.message);
      }
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("🚨 서버 오류 발생");
    }
  };

  return (
    <main className="admin-page-container">
      <header className="admin-page-header">
        <h1>📊 사용자 관리</h1>
        <p className="admin-page-subtitle">Moment 서비스를 사용하는 전체 사용자 목록입니다.</p>
      </header>

      <section className="admin-page-section">
        <div className="admin-page-card">
          <div className="admin-page-card-header">
            <h2>👥 전체 사용자 <span className="count">({users.length})</span></h2>
          </div>

          {users.length === 0 ? (
            <p className="empty-text">등록된 사용자가 없습니다.</p>
          ) : (
            <AdminUserList users={users} onDelete={handleDelete} />
          )}
        </div>
      </section>
    </main>
  );
}