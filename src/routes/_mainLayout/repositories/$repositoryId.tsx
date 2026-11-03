import { createFileRoute, notFound } from "@tanstack/react-router";
import type { ReactElement } from "react";
import RepositoryDetailPage from "@/components/repositories/RepositoryDetailPage";
import { filterSearchSchema } from "@/lib/filters";

function RepositoryRoute(): ReactElement {
  const { repositoryId } = Route.useParams();
  return <RepositoryDetailPage repositoryId={Number(repositoryId)} />;
}

export const Route = createFileRoute("/_mainLayout/repositories/$repositoryId")({
  validateSearch: filterSearchSchema,
  beforeLoad: ({ params }) => { if (!/^\d+$/.test(params.repositoryId)) throw notFound(); },
  component: RepositoryRoute,
});
