"use client";

import { useState } from "react";
import Link from "next/link";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { register as registerApi } from "@/lib/api";

type SignupFormState = {
  name: string;
  email: string;
  password: string;
};

type SignupFormErrors = {
  name?: string;
  email?: string;
  password?: string;
  form?: string;
};

const initialSignupState: SignupFormState = {
  name: "",
  email: "",
  password: "",
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignupFormState>(initialSignupState);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (values: SignupFormState): SignupFormErrors => {
    const newErrors: SignupFormErrors = {};

    if (!values.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (values.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!values.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim().toLowerCase())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!values.password) {
      newErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    return newErrors;
  };

  const handleChange =
    (field: keyof SignupFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
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
    <div className="h-screen bg-white flex items-stretch justify-center px-6">
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-stretch justify-between gap-10">
        {/* LEFT SIDE IMAGE */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-10 lg:py-0">
          <img
            src="/illustration.png"
            alt="Illustration"
            className="w-[85%] sm:w-[80%] lg:w-[88%] max-w-[520px] object-contain"
          />
        </div>

        {/* RIGHT SIDE CARD */}
        <div className="w-full lg:w-1/2 flex items-stretch justify-center">
          {/* Outer blue block */}
          <div
            className="
            relative
            overflow-hidden
            w-full 
            max-w-[520px]
            lg:h-full
            bg-gradient-to-b
            from-[#5f82e8]
            via-[#3f66c9]
            to-[#021a46]
            rounded-[10px]
            shadow-[0_55px_120px_rgba(0,0,0,0.6)]
            px-10
          "
          >
            {/* Inner panel effect: blended center + only side depth (no top/bottom border) */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[78%] -translate-x-1/2 bg-gradient-to-b from-white/10 via-black/10 to-black/35" />
            <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_20px_0_45px_rgba(0,0,0,0.55),inset_-20px_0_45px_rgba(0,0,0,0.55)]" />
            <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.25)]" />

            <div className="relative z-10 h-full px-10 pt-14 pb-10 text-white">
              {/* WELCOME */}
              <h1 className="font-welcome-heading text-2xl sm:text-3xl text-center font-semibold mb-7">
                WELCOME
              </h1>

              {/* LOGO */}
              <div className="flex justify-center mb-8">
                <div
                  className="
                  bg-white
                  w-[180px] sm:w-[220px]
                  h-[70px] sm:h-[85px]
                  rounded-[50%]
                  flex items-center justify-center
                  shadow-lg
                "
                >
                  <img
                    src="/stackly-logo.png"
                    alt="Stackly Logo"
                    className="h-6 sm:h-8 object-contain"
                  />
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleSignup} noValidate>
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <div className="flex items-center border-b border-white/60 pb-2">
                      <FaUser className="mr-4 text-sm opacity-80" />
                      <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange("name")}
                        className="bg-transparent outline-none w-full placeholder-white text-sm"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                      />
                    </div>
                    {errors.name && (
                      <p
                        id="name-error"
                        className="mt-1 text-xs text-red-300"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

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
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                      />
                    </div>
                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-1 text-xs text-red-300"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center border-b border-white/60 pb-2">
                      <FaLock className="mr-4 text-sm opacity-80" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange("password")}
                        className="bg-transparent outline-none w-full placeholder-white text-sm"
                        aria-invalid={!!errors.password}
                        aria-describedby={
                          errors.password ? "password-error" : undefined
                        }
                      />
                    </div>
                    {errors.password && (
                      <p
                        id="password-error"
                        className="mt-1 text-xs text-red-300"
                      >
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {errors.form && (
                  <p
                    className={`mt-3 text-xs ${errors.form === "Signup successful!" ? "text-green-300" : "text-red-300"}`}
                  >
                    {errors.form}
                  </p>
                )}

                {/* SIGNUP BUTTON (text changed to "SignUp") */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    mt-10
                    w-full
                    h-[45px]
                    bg-gradient-to-r
                    from-[#2d8cf0]
                    to-[#5a78c7]
                    rounded-md
                    text-sm
                    font-medium
                    shadow-md
                    hover:opacity-90
                    transition
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  `}
                >
                  {isSubmitting ? "Checking..." : "SignUp"}
                </button>
              </form>

              {/* LOGIN LINK */}
              <p className="text-center text-xs mt-4 opacity-90">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-yellow-400 cursor-pointer hover:text-yellow-300"
                >
                  Login
                </Link>
              </p>

              {/* DIVIDER */}
              <div className="my-8 border-t border-white/40"></div>

              {/* GOOGLE BUTTON - standard Google OAuth redirect */}
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
                className="
                w-full
                h-[45px]
                border border-white/50
                rounded-md
                flex items-center justify-center
                text-sm
                hover:bg-white
                hover:text-[#0c2b5a]
                transition
              "
              >
                <FcGoogle className="mr-3 text-lg" />
                Sign up with Google
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
