import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

export function EmptyState() {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, isDark ? styles.iconContainerDark : styles.iconContainerLight]}>
        <Text style={styles.icon}>📦</Text>
      </View>
      <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
        Nenhum repositório salvo
      </Text>
      <Text style={[styles.subtitle, isDark ? styles.subtitleDark : styles.subtitleLight]}>
        Toque no botão <Text style={styles.highlight}>+</Text> no topo para buscar e adicionar um repositório da API do GitHub.
      </Text>
      <Text style={[styles.hint, isDark ? styles.subtitleDark : styles.subtitleLight]}>
        Exemplo: ownerid: <Text style={styles.code}>facebook</Text>, repoid: <Text style={styles.code}>react-native</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconContainerLight: {
    backgroundColor: '#eff6ff',
  },
  iconContainerDark: {
    backgroundColor: '#1e293b',
  },
  icon: {
    fontSize: 38,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleLight: {
    color: '#0f172a',
  },
  titleDark: {
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 12,
  },
  subtitleLight: {
    color: '#64748b',
  },
  subtitleDark: {
    color: '#94a3b8',
  },
  highlight: {
    fontWeight: '800',
    color: '#2563eb',
    fontSize: 18,
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
  },
  code: {
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#3b82f6',
  },
});

