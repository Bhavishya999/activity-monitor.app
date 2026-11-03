import { createFileRoute, notFound } from "@tanstack/react-router";
import type { ReactElement } from "react";
import DeveloperDetailPage from "@/components/developers/DeveloperDetailPage";
import { filterSearchSchema } from "@/lib/filters";

function DeveloperRoute(): ReactElement {
  const { developerId } = Route.useParams();
  return <DeveloperDetailPage developerId={Number(developerId)} />;
}

export const Route = createFileRoute("/_mainLayout/developers/$developerId")({
  validateSearch: filterSearchSchema,
  beforeLoad: ({ params }) => { if (!/^\d+$/.test(params.developerId)) throw notFound(); },
  component: DeveloperRoute,
});
