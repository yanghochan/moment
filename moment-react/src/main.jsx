// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";

// 🧍 사용자 페이지
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserPage from "./pages/MyPage";
import PostViewer from "./pages/PostViewer";
import PostEditor from "./pages/PostEditor";
import NotFound from "./pages/NotFound";

// 🔐 관리자 페이지
import AdminPage from "./pages/AdminPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

// 🎨 전역 스타일
import "./styles/theme.css";
import "./styles/global.css";
import "./styles/UserPage.css";
import "./styles/Header.css";

// 🧠 인증 컨텍스트
import { AuthProvider } from "./contexts/AuthContext";

// 🌐 라우터 구성
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // 사용자 영역
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "user/:username", element: <UserPage /> },
      { path: "write", element: <PostEditor /> },
      { path: "edit/:username/:category/:slug", element: <PostEditor /> },
      { path: "users/:username/posts/:category/:slug", element: <PostViewer /> },

      // 관리자 전용 영역
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <AdminPage /> },
          { path: "register", element: <AdminRegisterPage /> },
        ],
      },

      // 404 페이지
      { path: "*", element: <NotFound /> },
    ],
  },
]);

// 🚀 앱 실행
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
