import axios from 'axios';
import { GitHubRepository } from '@/types/repository';

export const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
  timeout: 10000,
});


export async function fetchRepository(ownerId: string, repoId: string): Promise<GitHubRepository> {
  const cleanOwner = encodeURIComponent(ownerId.trim());
  const cleanRepo = encodeURIComponent(repoId.trim());

  const response = await githubApi.get<GitHubRepository>(`/repos/${cleanOwner}/${cleanRepo}`);
  return response.data;
}
