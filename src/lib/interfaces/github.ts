export type GitHubAccount = {
  installationId: number;
  status: "active" | "suspended" | "deleted";
  repositorySelection: string | null;
  account: {
    id: number;
    login: string;
    type: string;
    avatarUrl: string | null;
    htmlUrl: string | null;
  };
  repoCount: number;
  activeRepoCount: number;
  lastSyncedAt: string | null;
};

export type GitHubAccountsResponse = { accounts: GitHubAccount[] };
