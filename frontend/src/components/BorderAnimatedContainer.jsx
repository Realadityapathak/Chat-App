import { useAuthStore } from "../store/useAuthStore";

// Animated gradient border container: Default Samvad Slate/Cyan when logged out, dynamic theme when logged in
function BorderAnimatedContainer({ children }) {
  const { authUser } = useAuthStore();

  return (
    <div
      className={`w-full h-full rounded-none sm:rounded-2xl border-0 sm:border border-transparent animate-border flex overflow-hidden shadow-2xl ${
        authUser
          ? "[background:linear-gradient(45deg,hsl(var(--b1)),hsl(var(--b2))_50%,hsl(var(--b1)))_padding-box,conic-gradient(from_var(--border-angle),hsl(var(--b3)/.48)_80%,hsl(var(--p))_86%,hsl(var(--a))_90%,hsl(var(--p))_94%,hsl(var(--b3)/.48))_border-box]"
          : "[background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.cyan.500)_86%,_theme(colors.cyan.300)_90%,_theme(colors.cyan.500)_94%,_theme(colors.slate.600/.48))_border-box]"
      }`}
    >
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;
