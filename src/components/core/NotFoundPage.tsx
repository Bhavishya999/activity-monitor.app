import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import type { ReactElement } from "react";
import { EmptyState } from "./EmptyState";

export function NotFoundPage(): ReactElement {
  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <EmptyState icon={Compass} title="Page not found" description="That page does not exist or has moved."
        action={<Link to="/overview" search={{}} className="inline-flex h-9 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:bg-accent-strong">Back to overview</Link>} />
    </div>
  );
}
