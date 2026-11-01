export interface GitHubOwner {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  open_issues_count: number;
  owner: GitHubOwner;
  created_at?: string;
  updated_at?: string;
}

