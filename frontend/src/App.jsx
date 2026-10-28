import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";

import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // When logged in, apply the user's account theme; when logged out, lock to default "dark"
  const currentTheme = authUser ? (authUser.theme || theme || "dark") : "dark";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div
      data-theme={currentTheme}
      className={`min-h-screen min-h-dvh relative flex items-center justify-center p-0 sm:p-4 overflow-hidden transition-colors duration-300 ${
        authUser ? "bg-base-300 text-base-content" : "bg-slate-900 text-slate-100"
      }`}
    >
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      {authUser ? (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="absolute top-0 -left-4 size-96 bg-primary opacity-15 blur-[100px]" />
          <div className="absolute bottom-0 -right-4 size-96 bg-secondary opacity-15 blur-[100px]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
          <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />
        </>
      )}

      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            maxWidth: "92vw",
            fontSize: "14px",
          },
        }}
      />
    </div>
  );
}
export default App;
