import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { LockIcon, MailIcon, UserIcon, LoaderIcon, ShieldCheckIcon, CpuIcon, LayersIcon } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
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
                    REGISTRATION // NEW
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-console-text">
                    Create Workspace Identity
                  </h1>
                  <p className="text-console-text-muted text-sm mt-1">
                    Set up your operator credentials to join live channels.
                  </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* FULL NAME */}
                  <div>
                    <label className="auth-input-label">Operator Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="console-input"
                        placeholder="Alex Rivera"
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>

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
                    <label className="auth-input-label">Passkey (Min 6 chars)</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="console-input"
                        placeholder="••••••••••••"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    className="console-btn-primary mt-2"
                    type="submit"
                    disabled={isSigningUp}
                  >
                    {isSigningUp ? (
                      <LoaderIcon className="size-5 animate-spin text-center" />
                    ) : (
                      "Register Identity"
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-console-border text-center">
                  <Link to="/login" className="text-sm text-console-text-muted hover:text-console-accent transition-colors font-medium">
                    Existing operator? Sign in
                  </Link>
                </div>
              </div>
            </div>

            {/* TELEMETRY COLUMN - RIGHT */}
            <div className="hidden md:w-1/2 md:flex flex-col justify-between p-10 bg-console-surface-subtle">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-console-text-muted mb-8 pb-4 border-b border-console-border">
                  <span>ARCHITECTURE SPEC</span>
                  <span className="text-console-accent">NODE PROTOCOL</span>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-console-surface border border-console-border text-console-accent shrink-0">
                      <CpuIcon className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-console-text">Optimized Engine</h3>
                      <p className="text-xs text-console-text-muted mt-0.5 leading-relaxed">
                        Pure React 19 architecture without bloated UI bundles or third-party tracking scripts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-console-surface border border-console-border text-console-accent shrink-0">
                      <LayersIcon className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-console-text">High Density Hierarchy</h3>
                      <p className="text-xs text-console-text-muted mt-0.5 leading-relaxed">
                        Dual typography scale pairing Plus Jakarta Sans typography with JetBrains Mono telemetry.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-console-surface border border-console-border text-console-accent shrink-0">
                      <ShieldCheckIcon className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-console-text">Granular State Privacy</h3>
                      <p className="text-xs text-console-text-muted mt-0.5 leading-relaxed">
                        Password hashes never touch client memory; secured with HttpOnly JWT session tokens.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded border border-console-border bg-console-surface flex items-center justify-between font-mono text-xs text-console-text-muted">
                <span>IDENTITY: ANONYMIZED</span>
                <span className="text-console-accent">SECURE TRANSMISSION</span>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default SignUpPage;
