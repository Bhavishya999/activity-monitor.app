import type { LucideIcon } from "lucide-react";
import type { ReactElement } from "react";
import { EmptyState } from "./EmptyState";
import { PageHeader } from "./PageHeader";

type ComingSoonPageProps = { title: string; description: string; icon: LucideIcon; detail: string };

/** Honest placeholder for areas whose backend is not built yet: says exactly what will live here. */
export function ComingSoonPage({ title, description, icon, detail }: ComingSoonPageProps): ReactElement {
  return (
    <>
      <PageHeader title={title} description={description} />
      <EmptyState icon={icon} title="Not available yet" description={detail} />
    </>
  );
}
