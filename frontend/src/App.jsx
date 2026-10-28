import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { MotionConfig, LazyMotion, domAnimation } from "motion/react";

import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
    checkAuth();
  }, [checkAuth, initTheme]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <div className="min-h-screen min-h-dvh bg-console-canvas text-console-text relative flex items-center justify-center p-0 sm:p-4 overflow-hidden antialiased">
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
                fontSize: "13px",
                fontFamily: "var(--font-mono, monospace)",
                background: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                borderRadius: "6px",
              },
            }}
          />
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
export default App;
