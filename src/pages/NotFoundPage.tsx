import { Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-muted text-accent">
        <FileQuestion className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">404 — Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button asChild>
        <Link to="/dashboard">Go to Overview</Link>
      </Button>
    </div>
  );
}
