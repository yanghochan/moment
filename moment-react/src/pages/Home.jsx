// src/pages/Home.jsx
import { useState } from "react";
import "../styles/Home.css";
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
    <main className="home-hero">
      <div className="home-inner container">
        <h1 className="home-title">📸 Moment</h1>
        <p className="home-subtitle">기억이 되는 순간을 담다</p>

        {username && (
          <p className="home-welcome">
            안녕하세요, <span className="highlight">{nickname}</span>님 👋
          </p>
        )}

        <div className="home-actions">
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

        <footer className="home-footer mt-8 mb-4 text-muted">© 2025 Moment. All rights reserved.</footer>
      </div>
    </main>
  );
}
