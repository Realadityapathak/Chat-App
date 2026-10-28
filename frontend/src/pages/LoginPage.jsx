import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { TerminalIcon, MailIcon, LoaderIcon, LockIcon, ShieldCheckIcon, ZapIcon, RadioIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-5xl h-auto min-h-0 sm:min-h-[580px] md:h-[720px] max-h-dvh sm:max-h-[calc(100dvh-2rem)] flex flex-col">
        <BorderAnimatedContainer>
          <div className="w-full h-full flex flex-col md:flex-row overflow-y-auto">
            {/* FORM COLUMN - LEFT */}
            <div className="w-full md:w-1/2 p-6 sm:p-10 flex items-center justify-center md:border-r border-console-border overflow-y-auto bg-console-surface">
              <div className="w-full max-w-sm py-4 sm:py-0">
                {/* HEADER */}
                <div className="mb-6 sm:mb-8 text-left">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-console-surface-subtle border border-console-border text-console-accent text-xs font-mono font-medium mb-4">
                    <span className="size-1.5 rounded-full bg-console-accent animate-pulse" />
                    CONSOLE // V1.0
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-console-text">
                    Authenticate to Console
                  </h1>
                  <p className="text-console-text-muted text-sm mt-1">
                    Enter your credentials to connect to your live channels.
                  </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* EMAIL */}
                  <div>
                    <label className="auth-input-label">Terminal Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="console-input"
                        placeholder="operator@system.io"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="auth-input-label">Access Passkey</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="console-input"
                        placeholder="••••••••••••"
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    className="console-btn-primary mt-2"
                    type="submit"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <LoaderIcon className="size-5 animate-spin text-center" />
                    ) : (
                      "Connect to Console"
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-console-border text-center">
                  <Link to="/signup" className="text-sm text-console-text-muted hover:text-console-accent transition-colors font-medium">
                    New operator? Register identity
                  </Link>
                </div>
              </div>
            </div>

            {/* TELEMETRY COLUMN - RIGHT */}
            <div className="hidden md:w-1/2 md:flex flex-col justify-between p-10 bg-console-surface-subtle">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-console-text-muted mb-8 pb-4 border-b border-console-border">
                  <span>TELEMETRY SPEC</span>
                  <span className="text-console-accent">SYSTEM: ACTIVE</span>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-console-surface border border-console-border text-console-accent shrink-0">
                      <ZapIcon className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-console-text">Instant WebSocket Sync</h3>
                      <p className="text-xs text-console-text-muted mt-0.5 leading-relaxed">
                        Direct-socket event delivery with sub-50ms message latency across active client rooms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-console-surface border border-console-border text-console-accent shrink-0">
                      <RadioIcon className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-console-text">Tactile Audio Deck</h3>
                      <p className="text-xs text-console-text-muted mt-0.5 leading-relaxed">
                        Physical keystroke cadence feedback and subtle auditory dispatch cues.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-console-surface border border-console-border text-console-accent shrink-0">
                      <ShieldCheckIcon className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-console-text">Protected Channel Ingress</h3>
                      <p className="text-xs text-console-text-muted mt-0.5 leading-relaxed">
                        Arcjet bot classification, rate-limited sockets, and stateless JWT verification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded border border-console-border bg-console-surface flex items-center justify-between font-mono text-xs text-console-text-muted">
                <span className="flex items-center gap-2">
                  <TerminalIcon className="size-3.5 text-console-accent" />
                  NODE_ENV: ACTIVE
                </span>
                <span>STATUS: 200 OK</span>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default LoginPage;
