// src/components/admin/AdminUserItem.jsx

export default function AdminUserItem({ user }) {
  const { username, role = "user" } = user;

  return (
    <li className={`admin-user-item ${role === "admin" ? "admin-role" : ""}`}>
      <div className="admin-user-info">
        <span className="admin-user-name">
          {username}
          {role === "admin" && <span className="crown"> 👑</span>}
        </span>
        {role === "admin" && (
          <span className="admin-user-badge">관리자</span>
        )}
      </div>

      <div className="admin-user-role">
        {role === "admin" ? "관리자 계정" : "일반 유저"}
      </div>
    </li>
  );
}