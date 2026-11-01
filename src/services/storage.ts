import AsyncStorage from '@react-native-async-storage/async-storage';
import { GitHubRepository } from '@/types/repository';

const STORAGE_KEY = '@access_api_github_repositories';

/**
 * Carrega a lista de repositórios salvos do AsyncStorage.
 */
export async function getStoredRepositories(): Promise<GitHubRepository[]> {
  try {
    const rawData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Erro ao ler repositórios do armazenamento local:', error);
    return [];
  }
}

/**
 * Salva a lista de repositórios no AsyncStorage.
 */
export async function saveStoredRepositories(repositories: GitHubRepository[]): Promise<void> {
  try {
    const jsonString = JSON.stringify(repositories);
    await AsyncStorage.setItem(STORAGE_KEY, jsonString);
  } catch (error) {
    console.error('Erro ao persistir repositórios:', error);
    throw error;
  }
}

/**
 * Limpa todos os repositórios salvos no AsyncStorage.
 */
export async function clearStoredRepositories(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar repositórios salvos:', error);
    throw error;
  }
}

