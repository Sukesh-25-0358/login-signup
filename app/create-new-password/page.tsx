"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateNewPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const requirementText =
    "Password Must be 8-60 characters and include at least two of the Following: Uppercase, Lowercase, number, or symbol.";

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 60) {
      setError("Password must be 8-60 characters.");
      return;
    }
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSymbol = /[^A-Za-z0-9]/.test(newPassword);
    const count = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
    if (count < 2) {
      setError(requirementText);
      return;
    }
    // TODO: call API to update password, then redirect to login
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 py-6">
      <button
        type="button"
        onClick={() => router.push("/verified")}
        className="absolute left-4 top-4 text-2xl text-black z-10"
        aria-label="Go back"
      >
        ←
      </button>
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-12">
        {/* Left: Illustration (optional, matches new.png layout) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center order-2 lg:order-1">
          <img
            src="/new.png"
            alt="Create new password"
            className="w-[85%] sm:w-[80%] lg:w-[88%] max-w-[480px] object-contain"
          />
        </div>
        {/* Right: Create New Password form card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2">
          <div
            className="relative overflow-hidden w-full max-w-[420px] rounded-xl px-8 sm:px-10 py-8 sm:py-10"
            style={{
              background: "linear-gradient(180deg, #234E70 0%, #282738 100%)",
              boxShadow: "4px 4px 4px 0 rgba(0,0,0,0.25)",
            }}
          >
            <h1
              className="text-[20px] sm:text-[24px] font-bold text-center mb-6"
              style={{ color: "#FFFFFF" }}
            >
              Create New Password
            </h1>
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-[13px] sm:text-[14px] mb-2"
                  style={{ color: "#FFFFFF" }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full h-12 pl-4 pr-12 rounded border text-[14px] outline-none focus:border-white/80 transition bg-transparent"
                    style={{
                      border: "1px solid rgba(255,255,255,0.5)",
                      color: "#FFFFFF",
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-[13px] sm:text-[14px] mb-2"
                  style={{ color: "#FFFFFF" }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full h-12 pl-4 pr-12 rounded border text-[14px] outline-none focus:border-white/80 transition bg-transparent"
                    style={{
                      border: "1px solid rgba(255,255,255,0.5)",
                      color: "#FFFFFF",
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <p
                className="text-[11px] sm:text-[12px] leading-relaxed"
                style={{ color: "#FFFFFF" }}
              >
                {requirementText}
              </p>
              {error && (
                <p className="text-[12px]" style={{ color: "#ff6b6b" }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full max-w-[240px] mx-auto rounded-lg text-[12px] sm:text-[13px] font-bold uppercase shadow-md hover:opacity-95 transition flex items-center justify-center"
                style={{
                  height: "36px",
                  backgroundColor: "#F2B541",
                  color: "#FFFFFF",
                }}
              >
                UPDATE PASSWORD
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
