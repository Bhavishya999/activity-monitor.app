import { ExternalLink, GitMerge } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { formatDateTime, formatNumber, formatRelative, shortSha } from "@/lib/format";
import type { CommitItem } from "@/lib/interfaces/analytics";

type CommitListProps = { commits: CommitItem[]; timezone: string; showRepository?: boolean };

export function CommitList({ commits, timezone, showRepository = true }: CommitListProps): ReactElement {
  return (
    <TooltipProvider>
      <ul className="divide-y divide-border">
        {commits.map((c) => (
          <li key={c.id} className="flex items-start gap-3 py-3">
            {c.developer ? <Avatar login={c.developer.login} src={c.developer.avatarUrl} /> : <Avatar login="??" />}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium text-fg" title={c.title}>{c.title}</span>
                {c.isMerge ? <Badge tone="accent"><GitMerge aria-hidden className="size-3" />Merge</Badge> : null}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
                {c.developer ? (
                  <Link to="/developers/$developerId" params={{ developerId: String(c.developer.id) }} search={{}} className="font-medium text-muted hover:text-accent-strong">{c.developer.login}</Link>
                ) : (
                  <Tooltip content="GitHub could not match this commit to an account, so it is not attributed to anyone."><span className="italic">Unassigned</span></Tooltip>
                )}
                {showRepository ? (
                  <><span aria-hidden>·</span>
                    <Link to="/repositories/$repositoryId" params={{ repositoryId: String(c.repository.id) }} search={{}} className="hover:text-accent-strong">{c.repository.name}</Link></>
                ) : null}
                <span aria-hidden>·</span>
                <Tooltip content={formatDateTime(c.committedAt, timezone)}><time dateTime={c.committedAt}>{formatRelative(c.committedAt)}</time></Tooltip>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-xs">
              {c.additions !== null || c.deletions !== null ? (
                <span className="hidden tabular sm:inline"><span style={{ color: "var(--good)" }}>+{formatNumber(c.additions ?? 0)}</span> <span style={{ color: "var(--critical)" }}>-{formatNumber(c.deletions ?? 0)}</span></span>
              ) : null}
              {c.url ? (
                <a href={c.url} target="_blank" rel="noreferrer" aria-label={`Open commit ${shortSha(c.sha)} on GitHub`} className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-1.5 py-1 font-mono text-muted hover:text-fg">
                  {shortSha(c.sha)}<ExternalLink aria-hidden className="size-3" />
                </a>
              ) : <code className="rounded-md bg-surface-2 px-1.5 py-1 text-muted">{shortSha(c.sha)}</code>}
            </div>
          </li>
        ))}
      </ul>
    </TooltipProvider>
  );
}
