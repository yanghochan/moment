// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

// 일반 페이지
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostEditor from "./pages/PostEditor";
import PostViewer from "./pages/PostViewer";
import MyPage from "./pages/MyPage";

// 관리자 페이지
import AdminPage from "./pages/AdminPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import AdminUserDetail from "./pages/AdminUserDetail";
import AdminLayout from "./layouts/AdminLayout"; // ⭐ 추가됨

// 컨텍스트
import { AuthProvider } from "./contexts/AuthContext";

// 스타일
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 공통 레이아웃 - App */}
          <Route path="/" element={<App />}>
            {/* 일반 사용자용 페이지 */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="editor" element={<PostEditor />} />
            <Route path="viewer/:username/:category/:slug" element={<PostViewer />} />
            <Route path="mypage" element={<MyPage />} />

            {/* 관리자 전용 - AdminLayout 사용 */}
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminPage />} />                     {/* /admin */}
              <Route path="register" element={<AdminRegisterPage />} />  {/* /admin/register */}
              <Route path="analytics" element={<AdminAnalyticsPage />} />{/* /admin/analytics */}
              <Route path="user/:username" element={<AdminUserDetail />} /> {/* /admin/user/:username */}
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<h2 style={{ padding: "2rem" }}>🔍 페이지를 찾을 수 없습니다.</h2>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
