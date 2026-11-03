export type AnalyticsFilter = {
  dateFrom?: string;
  dateTo?: string;
  tz?: string;
  includeMerges?: boolean;
  includeBots?: boolean;
};

export type CommitTrendPoint = { date: string; count: number };
export type HourlyPoint = { hour: number; count: number };
export type TopRepo = { id: number; fullName: string; count: number };
export type TopContributor = { id: number; login: string; avatarUrl: string | null; count: number };

export type OverviewResponse = {
  totalCommits: number;
  totalRepos: number;
  totalDevelopers: number;
  commitTrend: CommitTrendPoint[];
  hourlyActivity: HourlyPoint[];
  topRepos: TopRepo[];
  topContributors: TopContributor[];
  dateRange: { from: string; to: string };
  sample: boolean;
};

export type Developer = {
  id: number;
  login: string;
  avatarUrl: string | null;
  type: string;
  commitCount: number;
  lastCommittedAt: string | null;
};

export type DevelopersResponse = {
  developers: Developer[];
  total: number;
  page: number;
  pageSize: number;
};

export type DeveloperDetailResponse = {
  developer: { id: number; login: string; avatarUrl: string | null; type: string };
  commitCount: number;
  lastCommittedAt: string | null;
  commitTrend: CommitTrendPoint[];
  repoBreakdown: Array<{ repoId: number; fullName: string; count: number }>;
  hourlyActivity: HourlyPoint[];
  dateRange: { from: string; to: string };
};

export type Repository = {
  id: number;
  fullName: string;
  name: string;
  private: boolean;
  archived: boolean;
  monitored: boolean;
  accessible: boolean;
  commitCount: number;
  lastCommittedAt: string | null;
};

export type RepositoriesResponse = {
  repositories: Repository[];
  total: number;
  page: number;
  pageSize: number;
};

export type RepositoryDetailResponse = {
  repository: {
    id: number;
    fullName: string;
    name: string;
    private: boolean;
    archived: boolean;
    defaultBranch: string | null;
    htmlUrl: string | null;
  };
  commitCount: number;
  commitTrend: CommitTrendPoint[];
  topContributors: TopContributor[];
  hourlyActivity: HourlyPoint[];
  dateRange: { from: string; to: string };
};

export type Commit = {
  id: number;
  sha: string;
  shortSha: string;
  message: string;
  authoredAt: string;
  committedAt: string;
  isMerge: boolean;
  additions: number | null;
  deletions: number | null;
  changedFiles: number | null;
  htmlUrl: string | null;
  author: { id: number; login: string; avatarUrl: string | null } | null;
  repository: { id: number; fullName: string };
};

export type CommitsResponse = {
  commits: Commit[];
  total: number;
  page: number;
  pageSize: number;
};
