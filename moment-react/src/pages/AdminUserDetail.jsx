// AdminUserDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/AdminUserDetail.css";


export default function AdminUserDetail() {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/user/${username}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [username]);

  if (!user) return <p>불러오는 중...</p>;

  return (
    <div className="admin-user-detail">
      <h2>👤 {user.nickname} 상세정보</h2>
      <p>아이디: {user.username}</p>
      <p>가입일: {new Date(user.createdAt).toLocaleDateString()}</p>
      <p>역할: {user.role}</p>
      {/* 글, 댓글 등 추가 정보 */}
    </div>
  );
}
