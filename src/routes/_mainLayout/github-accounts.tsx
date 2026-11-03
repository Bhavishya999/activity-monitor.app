import { createFileRoute } from "@tanstack/react-router";
import GitHubAccountsPage from "@/components/github/GitHubAccountsPage";
import { filterSearchSchema } from "@/lib/filters";

export const Route = createFileRoute("/_mainLayout/github-accounts")({ validateSearch: filterSearchSchema, component: GitHubAccountsPage });
