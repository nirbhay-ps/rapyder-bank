import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface-page flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 grid place-items-center serif text-2xl leading-none rounded"
              style={{ background: "#9C1D26", color: "#FFFFFF" }}
              aria-hidden
            >
              ƒ
            </div>
            <div className="text-left">
              <div className="serif text-[22px] leading-none text-ink-900">First AI</div>
              <div className="text-[9px] tracking-[0.18em] uppercase text-ink-500 mt-1">
                {/* OneLenz Platform */}
              </div>
            </div>
          </div>
          <p className="text-[14px] text-ink-500 mt-2">
            Sign in to your workspace
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="surface-card p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="cap-label mb-2 block" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-white border border-surface-rule rounded-md px-4 py-2.5 text-[13px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-maroon transition-colors"
              required
              autoComplete="email"
              data-testid="login-email"
            />
          </div>

          <div>
            <label className="cap-label mb-2 block" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-surface-rule rounded-md px-4 py-2.5 text-[13px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-maroon transition-colors"
              required
              autoComplete="current-password"
              data-testid="login-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-[13px] font-medium disabled:opacity-60"
            data-testid="login-submit"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <div className="pt-4 border-t border-surface-divider">
            {/* <p className="text-[11px] text-ink-400 text-center">
              Protected by OneLenz Auth Service · RBAC enforced
            </p> */}
          </div>
        </form>

        {/* <p className="text-center text-[11px] text-ink-400 mt-6">
          Protected by OneLenz Auth Service · RBAC enforced
        </p> */}
      </div>
    </div>
  );
}
