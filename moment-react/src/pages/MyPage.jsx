// /src/MyPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserPosts from "../components/PostList";
import "../styles/userPage.css";
import "../styles/theme.css";

export default function MyPage() {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const currentUser = localStorage.getItem("moment_user");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/users/${username}/posts`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setPosts(data))
      .catch((err) => console.error("❌ 글 로딩 실패", err));
  }, [username]);

  const handleDelete = async (url) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    const parsed = url.split("/");
    const category = parsed[parsed.length - 2];
    const slug = parsed[parsed.length - 1].replace(".html", "");

    const res = await fetch("/api/post/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, category, slug }),
    });

    const result = await res.json();
    if (result.success) {
      alert("✅ 삭제 완료");
      setPosts((prev) =>
        prev.filter((p) => !(p.slug === slug && p.category === category))
      );
    } else {
      alert("❌ 삭제 실패: " + result.message);
    }
  };

<<<<<<< HEAD
  const handleDeleteUser = () => {
    const user = localStorage.getItem("moment_user");
    const password = prompt("비밀번호를 입력하세요");
    if (!password) {
      alert("비밀번호를 입력해야 탈퇴할 수 있습니다.");
      return;
    }

    if (confirm("정말 탈퇴하시겠습니까?")) {
      fetch("/api/auth/deleteUser", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            alert("회원 탈퇴가 완료되었습니다.");
            localStorage.removeItem("moment_user");
            navigate("/");
          } else {
            alert("탈퇴 실패: " + result.message);
          }
        });
=======
  const handleDeleteUser = async () => {
    const confirmed = window.confirm("정말 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (!confirmed) return;

    const user = localStorage.getItem("moment_user");
    const password = prompt("비밀번호를 입력해주세요");

    const res = await fetch(`/api/auth/deleteUser/${user}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const result = await res.json();
    if (result.success) {
      alert("✅ 회원 탈퇴가 완료되었습니다.");
      localStorage.removeItem("moment_user");
      navigate("/");
    } else {
      alert("❌ 탈퇴 실패: " + result.message);
>>>>>>> bff76f3 ('25.04.03)
    }
  };

  return (
    <main className="user-page">
      <div className="user-page-header">
        <h2>📁 {username}님의 마이페이지</h2>
        {currentUser?.toLowerCase() === username?.toLowerCase() && (
          <p>📝 총 {posts.length}개의 글</p>
        )}
      </div>

      <UserPosts
        posts={posts}
        username={username}
        currentUser={currentUser}
        onDelete={handleDelete}
      />

      {currentUser?.toLowerCase() === username?.toLowerCase() && (
        <div className="mypage-actions">
          <button className="btn" onClick={() => navigate("/")}>🏠 메인으로</button>
          <button className="btn delete" onClick={handleDeleteUser}>회원 탈퇴</button>
        </div>
      )}
    </main>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> bff76f3 ('25.04.03)
