import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, isPasswordValid } from "../utils/validation";
import PasswordStrength from "../components/PasswordStrength";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
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
    if (!form.name.trim()) errs.name = "Name is required";
    else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";

    if (!form.email.trim()) errs.email = "Email is required";
    else if (!isValidEmail(form.email)) errs.email = "Enter a valid email address";

    if (!form.password) errs.password = "Password is required";
    else if (!isPasswordValid(form.password)) errs.password = "Password doesn't meet the requirements below";

    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const result = await signup({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    });
    setLoading(false);

    if (result.success) navigate("/");
    else setServerError(result.message);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-2 inline-block text-2xl font-bold text-primary">
            notes<span className="text-gray-100">.</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-100">Create your account</h1>
          <p className="mt-1 text-sm text-muted">Start capturing your ideas in seconds</p>
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
            <label className="form-label" htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

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

          <div className="mb-1 flex flex-col gap-1.5">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className={`form-input ${errors.password ? "error" : ""}`}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>
          <PasswordStrength password={form.password} />

          <div className="mb-5 mt-4 flex flex-col gap-1.5">
            <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={`form-input ${errors.confirmPassword ? "error" : ""}`}
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;