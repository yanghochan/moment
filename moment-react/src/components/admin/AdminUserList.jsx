// src/pages/AdminRegister.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/Auth.css";

function FormGroup({ label, id, type = "text", value, onChange, required = true, placeholder }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete="off"
      />
    </div>
  );
}

export default function AdminRegister() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
    nickname: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, password, confirm, nickname } = form;

    if (!username || !password || !confirm || !nickname) {
      return setError("⚠️ 모든 항목을 입력해주세요.");
    }

    if (password !== confirm) {
      return setError("⚠️ 비밀번호가 일치하지 않습니다.");
    }

    try {
      const res = await fetch("/api/auth/admin-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, nickname }),
      });
      const result = await res.json();

      if (result.success) {
        alert("✅ 관리자 계정 등록 완료!");
        navigate("/admin");
      } else {
        setError(result.message || "❌ 등록 실패");
      }
    } catch (err) {
      console.error("[AdminRegister Error]", err);
      setError("🚨 서버 오류가 발생했습니다.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">🚫 접근 제한</h2>
          <p className="error-text">관리자만 이 페이지에 접근할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">👑 관리자 계정 등록</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}

          <FormGroup
            label="아이디"
            id="username"
            value={form.username}
            onChange={handleChange}
            placeholder="admin123"
          />
          <FormGroup
            label="비밀번호"
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
          />
          <FormGroup
            label="비밀번호 확인"
            id="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            placeholder="비밀번호 확인"
          />
          <FormGroup
            label="닉네임"
            id="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder="관리자 닉네임"
          />

          <button className="btn" type="submit">
            관리자 등록
          </button>
        </form>
      </div>
    </div>
  );
}
