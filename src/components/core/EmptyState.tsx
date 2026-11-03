import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
};

export function EmptyState({
  title = "No data",
  description,
  icon: Icon = Inbox,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium">{title}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
