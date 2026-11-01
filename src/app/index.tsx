import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { EmptyState } from '@/components/empty-state';
import { RepositoryCard } from '@/components/repository-card';
import { useRepositories } from '@/context/repository-context';

export default function RepositoriesScreen() {
  const isDark = useColorScheme() === 'dark';
  const { repositories, loading, clearRepositories, removeRepository, reload } =
    useRepositories();

  const handleClearAll = () => {
    if (repositories.length === 0) {
      if (Platform.OS === 'web') {
        window.alert('Não há repositórios salvos para limpar.');
      } else {
        Alert.alert('Aviso', 'Não há repositórios salvos para limpar.');
      }
      return;
    }

    const message = 'Deseja realmente limpar todos os repositórios salvos? Esta ação não pode ser desfeita.';

    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        clearRepositories();
      }
    } else {
      Alert.alert('Limpar Repositórios', message, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar tudo',
          style: 'destructive',
          onPress: () => clearRepositories(),
        },
      ]);
    }
  };

  const handleOpenAdd = () => {
    // 3. Ao clicar no +, navegar para a tela de adicionar
    router.push('/add');
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, isDark ? styles.safeAreaDark : styles.safeAreaLight]}>
      {/* Configuração do Header com botões + e - (Requisitos 3 e 7) */}
      <Stack.Screen
        options={{
          title: 'Repositórios GitHub',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerRight: () => (
            <View style={styles.headerActions}>
              {/* Requisito 7: Ao lado do +, coloque um - para limpar os dados salvos */}
              <Pressable
                style={({ pressed }) => [
                  styles.headerButton,
                  styles.minusButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleClearAll}
                hitSlop={8}
                accessibilityLabel="Limpar dados salvos"
                accessibilityRole="button">
                <Text style={styles.minusButtonText}>−</Text>
              </Pressable>

              {/* Requisito 3: Botão + que navega para a tela de adicionar repositório */}
              <Pressable
                style={({ pressed }) => [
                  styles.headerButton,
                  styles.plusButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleOpenAdd}
                hitSlop={8}
                accessibilityLabel="Adicionar novo repositório"
                accessibilityRole="button">
                <Text style={styles.plusButtonText}>+</Text>
              </Pressable>
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        {loading && repositories.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={[styles.loadingText, isDark ? styles.textDark : styles.textLight]}>
              Carregando repositórios salvos...
            </Text>
          </View>
        ) : (
          <FlatList
            data={repositories}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <RepositoryCard
                repository={item}
                onDelete={(id) => removeRepository(id)}
              />
            )}
            contentContainerStyle={[
              styles.listContent,
              repositories.length === 0 && styles.listContentEmpty,
            ]}
            ListEmptyComponent={<EmptyState />}
            refreshing={loading}
            onRefresh={reload}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  safeAreaLight: {
    backgroundColor: '#f8fafc',
  },
  safeAreaDark: {
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: Platform.OS === 'web' ? 12 : 4,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButton: {
    backgroundColor: '#2563eb',
  },
  plusButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 24,
    marginTop: -2,
  },
  minusButton: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  minusButtonText: {
    color: '#dc2626',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 24,
    marginTop: -2,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
  textLight: {
    color: '#0f172a',
  },
  textDark: {
    color: '#f8fafc',
  },
});
