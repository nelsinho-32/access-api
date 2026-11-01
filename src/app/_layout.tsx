import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { RepositoryProvider } from '@/context/repository-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    // Esconde a tela de splash quando os componentes estiverem montados
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <RepositoryProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
            },
            headerTintColor: isDark ? '#f8fafc' : '#0f172a',
            headerTitleStyle: {
              fontWeight: '700',
            },
            contentStyle: {
              backgroundColor: isDark ? '#0f172a' : '#f8fafc',
            },
          }}>
          <Stack.Screen
            name="index"
            options={{
              title: 'Repositórios GitHub',
            }}
          />
          <Stack.Screen
            name="add"
            options={{
              title: 'Adicionar Repositório',
              presentation: 'card',
              headerBackTitle: 'Voltar',
            }}
          />
        </Stack>
      </RepositoryProvider>
    </ThemeProvider>
  );
}
