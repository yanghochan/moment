// src/components/CommentSection.jsx
import { useEffect, useState } from "react";
import "../styles/CommentSection.css";

export default function CommentSection({ username, category, slug }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const user = localStorage.getItem("moment_user");

  useEffect(() => {
    fetch(`/api/comments?username=${username}&category=${category}&slug=${slug}`)
      .then((res) => res.json())
      .then((data) => setComments(data || []))
      .catch(() => setComments([]));
  }, [username, category, slug]);

  const handleSubmit = () => {
    if (!user || !newComment.trim()) return;
    fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, category, slug, user, text: newComment }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setComments([
            { user, text: newComment, time: new Date().toISOString(), likedUsers: [], likes: 0, replies: [] },
            ...comments,
          ]);
          setNewComment("");
        }
      });
  };

  return (
    <div className="comments">
      <h3>💬 댓글</h3>
      <ul>
        {comments.map((c, idx) => (
          <li key={idx}>
            <strong>{c.user}</strong>: {c.text}
            <div>{new Date(c.time).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      {user ? (
        <div>
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} />
          <button onClick={handleSubmit}>댓글 작성</button>
        </div>
      ) : (
        <p>댓글을 작성하려면 로그인하세요.</p>
      )}
    </div>
  );
}
