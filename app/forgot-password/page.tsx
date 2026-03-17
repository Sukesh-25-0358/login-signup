"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim().toLowerCase());

  const isMobile = (value: string) =>
    /^\+?[0-9]{6,15}$/.test(value.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const trimmed = email.trim();
    const isEmailContact = validateEmail(trimmed);
    const isMobileContact = isMobile(trimmed);

    if (!isEmailContact && !isMobileContact) {
      setError("Enter a valid email or mobile number");
      return;
    }
    const targetRoute = isEmailContact ? "/verify-email" : "/verify-mobile";
    const encodedContact = encodeURIComponent(trimmed);

    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed.toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(
          (data as { message?: string }).message ||
            "If an account exists, you will receive a reset link."
        );
        router.push(`${targetRoute}?contact=${encodedContact}`);
      } else {
        setMessage(
          (data as { message?: string }).message ||
            "Could not send reset link. Try again later."
        );
      }
    } catch {
      setMessage("Connection error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 py-6">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-12 auth-layout">
        {/* LEFT: Illustration */}
        <div className="auth-image-col w-full lg:w-1/2 flex items-center justify-center order-2 lg:order-1">
          <img
            src="/password.webp"
            alt="Password reset illustration"
            className="auth-image w-[85%] sm:w-[80%] lg:w-[88%] max-w-[480px] object-contain"
          />
        </div>
        {/* RIGHT: Forgot password form card - exact gradient & continue size */}
        <div className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2">
          <div
            className="relative overflow-hidden w-full max-w-[420px] rounded-xl px-8 sm:px-10 py-8 sm:py-10"
            style={{
              background: "linear-gradient(180deg, #234E70 0%, #282738 100%)",
              boxShadow: "4px 4px 4px 0 rgba(0,0,0,0.25)",
            }}
          >
            <h1
              className="text-[20px] sm:text-[24px] font-bold text-center mb-3"
              style={{ color: "#FFFFFF" }}
            >
              Forgot Your Password?
            </h1>
            <p
              className="text-center text-[13px] sm:text-[14px] mb-5 leading-relaxed"
              style={{ color: "#FFFFFF" }}
            >
              Enter your email address or mobile number and we will send you
              instructions to reset your password.
            </p>
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col items-center space-y-5">
                <div className="w-full max-w-[316px]">
                  <input
                    type="text"
                    inputMode="email"
                    placeholder="Email or mobile number"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="forgot-input w-full h-12 px-5 rounded-[1000px] border text-[14px] text-center outline-none focus:border-white/80 transition bg-transparent"
                    style={{
                      border: "1px solid rgba(255,255,255,0.5)",
                      color: "#FFFFFF",
                      textAlign: "center",
                    }}
                  />
                  {error && (
                    <p className="auth-error-text mt-1 text-center">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-[260px] rounded-[1000px] text-[16px] sm:text-[17px] font-bold shadow-md hover:opacity-95 transition disabled:opacity-60 flex items-center justify-center"
                  style={{
                    height: "48px",
                    backgroundColor: "#F2B541",
                    color: "#FFFFFF",
                  }}
                >
                  {isSubmitting ? "Sending..." : "Continue"}
                </button>
                {message && (
                  <p
                    className={`text-center text-xs ${
                      message.includes("account exists")
                        ? "text-white/95"
                        : "auth-error-text"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>
            </form>
            <div className="w-full max-w-[316px] mx-auto mt-6 text-center">
              <Link
                href="/login"
                className="text-[13px] hover:underline"
                style={{ color: "#FFFFFF" }}
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
