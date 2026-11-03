import { apiFetch } from "../fetch";
import type { AuthUser } from "../../lib/authSession";

export type LoginResponse = { user: AuthUser };
export type MeResponse = { user: AuthUser };

export async function loginApi(email: string, password: string): Promise<{ user: AuthUser; csrfToken: string }> {
  const res = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const csrfToken = res.headers.get("x-csrf-token") ?? "";
  const body = await res.json() as LoginResponse | { error: string };

  if (!res.ok) {
    const err = body as { error: string };
    throw new Error(err.error ?? "Login failed");
  }

  return { user: (body as LoginResponse).user, csrfToken };
}

export async function getMeApi(): Promise<AuthUser> {
  const data = await apiFetch<MeResponse>("/auth/me");
  return data.user;
}

export async function logoutApi(): Promise<void> {
  await apiFetch<void>("/auth/logout", { method: "POST" });
}

export async function forgotPasswordApi(email: string): Promise<void> {
  await apiFetch<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyOtpApi(email: string, otp: string): Promise<{ resetToken: string }> {
  return apiFetch<{ resetToken: string }>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export async function resetPasswordApi(resetToken: string, newPassword: string): Promise<void> {
  await apiFetch<void>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ resetToken, newPassword }),
  });
}
