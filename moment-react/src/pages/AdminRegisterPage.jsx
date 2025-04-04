// src/pages/AdminRegisterPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/AdminRegister.css";

export default function AdminRegisterPage() {
  const { isAdmin, username: currentUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      alert("접근 권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const handleRegister = async () => {
    if (!username || !password || !nickname) {
      return setError("⚠️ 모든 항목을 입력해주세요.");
    }

    try {
      const res = await fetch("/api/auth/admin-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          nickname,
          requester: currentUser,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ 관리자 계정 등록 완료");
        navigate("/admin");
      } else {
        setError(result.message || "❌ 등록 실패");
      }
    } catch (err) {
      console.error("등록 오류:", err);
      setError("🚨 서버 오류가 발생했습니다.");
    }
  };

  return (
    <main className="admin-register-container">
      <h2 className="admin-register-title">👑 관리자 계정 등록</h2>

      <form className="admin-register-form" onSubmit={(e) => e.preventDefault()}>
        {error && <p className="admin-register-error">{error}</p>}

        <div className="admin-register-form-group">
          <label>아이디</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin123"
          />
        </div>

        <div className="admin-register-form-group">
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
        </div>

        <div className="admin-register-form-group">
          <label>닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="관리자 닉네임"
          />
        </div>

        <button className="admin-register-btn" onClick={handleRegister}>
          관리자 등록
        </button>
      </form>
    </main>
  );
}
