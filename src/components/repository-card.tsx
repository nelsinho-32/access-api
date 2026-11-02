import React from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { GitHubRepository } from '@/types/repository';

interface RepositoryCardProps {
  repository: GitHubRepository;
  onDelete?: (id: number) => void;
}

export function RepositoryCard({ repository, onDelete }: RepositoryCardProps) {
  const isDark = useColorScheme() === 'dark';

  const handleOpenGitHub = () => {
    if (repository.html_url) {
      if (Platform.OS === 'web') {
        window.open(repository.html_url, '_blank');
      } else {
        Linking.openURL(repository.html_url).catch((err) =>
          console.error('Erro ao abrir URL do repositório:', err)
        );
      }
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
        pressed && styles.cardPressed,
      ]}
      onPress={handleOpenGitHub}>
      <View style={styles.ownerSection}>
        <Image
          source={{ uri: repository.owner.avatar_url }}
          style={styles.avatar}
          accessibilityLabel={`Avatar de ${repository.owner.login}`}
        />

        <View style={styles.ownerInfo}>
          {/* Nome do Dono */}
          <Text style={[styles.ownerLabel, isDark && styles.textMutedDark]}>
            Dono do Repositório:
          </Text>
          <Text style={[styles.ownerName, isDark ? styles.textDark : styles.textLight]}>
            {repository.owner.login}
          </Text>

          <View style={styles.ownerMetaRow}>
            <View
              style={[
                styles.badge,
                isDark ? styles.badgeDark : styles.badgeLight,
              ]}>
              <Text
                style={[
                  styles.badgeText,
                  isDark ? styles.badgeTextDark : styles.badgeTextLight,
                ]}>
                Tipo: {repository.owner.type}
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                isDark ? styles.badgeDark : styles.badgeLight,
              ]}>
              <Text
                style={[
                  styles.badgeText,
                  isDark ? styles.badgeTextDark : styles.badgeTextLight,
                ]}>
                ID #{repository.owner.id}
              </Text>
            </View>
          </View>
        </View>

        {onDelete && (
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(repository.id);
            }}
            accessibilityLabel="Remover repositório">
            <Text style={styles.deleteButtonText}>×</Text>
          </Pressable>
        )}
      </View>

      <View style={[styles.divider, isDark ? styles.dividerDark : styles.dividerLight]} />

      {/* Seção do Repositório */}
      <View style={styles.repoSection}>
        {/* Nome do Repositório */}
        <Text style={[styles.repoLabel, isDark && styles.textMutedDark]}>
          Repositório:
        </Text>
        <Text style={[styles.repoName, isDark ? styles.textPrimaryDark : styles.textPrimaryLight]}>
          {repository.name}
        </Text>

        <Text
          style={[styles.repoDescription, isDark ? styles.textMutedDark : styles.textMutedLight]}
          numberOfLines={3}>
          {repository.description ? repository.description : 'Sem descrição cadastrada'}
        </Text>

        <View style={styles.statsContainer}>
          <View style={[styles.statItem, isDark ? styles.statItemDark : styles.statItemLight]}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={[styles.statValue, isDark ? styles.textDark : styles.textLight]}>
              {repository.stargazers_count.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.textMutedDark]}>estrelas</Text>
          </View>

          <View style={[styles.statItem, isDark ? styles.statItemDark : styles.statItemLight]}>
            <Text style={styles.statIcon}>💻</Text>
            <Text style={[styles.statValue, isDark ? styles.textDark : styles.textLight]}>
              {repository.language || 'N/A'}
            </Text>
          </View>

          <View style={[styles.statItem, isDark ? styles.statItemDark : styles.statItemLight]}>
            <Text style={styles.statIcon}>🍴</Text>
            <Text style={[styles.statValue, isDark ? styles.textDark : styles.textLight]}>
              {repository.forks_count.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.textMutedDark]}>forks</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  cardDark: {
    backgroundColor: '#1e2430',
    borderColor: '#2d3748',
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  ownerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#cbd5e1',
  },
  ownerInfo: {
    flex: 1,
    gap: 2,
  },
  ownerLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  ownerMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeLight: {
    backgroundColor: '#f1f5f9',
  },
  badgeDark: {
    backgroundColor: '#2d3748',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  badgeTextLight: {
    color: '#475569',
  },
  badgeTextDark: {
    color: '#cbd5e1',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonPressed: {
    opacity: 0.7,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  dividerLight: {
    backgroundColor: '#f1f5f9',
  },
  dividerDark: {
    backgroundColor: '#2d3748',
  },
  repoSection: {
    gap: 6,
  },
  repoLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  repoName: {
    fontSize: 18,
    fontWeight: '800',
  },
  repoDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  statItemLight: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statItemDark: {
    backgroundColor: '#141923',
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  statIcon: {
    fontSize: 13,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  textLight: {
    color: '#0f172a',
  },
  textDark: {
    color: '#f8fafc',
  },
  textPrimaryLight: {
    color: '#2563eb',
  },
  textPrimaryDark: {
    color: '#60a5fa',
  },
  textMutedLight: {
    color: '#475569',
  },
  textMutedDark: {
    color: '#94a3b8',
  },
});
