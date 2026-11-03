import { createFileRoute } from "@tanstack/react-router";
import AnalyticsPage from "@/components/analytics/AnalyticsPage";
import { analyticsSearchSchema } from "@/lib/filters";

export const Route = createFileRoute("/_mainLayout/analytics")({ validateSearch: analyticsSearchSchema, component: AnalyticsPage });
