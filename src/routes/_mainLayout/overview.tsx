import { createFileRoute } from "@tanstack/react-router";
import OverviewPage from "@/components/overview/OverviewPage";
import { filterSearchSchema } from "@/lib/filters";

export const Route = createFileRoute("/_mainLayout/overview")({ validateSearch: filterSearchSchema, component: OverviewPage });
