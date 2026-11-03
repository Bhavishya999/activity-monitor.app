import { createFileRoute } from "@tanstack/react-router";
import RepositoriesPage from "@/components/repositories/RepositoriesPage";
import { pagedSearchSchema } from "@/lib/filters";

export const Route = createFileRoute("/_mainLayout/repositories/")({ validateSearch: pagedSearchSchema, component: RepositoriesPage });
