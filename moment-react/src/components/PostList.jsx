//PostList.jsx
import { Link } from "react-router-dom";
import "../styles/PostList.css"; // ✅ 경로 유지

export default function PostList({ posts }) {
  if (posts.length === 0)
    return <p className="no-results">검색 결과가 없습니다.</p>;

  return (
    <section className="post-list">
      <h2 className="post-list-title">최신 글</h2>
      {posts.map((post, index) => (
        <div className="post-preview" key={index}>
          <h3 className="post-title">
            <Link to={`/users/${post.username}/posts/${post.category}/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          <p className="post-meta">
            {post.date} · by <span className="post-author">{post.username}</span>
          </p>
          <p className="post-desc">{post.desc}</p>
        </div>
      ))}
    </section>
  );
}
