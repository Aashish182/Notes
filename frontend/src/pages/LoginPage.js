import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../utils/validation";

const EyeIcon = ({ off }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {off ? (
      <>
        <path d="M17.94 17.94A10.94 10.94 0 0112 19c-5 0-9.27-3.11-11-7.5a13.16 13.16 0 012.67-3.94M9.9 4.24A9.12 9.12 0 0112 4c5 0 9.27 3.11 11 7.5a13.06 13.06 0 01-1.67 2.68" />
        <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-7.5 11-7.5S23 12 23 12s-4 7.5-11 7.5S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!isValidEmail(form.email)) errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const result = await login({ email: form.email.trim(), password: form.password });
    setLoading(false);

    if (result.success) navigate("/");
    else setServerError(result.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-2 inline-block text-2xl font-bold text-primary">
            notes<span className="text-gray-100">.</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-100">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Log in to access your notes</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-surface p-6 shadow-lg"
          noValidate
        >
          {serverError && (
            <div className="mb-4 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
              {serverError}
            </div>
          )}

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="mb-5 flex flex-col gap-1.5">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`form-input pr-10 ${errors.password ? "error" : ""}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gray-100"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon off={showPassword} />
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:text-primary-hover">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;