import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Activity, LogIn } from "lucide-react";
import { useState, type FormEvent, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { devLogin } from "@/https/services/auth";
import { errorMessage } from "@/https/httpErrorHandler";
import { setCsrfToken } from "@/lib/authSession";
import type { Role } from "@/lib/interfaces/auth";
import { ThemeToggle } from "@/components/core/ThemeToggle";

const ROLES: readonly Role[] = ["DEVELOPER", "ADMIN", "SUPER_ADMIN"];

export default function LoginPage(): ReactElement {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("ADMIN");
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function onSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setIsBusy(true); setError(null);
    try {
      const { csrfToken } = await devLogin(email.trim(), role);
      setCsrfToken(csrfToken);
      await queryClient.invalidateQueries();
      await navigate({ to: "/overview", search: {} });
    } catch (err) { setError(errorMessage(err)); } finally { setIsBusy(false); }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="rounded-2xl bg-accent p-3 text-white shadow-pop"><Activity aria-hidden className="size-6" /></span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Git Activity Monitor</h1>
          <p className="mt-1 text-sm text-muted">Engineering activity across your GitHub organizations</p>
        </div>
        <Card className="p-6">
          <Button variant="primary" className="w-full" disabled title="Company sign-in is being connected"><LogIn aria-hidden className="size-4" />Sign in with company account</Button>
          <p className="mt-2 text-center text-xs text-faint">Only employees invited by an admin can sign in.</p>
          {import.meta.env.DEV ? (
            <form onSubmit={(e) => { void onSubmit(e); }} className="mt-6 space-y-3 border-t border-border pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-faint">Development login</p>
              <Input aria-label="Email" type="email" required placeholder="you@example.test" value={email} onChange={(e) => { setEmail(e.target.value); }} />
              <Select id="dev-role" label="Role" value={role} onChange={(e) => { setRole(ROLES.find((r) => r === e.target.value) ?? "DEVELOPER"); }}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </Select>
              <Button type="submit" className="w-full" disabled={isBusy || email.trim() === ""}>Continue</Button>
              {error ? <p role="alert" className="text-sm" style={{ color: "var(--critical)" }}>{error}</p> : null}
            </form>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
