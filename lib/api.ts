export const BACKEND_BASE_URL = "http://localhost:5000";

export type LoginBody = {
  email: string;
  password: string;
};

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  mobileNumber?: string;
};

export type VerifyOtpBody = {
  contact: string;
  code: string;
};

/** POST /api/auth/verify-otp - Verify email or mobile OTP */
export async function verifyOtp(body: VerifyOtpBody): Promise<unknown> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message ?? "Invalid or expired code. Please try again."
    );
  }

  return data;
}
/** POST /api/auth/login */
export async function login(body: LoginBody): Promise<unknown> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? "Login failed");
  }

  return data;
}

/** POST /api/auth/register */
export async function register(body: RegisterBody): Promise<unknown> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message ?? "Registration failed"
    );
  }

  return data;
}
