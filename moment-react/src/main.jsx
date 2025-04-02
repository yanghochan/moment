<<<<<<< HEAD
// main.jsx

=======
// src/main.jsx
>>>>>>> bff76f3 ('25.04.03)
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";

<<<<<<< HEAD
// 🧩 페이지 컴포넌트
=======
// 🧩 사용자 페이지
>>>>>>> bff76f3 ('25.04.03)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserPage from "./pages/MyPage";
import PostViewer from "./pages/PostViewer";
import PostEditor from "./pages/PostEditor";
<<<<<<< HEAD
import NotFound from "./pages/NotFound"; // ✅ 404 페이지 추가
=======
import NotFound from "./pages/NotFound";

// 🔐 관리자 페이지
import AdminPage from "./pages/AdminPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
>>>>>>> bff76f3 ('25.04.03)

// 🎨 전역 스타일
import "./styles/theme.css";
import "./styles/global.css";
import "./styles/UserPage.css";
import "./styles/Header.css";

<<<<<<< HEAD
// 🔗 라우터 설정
=======
// 🧠 인증 컨텍스트
import { AuthProvider } from "./contexts/AuthContext";

// 🌐 라우터 구성
>>>>>>> bff76f3 ('25.04.03)
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
<<<<<<< HEAD
=======
      // 🧍 사용자 영역
>>>>>>> bff76f3 ('25.04.03)
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "user/:username", element: <UserPage /> },
      { path: "write", element: <PostEditor /> },
      { path: "edit/:username/:category/:slug", element: <PostEditor /> },
      { path: "users/:username/posts/:category/:slug", element: <PostViewer /> },
<<<<<<< HEAD
      { path: "*", element: <NotFound /> }, // ✅ 존재하지 않는 경로 처리
=======

      // 🛡️ 관리자 영역 (보호 라우트)
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

      // ❓ 404 Not Found
      { path: "*", element: <NotFound /> },
>>>>>>> bff76f3 ('25.04.03)
    ],
  },
]);

<<<<<<< HEAD
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
=======
// 🚀 앱 실행
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
>>>>>>> bff76f3 ('25.04.03)
