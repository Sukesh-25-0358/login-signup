"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { register as registerApi } from "@/lib/api";

type SignupFormState = {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
};

type SignupFormErrors = {
  name?: string;
  email?: string;
  mobileNumber?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

const initialSignupState: SignupFormState = {
  name: "",
  email: "",
  mobileNumber: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignupFormState>(initialSignupState);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const setOverflow = () => {
      document.body.style.overflow = mql.matches ? "hidden" : "";
    };
    setOverflow();
    mql.addEventListener("change", setOverflow);
    return () => {
      mql.removeEventListener("change", setOverflow);
      document.body.style.overflow = "";
    };
  }, []);


  const validate = (values: SignupFormState): SignupFormErrors => {
    const newErrors: SignupFormErrors = {};

    if (!values.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (values.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (!/^[a-zA-Z\s]+$/.test(values.name.trim())) {
      newErrors.name = "Name must contain only letters.";
    }

    if (!values.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim().toLowerCase())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!values.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^[0-9]{10}$/.test(values.mobileNumber.trim())) {
      newErrors.mobileNumber = "Mobile number must be exactly 10 digits.";
    }

    if (!values.password) {
      newErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else {
      const hasLower = /[a-z]/.test(values.password);
      const hasUpper = /[A-Z]/.test(values.password);
      const hasNumber = /[0-9]/.test(values.password);
      const hasSpecial = /[!@#$%^&*(),.?\x3a{}|<>]/.test(values.password);
      if (!hasLower) {
        newErrors.password = "Password must include a lowercase letter.";
      } else if (!hasUpper) {
        newErrors.password = "Password must include an uppercase letter.";
      } else if (!hasNumber) {
        newErrors.password = "Password must include a number.";
      } else if (!hasSpecial) {
        newErrors.password = "Password must include a special character (!@#$%^&* etc.).";
      }
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleChange =
    (field: keyof SignupFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;
      // Keep mobile number numeric only at input-level (no alphabets).
      if (field === "mobileNumber") {
        value = value.replace(/\D/g, "").slice(0, 10);
      }
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors((prev) => ({ ...prev, form: undefined }));

      await registerApi({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        ...(form.mobileNumber.trim() && { mobileNumber: form.mobileNumber.trim() }),
      });

      setForm(initialSignupState);
      setErrors((prev) => ({ ...prev, form: "Signup successful!" }));
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
        error instanceof Error ? error.message : "Registration failed. Please try again.";
      setErrors((prev) => ({ ...prev, form: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page min-h-screen bg-white flex flex-col px-3 sm:px-6 py-0 sm:py-4 overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 sm:gap-6 lg:gap-8 auth-layout">
        {/* Card first on mobile (top), right on desktop */}
        <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
          <div
            className="relative overflow-hidden w-full max-w-[520px] bg-gradient-to-b from-[#5f82e8] via-[#3f66c9] to-[#021a46] rounded-[10px] px-6 sm:px-10 flex flex-col signup-card auth-form-card"
          >
            <div className="auth-inner-panel pointer-events-none absolute inset-y-0 left-1/2 w-[78%] -translate-x-1/2 bg-gradient-to-b from-white/10 via-black/10 to-black/35" />
            <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_20px_0_45px_rgba(0,0,0,0.55),inset_-20px_0_45px_rgba(0,0,0,0.55)]" />
            <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.25)]" />

            <div className="relative z-10 flex flex-col flex-1 min-h-0 min-w-0 px-4 sm:px-6 pt-2.5 sm:pt-4 pb-2 sm:pb-3 lg:pt-8 lg:pb-6 text-white signup-card-content text-left justify-between">
              <div className="w-full flex justify-center flex-shrink-0 min-w-0">
                <h1 className="inline-block font-welcome-heading text-xl sm:text-2xl text-center font-semibold mb-3 sm:mb-2.5 lg:mb-4 tracking-widest">
                  WELCOME
                </h1>
              </div>

              <div className="flex justify-center mb-3 sm:mb-2.5 lg:mb-4 flex-shrink-0">
                <div className="bg-white w-[120px] sm:w-[140px] lg:w-[180px] h-[44px] sm:h-[52px] lg:h-[64px] rounded-[50%] flex items-center justify-center shadow-lg overflow-hidden">
                  <img src="/stackly-logo.webp" alt="Stackly Logo" className="h-3.5 sm:h-4 lg:h-7 object-contain" />
                </div>
              </div>

              <form onSubmit={handleSignup} noValidate>
                <div className="space-y-3 sm:space-y-2.5 lg:space-y-3 flex-shrink-0">
                  <div className="flex flex-col">
                    <div className="flex items-center border-b border-white/80 pb-2">
                      <FaUser className="mr-3 text-sm text-white/90" />
                      <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange("name")}
                        className="bg-transparent outline-none w-full placeholder-white/90 text-sm text-white"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                      />
                    </div>
                    {errors.name && (
                      <p id="name-error" className="auth-error-text mt-0.5 text-[11px] sm:text-xs">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center border-b border-white/80 pb-2">
                      <FaEnvelope className="mr-3 text-sm text-white/90" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange("email")}
                        className="bg-transparent outline-none w-full placeholder-white/90 text-sm text-white"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                    </div>
                    {errors.email && (
                      <p id="email-error" className="auth-error-text mt-0.5 text-[11px] sm:text-xs">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center border-b border-white/80 pb-2">
                      <FaPhone className="mr-3 text-sm text-white/90" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Mobile number"
                        value={form.mobileNumber}
                        onChange={handleChange("mobileNumber")}
                        className="bg-transparent outline-none w-full placeholder-white/90 text-sm text-white min-w-0"
                        aria-invalid={!!errors.mobileNumber}
                        aria-describedby={errors.mobileNumber ? "mobile-error" : undefined}
                      />
                    </div>
                    {errors.mobileNumber && (
                      <p id="mobile-error" className="auth-error-text mt-0.5 text-[11px] sm:text-xs">
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center border-b border-white/80 pb-2 relative">
                      <FaLock className="mr-3 text-sm text-white/90 flex-shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange("password")}
                        className="bg-transparent outline-none w-full placeholder-white/90 text-sm text-white pr-9"
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "password-error" : undefined}
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
                      <p id="password-error" className="auth-error-text mt-0.5 text-[11px] sm:text-xs">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center border-b border-white/80 pb-2 relative">
                      <FaLock className="signup-confirm-icon mr-3 text-sm text-white/90 flex-shrink-0" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        className="bg-transparent outline-none w-full placeholder-white/90 text-sm text-white pr-9 signup-confirm-input"
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                      />
                      <button
                        type="button"
                        aria-label="Toggle confirm password visibility"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1 flex-shrink-0 w-5 h-5 flex items-center justify-center"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        ) : (
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p id="confirmPassword-error" className="auth-error-text mt-0.5 text-[11px] sm:text-xs">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {errors.form && (
                  <p
                    className={`mt-1.5 text-[11px] sm:text-xs font-medium ${errors.form === "Signup successful!" ? "text-green-300" : "auth-error-text"}`}
                  >
                    {errors.form}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-3 mb-2 w-full h-[42px] flex-shrink-0 bg-gradient-to-r from-[#2d8cf0] to-[#5a78c7] rounded-md text-sm font-medium text-white shadow-md hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Checking..." : "Sign Up"}
                </button>
              </form>

              <div className="flex-shrink-0 mt-2">
                <p className="text-center text-xs mt-1.5 text-white/80">
                  Already have an account?{" "}
                  <Link href="/login" className="text-amber-300 hover:text-amber-200 font-medium">
                    Login
                  </Link>
                </p>

                <div className="mt-2 mb-2 border-t border-white/50" />

                <div className="pt-0.5 pb-2 sm:pt-1 sm:pb-4">
                  <a
                    href={
                      "https://accounts.google.com/o/oauth2/v2/auth" +
                      "?client_id=703831654489-m34p97it8cppn924006cgt8u6jgk9tsa.apps.googleusercontent.com" +
                      "&redirect_uri=http://localhost:5000/api/auth/google" +
                      "&response_type=code" +
                      "&scope=openid%20email%20profile" +
                      "&access_type=online" +
                      "&prompt=select_account"
                    }
                    className="w-full h-[42px] border border-white/80 rounded-md flex items-center justify-center text-sm font-medium bg-transparent text-white hover:bg-white hover:text-[#0c2b5a] transition"
                  >
                    <FcGoogle className="mr-3 text-lg" />
                    Sign up with Google
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Illustration below on mobile, left on desktop */}
        <div className="auth-image-col w-full lg:w-1/2 flex justify-center order-2 lg:order-1 mt-6 sm:mt-8 lg:mt-0">
          <img
            src="/illustration.webp"
            alt="Illustration"
            className="auth-image w-[80%] sm:w-[80%] lg:w-[88%] max-w-[520px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
