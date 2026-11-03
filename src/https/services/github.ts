import { apiFetch } from "../fetch";
import type { GitHubAccountsResponse } from "../../lib/interfaces/github";

export async function fetchGitHubAccounts(): Promise<GitHubAccountsResponse> {
  return apiFetch<GitHubAccountsResponse>("/github-accounts");
}
