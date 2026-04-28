"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp } from "@/lib/api";

export default function VerifyMobilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "+91-XXXXXXXXXX";
  const [code, setCode] = useState(["", "", "", ""]);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const isCodeComplete = code.every((digit) => digit !== "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
      setCode((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
      if (value && index < 3) {
        const nextInput = document.getElementById(`mobile-otp-${index + 1}`);
        nextInput?.focus();
      }
      setError("");
    };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isCodeComplete) {
      setError("Please enter the complete 4-digit code.");
      return;
    }
    setIsSubmitting(true);
    try {
      await verifyOtp({
        contact: contact,
        code: code.join(""),
      });
      router.push("/verified");
    } catch (err) {
      const isNetworkError =
        err instanceof TypeError ||
        (err instanceof Error &&
          (err.message === "Failed to fetch" ||
            err.message.includes("NetworkError") ||
            err.message.includes("load failed")));
      const message = isNetworkError
        ? "Connection error. Please try again."
        : err instanceof Error
          ? err.message
          : "Verification failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 py-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute left-4 top-4 text-2xl text-black"
        aria-label="Go back"
      >
        ←
      </button>
      <div className="w-full max-w-[480px]">
        <div
          className="relative overflow-hidden w-full rounded-xl px-8 sm:px-10 py-8 sm:py-10 text-center"
          style={{
            background: "linear-gradient(180deg, #234E70 0%, #282738 100%)",
            boxShadow: "4px 4px 4px 0 rgba(0,0,0,0.25)",
          }}
        >
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src="/mobile.webp"
              alt="Mobile verification"
              className="w-[96px] h-[96px] object-contain"
            />
          </div>
          <h1 className="text-[20px] sm:text-[24px] font-bold mb-2" style={{ color: "#FFFFFF" }}>
            Verify your Mobile
          </h1>
          <p className="text-[12px] sm:text-[13px] leading-relaxed mb-6" style={{ color: "#FFFFFF" }}>
            Please enter the 4 digit code sent to your<br />
            Registered mobile number {contact}
          </p>

          <form onSubmit={handleConfirm} className="space-y-6">
            <div className="flex justify-center gap-3 sm:gap-4">
              {code.map((value, idx) => (
                <input
                  key={idx}
                  id={`mobile-otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={handleChange(idx)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded border bg-transparent text-center text-lg text-white outline-none focus:border-white/80"
                  style={{
                    border: "1px solid rgba(255,255,255,0.7)",
                  }}
                />
              ))}
            </div>

            <p
              className="text-[12px] sm:text-[13px]"
              style={{ color: "#FFFFFF" }}
            >
              Want to change your Mobile Number?{" "}
              <button
                type="button"
                onClick={() =>
                  router.push("/forgot-password?changeFrom=verify-mobile")
                }
                className="underline font-semibold"
                style={{ color: "#F2B541" }}
              >
                Change Here
              </button>
            </p>

            <button
              type="submit"
              disabled={!isCodeComplete || isSubmitting}
              className="w-full max-w-[260px] mx-auto rounded-[1000px] text-[16px] sm:text-[17px] font-bold shadow-md hover:opacity-95 transition flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                height: "48px",
                backgroundColor: "#F2B541",
                color: "#FFFFFF",
              }}
            >
              {isSubmitting ? "Verifying..." : "Confirm"}
            </button>

            {error && (
              <p className="text-[12px] mt-1" style={{ color: "#F2B541" }}>
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={() =>
                setInfo("Code resent. (Hook up backend mobile resend here.)")
              }
              className="text-[12px] sm:text-[13px] underline font-semibold"
              style={{ color: "#FFFFFF" }}
            >
              Resend CODE
            </button>
            {info && (
              <p className="text-[11px] sm:text-[12px] mt-1" style={{ color: "#FFFFFF" }}>
                {info}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

