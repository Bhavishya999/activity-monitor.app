import { createFileRoute } from "@tanstack/react-router";
import CommitsPage from "@/components/commits/CommitsPage";
import { pagedSearchSchema } from "@/lib/filters";

export const Route = createFileRoute("/_mainLayout/commits")({ validateSearch: pagedSearchSchema, component: CommitsPage });
