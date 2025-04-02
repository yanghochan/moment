// UserInfoCard.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UserInfoCard({ username, nickname, setNickname, currentUser }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);

  const saveNickname = async () => {
    try {
      const res = await fetch("/api/profile/saveNickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, nickname: newNickname }),
      });

      const result = await res.json();

      if (result.success) {
        alert("✅ 닉네임이 저장되었습니다.");
        setNickname(newNickname);
        setEditing(false);
      } else {
        alert("❌ 저장 실패: " + result.message);
      }
    } catch (err) {
      console.error("🚨 저장 중 오류:", err.message);
      alert("서버와 통신 중 문제가 발생했습니다.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("moment_user");
    navigate("/");
  };

  return (
    <section className="user-info-card">
      <h1>📘 {nickname}님의 블로그</h1>
      <p>{nickname}님의 기록 일지</p>

      {currentUser === username && (
        <>
          <div className="user-buttons">
            <button className="btn" onClick={() => navigate("/write")}>✏️ 글쓰기</button>
            <button className="btn" onClick={() => navigate("/")}>🏠 홈으로</button>
            <button className="btn" onClick={handleLogout}>🚪 로그아웃</button>
          </div>
          <div className="nickname-edit-area">
            {editing ? (
              <>
                <input
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                />
                <button className="btn save" onClick={saveNickname}>💾 저장</button>
                <button className="btn cancel" onClick={() => setEditing(false)}>❌ 취소</button>
              </>
            ) : (
              <button className="btn edit" onClick={() => setEditing(true)}>닉네임 수정</button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
