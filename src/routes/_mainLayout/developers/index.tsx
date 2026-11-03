import { createFileRoute } from "@tanstack/react-router";
import DevelopersPage from "@/components/developers/DevelopersPage";
import { pagedSearchSchema } from "@/lib/filters";

export const Route = createFileRoute("/_mainLayout/developers/")({ validateSearch: pagedSearchSchema, component: DevelopersPage });
