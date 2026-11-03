import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ComingSoonPage } from "@/components/core/ComingSoonPage";

export const Route = createFileRoute("/_mainLayout/administration")({
  component: () => <ComingSoonPage icon={ShieldCheck} title="Administration" description="People, roles and access" detail="Inviting employees, assigning Developer, Admin and Super Admin roles, linking several GitHub accounts to one person, and the audit log will live here once company sign-in is connected." />,
});
