import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { ComingSoonPage } from "@/components/core/ComingSoonPage";

export const Route = createFileRoute("/_mainLayout/reports")({
  component: () => <ComingSoonPage icon={FileText} title="Reports" description="Daily summaries delivered to Slack and Google Sheets" detail="Report history with delivery status for Slack and Google Sheets will appear here once the reporting service is connected. Reports are planned for 4:30 PM IST (today so far) and 7:00 AM IST (previous day)." />,
});
