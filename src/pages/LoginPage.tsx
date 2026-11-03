import { useState, useCallback } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, GitCommitHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { loginApi } from "../https/services/auth";
import { setCsrfToken } from "../lib/authSession";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

const ACTIVITY = [40, 60, 25, 80, 55, 90, 45, 70, 35, 65, 85, 50, 75, 30, 95, 60, 40, 70, 55, 80];

function MiniChart() {
  const max = Math.max(...ACTIVITY);
  const w = 320;
  const h = 60;
  const gap = w / (ACTIVITY.length - 1);
  const pts = ACTIVITY.map((v, i) => `${i * gap},${h - (v / max) * h}`).join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#lg)" />
      <polyline
        points={pts}
        stroke="white"
        strokeWidth="1.5"
        strokeOpacity="0.6"
        fill="none"
        strokeLinejoin="round"
      />
      {ACTIVITY.map((v, i) => (
        <circle
          key={i}
          cx={i * gap}
          cy={h - (v / max) * h}
          r="2"
          fill="white"
          opacity={v === max ? "1" : "0.4"}
        />
      ))}
    </svg>
  );
}

function getRedirectTo(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("redirectTo");
    if (!raw) return "/";
    // Validate it's a relative path (no protocol → no open-redirect)
    const decoded = decodeURIComponent(raw);
    return decoded.startsWith("/") && !decoded.startsWith("//") ? decoded : "/";
  } catch {
    return "/";
  }
}

export function LoginPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setServerError(null);
      try {
        const { user, csrfToken } = await loginApi(values.email, values.password);
        setCsrfToken(csrfToken);
        qc.setQueryData(["me"], user);
        // Navigate to the page the user originally requested, or overview
        const destination = getRedirectTo();
        await router.navigate({ to: destination });
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Login failed");
      }
    },
    [router, qc],
  );

  const togglePassword = useCallback(() => setShowPassword((v) => !v), []);

  const navigateForgot = useCallback(() => {
    void router.navigate({ to: "/forgot-password" });
  }, [router]);

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex lg:w-[46%]"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.420 0.230 280) 0%, oklch(0.560 0.230 265) 50%, oklch(0.520 0.200 240) 100%)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <img src="/logo.svg" alt="" className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-white">Git Activity Monitor</span>
        </div>

        {/* Center content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-white/50">
              Engineering analytics
            </p>
            <h2 className="text-3xl font-bold leading-tight text-white">
              Every commit,
              <br />
              every developer,
              <br />
              one view.
            </h2>
            <p className="text-sm leading-relaxed text-white/65">
              Track commit activity across all GitHub organizations, repositories, and developers —
              automatically, in real time.
            </p>
          </div>

          <div className="space-y-1.5">
            <MiniChart />
            <p className="text-[10px] text-white/40">Commit activity · last 20 days</p>
          </div>

          <div className="flex gap-8">
            {[
              { label: "Commits tracked", value: "100K+" },
              { label: "Repositories", value: "500+" },
              { label: "Developers", value: "200+" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="flex items-center gap-1.5 text-[11px] text-white/35">
          <GitCommitHorizontal className="h-3.5 w-3.5" />
          Internal tool — authorised access only
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <img src="/logo.svg" alt="" className="h-7 w-7" />
          <span className="text-base font-semibold">Git Activity Monitor</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-7 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">Use your company email to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@orotron.com"
                className="h-10"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={navigateForgot}
                  className="text-xs hover:underline"
                  style={{ color: "oklch(0.560 0.230 265)" }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-10 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Server error — shows the exact API message */}
            {serverError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/8 px-3.5 py-2.5 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              className="h-10 w-full font-medium"
              style={{ background: "oklch(0.560 0.230 265)", color: "white" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-[11px] text-muted-foreground">
            Don't have access?{" "}
            <span className="text-foreground">Ask your administrator to invite you.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
