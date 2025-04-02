// PostViewer.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/PostViewer.css";
import PostDetail from "./PostDetail";
import PostActions from "./PostActions";
import CommentSection from "./CommentSection";

export default function PostViewer() {
  const { username, category, slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = localStorage.getItem("moment_user");

  useEffect(() => {
    fetch(`/api/post/${username}/${category}/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost(data.post);
        } else {
          alert("글을 불러오는 데 실패했습니다.");
        }
      })
      .catch((err) => {
        console.error("[PostViewer Error]", err);
        alert("글을 불러오는 데 실패했습니다.");
      })
      .finally(() => setLoading(false));
  }, [username, category, slug]);

  if (loading) {
    return (
      <div className="post-loading">
        <div className="spinner"></div>
        <p className="loading-text">게시글을 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!post) {
    return <p className="error-text">게시글 정보를 불러오지 못했습니다.</p>;
  }

  return (
    <section className="post-viewer container">
      <PostDetail post={post} />
      {currentUser === username && (
        <PostActions username={username} category={category} slug={slug} />
      )}
      <CommentSection username={username} category={category} slug={slug} />
    </section>
  );
}