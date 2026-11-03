import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { ComingSoonPage } from "@/components/core/ComingSoonPage";

export const Route = createFileRoute("/_mainLayout/synchronization")({
  component: () => <ComingSoonPage icon={RefreshCw} title="Synchronization" description="Imports, webhooks and rate limits" detail="Import progress, failed jobs, rate-limit status and retry controls will appear here. Admins will also choose how far back to import (90 days or full history)." />,
});
