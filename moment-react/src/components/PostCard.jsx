// components/PostCard.jsx
import { Link } from "react-router-dom";
import "../styles/PostCard.css";

export default function PostCard({ post }) {
  const { username, category, slug, title, date, nickname, desc } = post;
  const url = `/users/${username}/posts/${category}/${slug}`;

  return (
    <div className="post-card">
      <Link to={url}>
        <h3 className="post-title">{title}</h3>
        <p className="post-meta">📅 {date} · ✍️ {nickname || username}</p>
        <p className="post-desc">{desc || "미리보기가 없습니다."}</p>
      </Link>
    </div>
  );
}
