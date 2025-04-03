// src/pages/CommentSection.jsx
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

  const apiCall = (url, method, body, callback) => {
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((result) => (result.success ? callback(result) : alert("❌ 요청 실패")));
  };

  const updateNested = (list, chain, updater) => {
    const [head, ...rest] = chain;
    return list.map((item, i) => {
      if (i === head) {
        if (rest.length === 0) return updater(item);
        return {
          ...item,
          replies: updateNested(item.replies || [], rest, updater),
        };
      }
      return item;
    });
  };

  const handleAction = (chain, action, payload = {}) => {
    switch (action) {
      case "reply": {
        const { text } = payload;
        apiCall("/api/comments/reply", "POST", { username, category, slug, chain, user, text }, () => {
          setComments((prev) =>
            updateNested(prev, chain, (item) => ({
              ...item,
              replies: [
                ...(item.replies || []),
                { user, text, time: new Date().toISOString(), likes: 0, likedUsers: [], replies: [] },
              ],
            }))
          );
        });
        break;
      }
      case "edit": {
        const { newText } = payload;
        apiCall("/api/comments/edit", "PUT", { username, category, slug, chain, user, newText }, () => {
          setComments((prev) =>
            updateNested(prev, chain, (item) => ({
              ...item,
              text: newText,
            }))
          );
        });
        break;
      }
      case "delete": {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        apiCall("/api/comments/delete", "DELETE", { username, category, slug, chain, user }, () => {
          const deleteNested = (list, chain) => {
            const [head, ...rest] = chain;
            if (rest.length === 0) return list.filter((_, i) => i !== head);
            return list.map((item, i) => {
              if (i === head) {
                return {
                  ...item,
                  replies: deleteNested(item.replies || [], rest),
                };
              }
              return item;
            });
          };
          setComments((prev) => deleteNested(prev, chain));
        });
        break;
      }
      case "like": {
        apiCall("/api/comments/likeToggle", "POST", { username, category, slug, chain, user }, (result) => {
          setComments((prev) =>
            updateNested(prev, chain, (item) => ({
              ...item,
              likes: result.likes,
              likedUsers: result.liked
                ? [...(item.likedUsers || []), user]
                : (item.likedUsers || []).filter((u) => u !== user),
            }))
          );
        });
        break;
      }
      default:
        break;
    }
  };

  const handleSubmit = () => {
    if (!user || !newComment.trim()) return;
    apiCall("/api/comments", "POST", { username, category, slug, user, text: newComment }, () => {
      setComments((prev) => [
        {
          user,
          text: newComment,
          time: new Date().toISOString(),
          likes: 0,
          likedUsers: [],
          replies: [],
        },
        ...prev,
      ]);
      setNewComment("");
    });
  };

  const CommentItem = ({ comment, chain = [] }) => {
    const [replyText, setReplyText] = useState("");
    const [showReply, setShowReply] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const handleReply = () => {
      if (!replyText.trim()) return;
      handleAction(chain, "reply", { text: replyText });
      setReplyText("");
      setShowReply(false);
    };

    return (
      <li className={chain.length === 0 ? "comment" : "reply"}>
        <strong>{comment.user}</strong>: {comment.text}
        <div className="comment-time">🕒 {new Date(comment.time).toLocaleString()}</div>

        <div className="comment-actions">
          <button onClick={() => handleAction(chain, "like")}>❤️ ({comment.likes || 0})</button>
          {user === comment.user && (
            <>
              <button
                onClick={() => {
                  const newText = prompt("수정할 내용을 입력하세요", comment.text);
                  if (newText && newText !== comment.text) {
                    handleAction(chain, "edit", { newText });
                  }
                }}
              >
                ✏️
              </button>
              <button onClick={() => handleAction(chain, "delete")}>🗑</button>
            </>
          )}
          <button onClick={() => setShowReply(!showReply)}>💬 답글</button>
          {comment.replies?.length > 0 && (
            <button onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? "🔽 펼치기" : "🔼 접기"}
            </button>
          )}
        </div>

        {showReply && (
          <div className="reply-form">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="답글을 입력하세요"
            ></textarea>
            <button onClick={handleReply}>답글 등록</button>
          </div>
        )}

        {!collapsed && comment.replies?.length > 0 && (
          <ul className="reply-list">
            {comment.replies.map((reply, idx) => (
              <CommentItem key={idx} comment={reply} chain={[...chain, idx]} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="comments">
      <h3>💬 댓글</h3>
      <ul>
        {comments.map((c, idx) => (
          <CommentItem key={idx} comment={c} chain={[idx]} />
        ))}
      </ul>
      {user ? (
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
          ></textarea>
          <button onClick={handleSubmit}>등록</button>
        </div>
      ) : (
        <p>댓글을 작성하려면 로그인하세요.</p>
      )}
    </div>
  );
}
