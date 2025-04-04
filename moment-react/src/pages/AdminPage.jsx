//src/pages/AdminPage.jsx
// src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AdminUserList from "../components/admin/AdminUserList";
import { exportUsersToCSV } from "../utils/csvExporter";
import "../styles/AdminPage.css";

export default function AdminPage() {
  const { isAdmin, username } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyAdmins, setShowOnlyAdmins] = useState(false);
  const [sortType, setSortType] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const navigate = useNavigate();

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

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nickname?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAdmin = showOnlyAdmins ? u.role === "admin" : true;
    return matchesSearch && matchesAdmin;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortType === "nickname") {
      return (a.nickname || "").localeCompare(b.nickname || "");
    } else if (sortType === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const currentUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="admin-page-container">
      <header className="admin-page-header">
        <h1>📊 사용자 관리</h1>
        <p className="admin-page-subtitle">
          Moment 서비스를 사용하는 전체 사용자 목록입니다.
        </p>
      </header>

      <section className="admin-page-card">
        <div className="admin-page-card-header">
          <h2>👥 전체 사용자 <span className="count">({filteredUsers.length})</span></h2>
          <button onClick={() => exportUsersToCSV(filteredUsers)}>
            📥 CSV 내보내기
          </button>
        </div>

        <div className="admin-filter-controls">
          <input
            type="text"
            placeholder="닉네임 또는 아이디 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="admin-filter-buttons">
            <button
              className={!showOnlyAdmins ? "active" : ""}
              onClick={() => setShowOnlyAdmins(false)}
            >
              전체 보기
            </button>
            <button
              className={showOnlyAdmins ? "active" : ""}
              onClick={() => setShowOnlyAdmins(true)}
            >
              관리자만
            </button>
          </div>
          <div className="admin-sort-controls">
            <label>정렬 기준:</label>
            <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
              <option value="recent">최신 가입순</option>
              <option value="nickname">닉네임 가나다순</option>
            </select>
          </div>
        </div>

        {sortedUsers.length === 0 ? (
          <p className="empty-text">검색 결과가 없습니다.</p>
        ) : (
          <>
            <AdminUserList users={currentUsers} onDelete={handleDelete} />
            <div className="pagination-controls">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${page === currentPage ? "active" : ""}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
