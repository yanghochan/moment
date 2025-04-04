// AdminStatsChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d"];

export default function AdminStatsChart({ users }) {
  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.length - adminCount;

  const data = [
    { name: "관리자", value: adminCount },
    { name: "일반 유저", value: userCount },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" label outerRadius={100}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
