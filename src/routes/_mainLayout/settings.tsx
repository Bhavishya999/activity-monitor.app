import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { ComingSoonPage } from "@/components/core/ComingSoonPage";

export const Route = createFileRoute("/_mainLayout/settings")({
  component: () => <ComingSoonPage icon={Settings} title="Settings" description="Time zone, visibility and integrations" detail="Reporting time zone, visibility policies and integration settings will be configurable here." />,
});
