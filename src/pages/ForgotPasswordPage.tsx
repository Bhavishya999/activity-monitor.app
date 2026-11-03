import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, Activity } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { forgotPasswordApi } from "../https/services/auth";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    await forgotPasswordApi(values.email);
    setSubmittedEmail(values.email);
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
            <Activity className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Reset your password</h1>
          <p className="text-center text-sm text-muted-foreground">
            {sent ? "Check your inbox" : "Enter your email and we'll send you a reset code"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {sent ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A 6-digit code was sent to <strong>{submittedEmail}</strong>. It expires in 10 minutes.
              </p>
              <Button
                className="w-full"
                onClick={() => void router.navigate({ to: "/verify-otp", search: { email: submittedEmail } })}
              >
                Enter code
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@orotron.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send reset code"}
              </Button>
            </form>
          )}

          <button
            onClick={() => void router.navigate({ to: "/login" })}
            className="mt-4 flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}
