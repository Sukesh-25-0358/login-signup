"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { login as loginApi } from "@/lib/api";

type LoginFormState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type LoginFormErrors = {
  email?: string;
  password?: string;
  form?: string;
};

const initialLoginState: LoginFormState = {
  email: "",
  password: "",
  rememberMe: false,
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormState>(initialLoginState);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (values: LoginFormState): LoginFormErrors => {
    const newErrors: LoginFormErrors = {};

    if (!values.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim().toLowerCase())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!values.password) {
      newErrors.password = "Password is required.";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    return newErrors;
  };

  const handleChange =
    (field: keyof LoginFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "rememberMe" ? event.target.checked : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors((prev) => ({ ...prev, form: undefined }));

      await loginApi({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      setForm(initialLoginState);
      setErrors((prev) => ({ ...prev, form: "Login successful!" }));
    } catch (error) {
      const isNetworkError =
        error instanceof TypeError ||
        (error instanceof Error &&
          (error.message === "Failed to fetch" ||
            error.message.includes("NetworkError") ||
            error.message.includes("load failed")));
      if (isNetworkError) {
        router.push("/backend-error");
        return;
      }
      const message =
        error instanceof Error ? error.message : "Login failed. Please try again.";
      setErrors((prev) => ({ ...prev, form: message }));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="login-page min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 py-6">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-10 auth-layout">
        <div className="w-full lg:w-1/2 flex items-center justify-center py-4 sm:py-6 lg:py-0 order-2 lg:order-1">
          <img
            src="/login.png"
            alt="Secure login illustration"
            className="auth-image w-[85%] sm:w-[70%] lg:w-[90%] max-w-[550px] object-contain"
          />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2">
          <div
            className="
            relative overflow-hidden w-full max-w-[520px]
            min-h-0 lg:min-h-[min(85vh,720px)]
            max-h-[min(95vh,900px)]
            bg-gradient-to-b from-[#5f82e8] via-[#3f66c9] to-[#021a46]
            rounded-[10px] px-6 sm:px-10 flex flex-col
          "
          >
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[78%] -translate-x-1/2 bg-gradient-to-b from-white/10 via-black/10 to-black/35" />
            <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_20px_0_45px_rgba(0,0,0,0.55),inset_-20px_0_45px_rgba(0,0,0,0.55)]" />
            <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.25)]" />

            <div className="relative z-10 flex flex-col flex-1 min-h-0 auth-card-content px-4 sm:px-6 pt-8 sm:pt-14 pb-6 sm:pb-10 text-white">
              <div className="w-full flex justify-center flex-shrink-0">
                <h1 className="font-welcome-heading text-xl sm:text-2xl md:text-3xl text-center font-semibold mb-4 sm:mb-7">
                  WELCOME
                </h1>
              </div>

              <div className="flex justify-center mb-4 sm:mb-8 flex-shrink-0">
                <div className="bg-white w-[160px] sm:w-[180px] lg:w-[200px] h-[60px] sm:h-[70px] lg:h-[80px] rounded-[50%] flex items-center justify-center shadow-lg overflow-hidden">
                  <img src="/stackly-logo.png" alt="Stackly Logo" className="h-5 sm:h-6 lg:h-8 object-contain" />
                </div>
              </div>

              <form onSubmit={handleLogin} noValidate>
                <div className="space-y-4 sm:space-y-6 flex-shrink-0">
                  <div className="flex flex-col">
                    <div className="flex items-center border-b border-white/60 pb-2">
                      <FaEnvelope className="mr-4 text-sm opacity-80" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange("email")}
                        className="bg-transparent outline-none w-full placeholder-white text-sm"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "login-email-error" : undefined}
                      />
                    </div>
                    {errors.email && (
                      <p id="login-email-error" className="auth-error-text mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center border-b border-white/60 pb-2 relative">
                      <FaLock className="mr-4 text-sm opacity-80 flex-shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange("password")}
                        className="bg-transparent outline-none w-full placeholder-white text-sm pr-9"
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "login-password-error" : undefined}
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1 flex-shrink-0 w-5 h-5 flex items-center justify-center"
                        onClick={() => setShowPassword((p) => !p)}
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        ) : (
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p id="login-password-error" className="auth-error-text mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 text-xs opacity-90 flex-shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.rememberMe}
                      onChange={handleChange("rememberMe")}
                      className="h-3.5 w-3.5 rounded border border-white/60 bg-transparent accent-[#2d8cf0]"
                    />
                    <span>Remember me</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="forgot-password-link text-white no-underline hover:text-white hover:underline decoration-1 underline-offset-4 text-[13px]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {errors.form && (
                  <p
                    className={`mt-3 text-xs font-medium ${errors.form === "Login successful!" ? "text-green-300" : "auth-error-text"}`}
                  >
                    {errors.form}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 w-full h-[45px] bg-gradient-to-r from-[#2d8cf0] to-[#5a78c7] rounded-md text-sm font-medium shadow-md hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {isSubmitting ? "Checking..." : "Login"}
                </button>
              </form>

              <p className="text-center text-xs mt-3 text-white opacity-90 flex-shrink-0">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}