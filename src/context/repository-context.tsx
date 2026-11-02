import React, { createContext, useContext, useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { fetchRepository } from '@/services/api';
import {
  clearStoredRepositories,
  getStoredRepositories,
  saveStoredRepositories,
} from '@/services/storage';
import { GitHubRepository } from '@/types/repository';

interface RepositoryContextData {
  repositories: GitHubRepository[];
  loading: boolean;
  addRepository: (
    ownerId: string,
    repoId: string
  ) => Promise<{ success: boolean; message?: string }>;
  clearRepositories: () => Promise<void>;
  removeRepository: (id: number) => Promise<void>;
  reload: () => Promise<void>;
}

const RepositoryContext = createContext<RepositoryContextData>({} as RepositoryContextData);

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const stored = await getStoredRepositories();
        setRepositories(stored);
      } catch (error) {
        console.error('Falha ao inicializar repositórios:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const addRepository = async (
    ownerId: string,
    repoId: string
  ): Promise<{ success: boolean; message?: string }> => {
    const trimmedOwner = ownerId.trim();
    const trimmedRepo = repoId.trim();

    if (!trimmedOwner || !trimmedRepo) {
      return { success: false, message: 'Informe o ownerid e o repoid.' };
    }

    try {
      const repoData = await fetchRepository(trimmedOwner, trimmedRepo);

      const alreadyExists = repositories.some(
        (repo) => repo.id === repoData.id || repo.full_name.toLowerCase() === repoData.full_name.toLowerCase()
      );

      if (alreadyExists) {
        return { success: false, message: 'Este repositório já está salvo na listagem.' };
      }

      const updatedList = [repoData, ...repositories];
      await saveStoredRepositories(updatedList);
      setRepositories(updatedList);

      return { success: true };
    } catch (error: any) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          return {
            success: false,
            message: `Repositório "${trimmedOwner}/${trimmedRepo}" não encontrado no GitHub. Verifique os dados digitados.`,
          };
        }
        if (error.response?.status === 403) {
          return {
            success: false,
            message: 'Limite temporário de requisições da API do GitHub atingido. Tente novamente em instantes.',
          };
        }
        return {
          success: false,
          message: error.message || 'Erro ao conectar à API do GitHub.',
        };
      }
      return {
        success: false,
        message: 'Erro desconhecido ao buscar dados do repositório.',
      };
    }
  };

  const clearRepositories = async () => {
    await clearStoredRepositories();
    setRepositories([]);
  };

  const removeRepository = async (id: number) => {
    const filtered = repositories.filter((repo) => repo.id !== id);
    await saveStoredRepositories(filtered);
    setRepositories(filtered);
  };

  const reload = async () => {
    setLoading(true);
    const stored = await getStoredRepositories();
    setRepositories(stored);
    setLoading(false);
  };

  return (
    <RepositoryContext.Provider
      value={{
        repositories,
        loading,
        addRepository,
        clearRepositories,
        removeRepository,
        reload,
      }}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepositories(): RepositoryContextData {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useRepositories deve ser utilizado dentro de um RepositoryProvider');
  }
  return context;
}
