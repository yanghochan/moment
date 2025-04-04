// src/components/AuthForm.jsx
// src/components/AuthForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Auth.css";

export default function AuthForm({ type }) {
  const isRegister = type === "register";
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
    nickname: "",
  });
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, password, nickname } = form;
    if (!username || !password || (isRegister && !nickname)) {
      return setError("모든 항목을 입력해주세요.");
    }

    if (isRegister && password !== confirm) {
      return setError("비밀번호가 일치하지 않습니다.");
    }

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister
      ? { username, password, nickname }
      : { username, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        alert(isRegister ? "회원가입 완료!" : "로그인 성공!");
        if (isRegister) {
          navigate("/login");
        } else {
          login(username, result.role === "admin");
          navigate(`/user/${username}`);
        }
      } else {
        setError(result.message || "오류가 발생했습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card luxe-card">
        <h1 className="auth-heading">
          {isRegister ? "Join Moment" : "Welcome Back"}
        </h1>
        <p className="auth-subtext">
          {isRegister
            ? "나만의 순간을 기록할 준비 되셨나요?"
            : "기억을 이어가는 순간, 다시 만나요."}
        </p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
          />
          {isRegister && (
            <>
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <input
                type="text"
                name="nickname"
                placeholder="닉네임"
                value={form.nickname}
                onChange={handleChange}
              />
            </>
          )}
          <button className="auth-btn" type="submit">
            {isRegister ? "Moment 시작하기" : "로그인"}
          </button>
        </form>

        <div className="auth-footer">
          {isRegister ? (
            <p>
              이미 계정이 있으신가요?{" "}
              <a href="/login" className="auth-link">
                로그인하기
              </a>
            </p>
          ) : (
            <p>
              처음이신가요?{" "}
              <a href="/register" className="auth-link">
                회원가입
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
