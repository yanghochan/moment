// utils/csvExporter.js
export function exportUsersToCSV(users) {
    const headers = ["아이디", "닉네임", "역할", "가입일"];
    const rows = users.map(u => [
      u.username,
      u.nickname,
      u.role,
      u.createdAt,
    ]);
  
    let csvContent = "data:text/csv;charset=utf-8,"
      + [headers, ...rows].map(e => e.join(",")).join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "moment_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  