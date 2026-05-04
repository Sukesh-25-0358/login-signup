"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifiedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "";
  const createNewPasswordUrl = contact
    ? `/create-new-password?contact=${encodeURIComponent(contact)}`
    : "/create-new-password";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 py-6">
      <button
        type="button"
        onClick={() => router.push("/forgot-password")}
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
              src="/tick.webp"
              alt="Verified"
              className="w-[96px] h-[96px] object-contain"
            />
          </div>
          <h1
            className="text-[20px] sm:text-[24px] font-bold mb-2"
            style={{ color: "#FFFFFF" }}
          >
            Verified !
          </h1>
          <p
            className="text-[12px] sm:text-[13px] leading-relaxed mb-6 italic"
            style={{ color: "#FFFFFF" }}
          >
            You have successfully verified
          </p>
          <button
            type="button"
            onClick={() => router.push(createNewPasswordUrl)}
            className="w-full max-w-[200px] mx-auto rounded-[1000px] text-[14px] sm:text-[15px] font-bold shadow-md hover:opacity-95 transition flex items-center justify-center"
            style={{
              height: "40px",
              backgroundColor: "#F2B541",
              color: "#000000",
            }}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifiedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white px-4 text-sm text-[#64748b]">
          Loading…
        </div>
      }
    >
      <VerifiedContent />
    </Suspense>
  );
}
