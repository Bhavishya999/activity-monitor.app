export type RangeMeta = { preset: string; startDate: string; endDate: string; timezone: string };
export type DailyPoint = { day: string; commits: number };
export type HourPoint = { hour: number; commits: number };

export type DeveloperRef = { id: number; login: string; avatarUrl: string | null };

export type CommitItem = {
  id: number; sha: string; title: string; committedAt: string; url: string | null; isMerge: boolean;
  additions: number | null; deletions: number | null;
  repository: { id: number; name: string };
  developer: DeveloperRef | null; // null = unassigned
};

export type Paged<T> = { items: T[]; total: number; page: number; pageSize: number };

export type OverviewResponse = {
  range: RangeMeta;
  totals: {
    commits: number; activeDevelopers: number; activeRepositories: number; unassignedCommits: number; mergeCommits: number;
    connectedRepositories: number; connectedInstallations: number;
  };
  lastSyncedAt: string | null;
  dailyTrend: DailyPoint[];
  hourlyActivity: HourPoint[];
  repositoryDistribution: { id: number; name: string; commits: number }[];
  leaderboard: { developer: (DeveloperRef & { type: string | null }) | null; commits: number; repositories: number }[];
  recentCommits: CommitItem[];
};

export type BreakdownGroup = { id: number | null; label: string | null; commits: number; developers: number; repositories: number; latestCommitAt: string | null };
export type BreakdownResponse = { range: RangeMeta; by: string; groups: BreakdownGroup[] };

export type DeveloperListItem = {
  id: number; login: string; avatarUrl: string | null; isBot: boolean; commits: number; repositories: number; mergeCommits: number;
  firstCommitAt: string; latestCommitAt: string; additions: number | null; deletions: number | null;
  employee: { id: number; name: string } | null;
};

export type DeveloperDetailResponse = {
  range: RangeMeta;
  developer: { id: number; login: string; avatarUrl: string | null; profileUrl: string | null; isBot: boolean };
  employee: { id: number; name: string } | null;
  linkedAccounts: DeveloperRef[];
  summary: {
    commits: number; repositories: number; mergeCommits: number; additions: number | null; deletions: number | null;
    firstCommitAt: string | null; latestCommitAt: string | null; lifetimeCommits: number;
  };
  dailyTrend: DailyPoint[];
  hourlyActivity: HourPoint[];
  repositories: { id: number; name: string; commits: number; latestCommitAt: string }[];
  recentCommits: CommitItem[];
};

export type RepositoryListItem = {
  id: number; name: string; isPrivate: boolean; isArchived: boolean; isAccessible: boolean; isMonitored: boolean;
  account: string; commits: number; contributors: number; latestCommitAt: string | null; lastSyncedAt: string | null;
};

export type RepositoryDetailResponse = {
  range: RangeMeta;
  repository: RepositoryListItem;
  branches: { id: number; name: string; isDefault: boolean; isDeleted: boolean; commits: number; lastImportedAt: string | null }[];
  contributors: { developer: DeveloperRef | null; commits: number }[];
  dailyTrend: DailyPoint[];
  hourlyActivity: HourPoint[];
  recentCommits: CommitItem[];
};

export type Team = { id: number; name: string; slug: string; description: string | null; color: string | null; memberCount: number };
