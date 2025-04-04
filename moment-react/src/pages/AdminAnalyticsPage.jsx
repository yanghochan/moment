// src/pages/AdminAnalyticsPage.jsx
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import "../styles/AdminAnalyticsPage.css";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export default function AdminAnalyticsPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/auth/users")
      .then((res) => res.json())
      .then((data) => setUsers(data || []));
  }, []);

  const total = users.length;
  const admins = users.filter(u => u.role === "admin").length;
  const deleted = users.filter(u => u.deleted).length;
  const active = total - deleted;

  const pieData = [
    { name: "일반 사용자", value: total - admins },
    { name: "관리자", value: admins },
  ];

  const barData = users.reduce((acc, user) => {
    const month = new Date(user.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "short" });
    const found = acc.find(item => item.month === month);
    if (found) found.count += 1;
    else acc.push({ month, count: 1 });
    return acc;
  }, []);

  return (
    <main className="admin-analytics">
      <h2>📊 관리자 통계 대시보드</h2>

      {/* 통계 카드 */}
      <div className="stats-cards">
        <div className="card">👥 총 유저 수: <strong>{total}</strong></div>
        <div className="card">👑 관리자 수: <strong>{admins}</strong></div>
        <div className="card">🗑️ 삭제된 계정: <strong>{deleted}</strong></div>
        <div className="card">✅ 활성 유저: <strong>{active}</strong></div>
      </div>

      {/* 차트 영역 */}
      <div className="chart-section">
        <div className="chart-box">
          <h3>📈 월별 가입자 수</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>📊 사용자 비율</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
