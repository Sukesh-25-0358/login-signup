"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 py-6">
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
                      <FaLock className="mr-4 text-sm opacity-80" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange("password")}
                        className="bg-transparent outline-none w-full placeholder-white text-sm pr-10"
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "login-password-error" : undefined}
                      />
                      {/[a-zA-Z0-9]/.test(form.password) && (
                        <button
                          type="button"
                          aria-label="Toggle password visibility"
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
                          onClick={() => setShowPassword((p) => !p)}
                        >
                          {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                        </button>
                      )}
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
                    className="forgot-password-link text-white no-underline hover:text-white hover:no-underline"
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