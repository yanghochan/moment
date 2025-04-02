// AuthForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import "../styles/Auth.css";

export default function AuthForm({ type }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const isRegister = type === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister ? "/api/auth/register" : "/api/auth/login";
=======
import { useAuth } from "../contexts/AuthContext"; // ✅ 로그인 전역 상태 반영
import "../styles/Auth.css";

export default function AuthForm({ type }) {
  const isRegister = type === "register";
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ 로그인 시 Context 업데이트

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
>>>>>>> bff76f3 ('25.04.03)
    const payload = isRegister
      ? { username, password, nickname }
      : { username, password };

<<<<<<< HEAD
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result.success) {
      alert(isRegister ? "🎉 회원가입 성공!" : "✅ 로그인 성공!");
      if (!isRegister) {
        localStorage.setItem("moment_user", username);
        navigate(`/user/${username}`);
      } else {
        navigate("/login");
      }
    } else {
      alert("❌ 실패: " + result.message);
=======
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        alert(isRegister ? "🎉 회원가입 성공!" : "✅ 로그인 성공!");

        if (isRegister) {
          navigate("/login");
        } else {
          login(username, result.role === "admin"); // ✅ 관리자 여부 반영
          navigate(`/user/${username}`);
        }
      } else {
        setError(result.message || "오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("🚨 서버 통신 실패:", err);
      setError("서버 오류가 발생했습니다.");
>>>>>>> bff76f3 ('25.04.03)
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isRegister ? "회원가입" : "로그인"}</h2>
<<<<<<< HEAD
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">아이디</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="nickname">닉네임</label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>
          )}

          <button className="btn" type="submit">
            {isRegister ? "가입하기" : "로그인"}
          </button>

          <p className="link-text">
            {isRegister ? (
              <>
                이미 계정이 있나요? <a href="/login">로그인</a>
              </>
            ) : (
              <>
                계정이 없으신가요? <a href="/register">회원가입</a>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
=======
        {error && <p className="error-text">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
          />
          {isRegister && (
            <>
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <input
                name="nickname"
                placeholder="닉네임"
                value={form.nickname}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit" className="btn">
            {isRegister ? "가입하기" : "로그인"}
          </button>
        </form>

        <div className="auth-footer">
          {isRegister ? (
            <p>
              이미 계정이 있으신가요? <a href="/login">로그인</a>
            </p>
          ) : (
            <p>
              계정이 없으신가요? <a href="/register">회원가입</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
>>>>>>> bff76f3 ('25.04.03)
