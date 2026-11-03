import { useState } from "react";
import { useRouter, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Activity } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { verifyOtpApi } from "../https/services/auth";

const schema = z.object({
  otp: z.string().length(6, "Code must be 6 digits").regex(/^\d{6}$/, "Digits only"),
});
type FormValues = z.infer<typeof schema>;

export function VerifyOtpPage() {
  const router = useRouter();
  const search = useSearch({ strict: false }) as { email?: string };
  const email = search.email ?? "";
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const { resetToken } = await verifyOtpApi(email, values.otp);
      await router.navigate({ to: "/reset-password", search: { token: resetToken } });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Invalid code");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
            <Activity className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Enter your code</h1>
          <p className="text-center text-sm text-muted-foreground">
            We sent a 6-digit code to <strong>{email || "your email"}</strong>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="otp">Reset code</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                className="text-center text-lg tracking-widest"
                {...register("otp")}
              />
              {errors.otp && <p className="text-xs text-destructive">{errors.otp.message}</p>}
            </div>

            {serverError && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying…" : "Verify code"}
            </Button>
          </form>

          <button
            onClick={() => void router.navigate({ to: "/forgot-password" })}
            className="mt-4 flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Resend code
          </button>
        </div>
      </div>
    </div>
  );
}
