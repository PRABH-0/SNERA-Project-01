 "use client";
 import React, { useState } from "react";

type Props = {
  loginData: { email: string; password: string };
  onLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoginSubmit: (e: React.FormEvent) => Promise<void> | void;
  switchToRegister: () => void;
  error?: string;
};

const SignInForm: React.FC<Props> = ({
  loginData,
  onLoginChange,
  onLoginSubmit,
  switchToRegister,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDown = () => setShowPassword(true);
  const handleMouseUpLeave = () => setShowPassword(false);

  return (
    <>
      <h1 className="text-[var(--text-primary)] text-3xl font-bold mb-6 text-center">
        Welcome Back
      </h1>

      <form onSubmit={onLoginSubmit}>
        {/* Email */}
        <h4 className="text-[var(--text-primary)] text-sm mt-6 font-medium">
          Email Address
        </h4>
        <input
          name="email"
          value={loginData.email}
          onChange={onLoginChange}
          className={`border w-full p-2 rounded-lg my-1 mb-4 border-[var(--border-line)] placeholder:text-[var(--text-tertiary)] bg-[var(--input-bg)] focus:border-[var(--border-color)] ${
            error ? "border-red-500" : ""
          }`}
          placeholder="Email"
          type="email"
          required
        />

        {/* Password */}
        <h4 className="text-[var(--text-primary)] my-1 text-sm font-medium">
          Password
        </h4>

        <div className="relative">
          <input
            name="password"
            value={loginData.password}
            onChange={onLoginChange}
            className={`border w-full p-2 pr-10 rounded-lg border-[var(--border-line)] placeholder:text-[var(--text-tertiary)] bg-[var(--input-bg)] focus:border-[var(--border-color)] ${
              error ? "border-red-500" : ""
            }`}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            required
          />

          {/* Simple Eye Icon */}
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUpLeave}
            onMouseLeave={handleMouseUpLeave}
          >
            {/* Closed Eye */}
            {!showPassword && (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-secondary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <line x1="3" y1="3" x2="21" y2="21" />
              </svg>
            )}

            {/* Open Eye */}
            {showPassword && (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3 bg-red-100 border-l-4 border-red-500 p-2 rounded">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="text-[var(--button-text)] w-full p-3 mt-8 rounded-lg bg-[var(--accent-color)] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_var(--shadow-color)]"
        >
          Sign In
        </button>
      </form>

      <div className="border-t border-[var(--border-color)] mt-10">
        <div className="text-[var(--text-secondary)] text-center">
          Don’t have an account?{" "}
          <button
            onClick={switchToRegister}
            className="mt-6 underline text-[var(--accent-color)] font-bold cursor-pointer"
          >
            Sign up here
          </button>
        </div>
      </div>
    </>
  );
};

export default SignInForm;
