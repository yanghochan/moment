// src/pages/Home.jsx
import { useState } from "react";
import "../styles/Home.css"
import { useNavigate, Link } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import useAllPosts from "../hooks/useAllPosts";
import PostList from "../components/PostList";
import SearchInput from "../components/SearchInput";

export default function Home() {
  const { username, nickname, logout } = useAuthUser();
  const posts = useAllPosts();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredPosts = posts.filter((post) =>
    [post.title, post.desc, post.username]
      .some((field) => field?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="main-hero container">
      <h1 className="main-title">📸 Moment</h1>
      <p className="subtitle">기억이 되는 순간을 담다</p>

      {username && (
        <p className="welcome">
          👋 <span className="highlight">{nickname}</span>님 환영합니다!
        </p>
      )}

      <div className="auth-buttons">
        {username ? (
          <>
            <button onClick={logout} className="btn">로그아웃</button>
            <button onClick={() => navigate(`/user/${username}`)} className="btn">마이페이지</button>
            <button onClick={() => navigate("/write")} className="btn">✍️ 글쓰기</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">🔑 로그인</Link>
            <Link to="/register" className="btn">✨ 회원가입</Link>
          </>
        )}
      </div>

      <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
      <PostList posts={filteredPosts} />

      <footer className="text-center mt-8 mb-4 text-gray">© 2025 Moment</footer>
    </div>
  );
}
