import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import { requireGuest } from "../middleware/routeAuthMiddleware";
import { LoginPage } from "../pages/LoginPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { VerifyOtpPage } from "../pages/VerifyOtpPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { NotFoundPage } from "../pages/NotFoundPage";

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => { throw redirect({ to: "/dashboard" }); },
  component: () => null,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFoundPage,
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: requireGuest,
  component: LoginPage,
});

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});

export const verifyOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-otp",
  component: VerifyOtpPage,
});

export const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
});

export const publicRoutes = [
  indexRoute,
  notFoundRoute,
  loginRoute,
  forgotPasswordRoute,
  verifyOtpRoute,
  resetPasswordRoute,
] as const;
