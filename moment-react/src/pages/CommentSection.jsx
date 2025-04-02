// CommentSection.jsx 
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
      .then((result) => result.success ? callback(result) : alert("❌ 요청 실패"));
  };

<<<<<<< HEAD
  const handleSubmit = () => {
    if (!user || !newComment.trim()) return;
    apiCall("/api/comments", "POST", { username, category, slug, user, text: newComment }, () => {
      setComments((prev) => [
        { user, text: newComment, time: new Date().toISOString(), likedUsers: [], likes: 0, replies: [] },
        ...prev
      ]);
      setNewComment("");
    });
  };

  const handleNestedAction = (chain, action, payload = {}) => {
    const updateNested = (list, chain, updater) => {
      const [head, ...rest] = chain;
      return list.map((item, idx) => {
        if (idx === head) {
          if (rest.length === 0) return updater(item);
          return {
            ...item,
            replies: updateNested(item.replies || [], rest, updater)
          };
        }
        return item;
      });
    };

=======
  const updateNested = (list, chain, updater) => {
    const [head, ...rest] = chain;
    return list.map((item, i) => {
      if (i === head) {
        if (rest.length === 0) return updater(item);
        return {
          ...item,
          replies: updateNested(item.replies || [], rest, updater)
        };
      }
      return item;
    });
  };

  const handleAction = (chain, action, payload = {}) => {
>>>>>>> bff76f3 ('25.04.03)
    switch (action) {
      case "reply": {
        const { text } = payload;
        apiCall("/api/comments/reply", "POST", { username, category, slug, chain, user, text }, () => {
<<<<<<< HEAD
          setComments((prev) => updateNested(prev, chain, (item) => ({
            ...item,
            replies: [...(item.replies || []), { user, text, time: new Date().toISOString(), likedUsers: [], likes: 0, replies: [] }]
          })));
=======
          setComments(prev =>
            updateNested(prev, chain, (item) => ({
              ...item,
              replies: [
                ...(item.replies || []),
                { user, text, time: new Date().toISOString(), likes: 0, likedUsers: [], replies: [] },
              ],
            }))
          );
>>>>>>> bff76f3 ('25.04.03)
        });
        break;
      }
      case "edit": {
        const { newText } = payload;
        apiCall("/api/comments/edit", "PUT", { username, category, slug, chain, user, newText }, () => {
<<<<<<< HEAD
          setComments((prev) => updateNested(prev, chain, (item) => ({ ...item, text: newText })));
=======
          setComments(prev => updateNested(prev, chain, (item) => ({ ...item, text: newText })));
>>>>>>> bff76f3 ('25.04.03)
        });
        break;
      }
      case "delete": {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        apiCall("/api/comments/delete", "DELETE", { username, category, slug, chain, user }, () => {
          const deleteNested = (list, chain) => {
            const [head, ...rest] = chain;
            if (rest.length === 0) return list.filter((_, i) => i !== head);
<<<<<<< HEAD
            return list.map((item, idx) => {
              if (idx === head) {
                return {
                  ...item,
                  replies: deleteNested(item.replies || [], rest)
=======
            return list.map((item, i) => {
              if (i === head) {
                return {
                  ...item,
                  replies: deleteNested(item.replies || [], rest),
>>>>>>> bff76f3 ('25.04.03)
                };
              }
              return item;
            });
          };
<<<<<<< HEAD
          setComments((prev) => deleteNested(prev, chain));
=======
          setComments(prev => deleteNested(prev, chain));
>>>>>>> bff76f3 ('25.04.03)
        });
        break;
      }
      case "like": {
        apiCall("/api/comments/likeToggle", "POST", { username, category, slug, chain, user }, (result) => {
<<<<<<< HEAD
          setComments((prev) => updateNested(prev, chain, (item) => ({
            ...item,
            likes: result.likes,
            likedUsers: result.liked
              ? [...(item.likedUsers || []), user]
              : (item.likedUsers || []).filter((u) => u !== user)
          })));
=======
          setComments(prev =>
            updateNested(prev, chain, (item) => ({
              ...item,
              likes: result.likes,
              likedUsers: result.liked
                ? [...(item.likedUsers || []), user]
                : (item.likedUsers || []).filter((u) => u !== user),
            }))
          );
>>>>>>> bff76f3 ('25.04.03)
        });
        break;
      }
      default:
        break;
    }
  };

  const CommentItem = ({ comment, chain = [] }) => {
<<<<<<< HEAD
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [collapsed, setCollapsed] = useState(false);

    const handleReply = () => {
      if (!replyText.trim()) return;
      handleNestedAction(chain, "reply", { text: replyText });
      setReplyText("");
      setShowReply(false);
    };

=======
    const [replyText, setReplyText] = useState("");
    const [showReply, setShowReply] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

>>>>>>> bff76f3 ('25.04.03)
    return (
      <li className={chain.length === 0 ? "comment" : "reply"}>
        <strong>{comment.user}</strong>: {comment.text}
        <div className="comment-time">🕒 {new Date(comment.time).toLocaleString()}</div>
<<<<<<< HEAD

        <div className={chain.length === 0 ? "comment-actions" : "reply-actions"}>
          <button onClick={() => handleNestedAction(chain, "like")}>❤️ ({comment.likes || 0})</button>
=======
        <div className="comment-actions">
          <button onClick={() => handleAction(chain, "like")}>❤️ ({comment.likes || 0})</button>
>>>>>>> bff76f3 ('25.04.03)
          {user === comment.user && (
            <>
              <button onClick={() => {
                const newText = prompt("수정할 내용을 입력하세요", comment.text);
<<<<<<< HEAD
                if (newText && newText !== comment.text) handleNestedAction(chain, "edit", { newText });
              }}>✏️</button>
              <button onClick={() => handleNestedAction(chain, "delete")}>🗑</button>
=======
                if (newText && newText !== comment.text) handleAction(chain, "edit", { newText });
              }}>✏️</button>
              <button onClick={() => handleAction(chain, "delete")}>🗑</button>
>>>>>>> bff76f3 ('25.04.03)
            </>
          )}
          <button onClick={() => setShowReply(!showReply)}>💬 답글</button>
          {comment.replies?.length > 0 && (
            <button onClick={() => setCollapsed(!collapsed)}>{collapsed ? "🔽 펼치기" : "🔼 접기"}</button>
          )}
        </div>

        {showReply && (
          <div className="reply-form">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="답글을 입력하세요"
<<<<<<< HEAD
            ></textarea>
            <button onClick={handleReply}>답글 등록</button>
=======
            />
            <button onClick={() => {
              if (replyText.trim()) {
                handleAction(chain, "reply", { text: replyText });
                setReplyText("");
                setShowReply(false);
              }
            }}>답글 등록</button>
>>>>>>> bff76f3 ('25.04.03)
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
<<<<<<< HEAD

=======
>>>>>>> bff76f3 ('25.04.03)
      {user ? (
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
<<<<<<< HEAD
          ></textarea>
          <button onClick={handleSubmit}>등록</button>
=======
          />
          <button onClick={() => {
            if (!newComment.trim()) return;
            handleAction([], "reply", { text: newComment });
            setNewComment("");
          }}>등록</button>
>>>>>>> bff76f3 ('25.04.03)
        </div>
      ) : (
        <p>댓글을 작성하려면 로그인하세요.</p>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> bff76f3 ('25.04.03)
