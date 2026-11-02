import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { useRepositories } from '@/context/repository-context';

export default function AddRepositoryScreen() {
  const isDark = useColorScheme() === 'dark';
  const { addRepository } = useRepositories();

  const [ownerId, setOwnerId] = useState('');
  const [repoId, setRepoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleAdd = async () => {
    const trimmedOwner = ownerId.trim();
    const trimmedRepo = repoId.trim();

    setErrorMessage(null);

    if (!trimmedOwner || !trimmedRepo) {
      showAlert('Campos obrigatórios', 'informe tanto o ownerid quanto o repoid.');
      setErrorMessage('Preencha os campos ownerid e repoid.');
      return;
    }

    setLoading(true);

    try {
      const result = await addRepository(trimmedOwner, trimmedRepo);

      if (result.success) {
        router.back();
      } else {
        const errorText = result.message || 'Falha ao buscar dados do repositório.';
        setErrorMessage(errorText);
        showAlert('Erro ao adicionar', errorText);
      }
    } catch (err: any) {
      const errorText = err.message || 'Ocorreu um erro inesperado.';
      setErrorMessage(errorText);
      showAlert('Erro', errorText);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>
            Buscar Repositório
          </Text>
          <Text style={[styles.headerSubtitle, isDark ? styles.textMutedDark : styles.textMutedLight]}>
            Informe o identificador do proprietário (ownerid) e o identificador do repositório (repoid)
            para buscar na API do GitHub.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>
              Owner ID (Dono do repositório) *
            </Text>
            <TextInput
              style={[
                styles.input,
                isDark ? styles.inputDark : styles.inputLight,
                loading && styles.inputDisabled,
              ]}
              placeholder="ex: facebook"
              placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              value={ownerId}
              onChangeText={(text) => {
                setOwnerId(text);
                if (errorMessage) setErrorMessage(null);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>
              Repo ID (Nome do repositório) *
            </Text>
            <TextInput
              style={[
                styles.input,
                isDark ? styles.inputDark : styles.inputLight,
                loading && styles.inputDisabled,
              ]}
              placeholder="ex: react-native"
              placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              value={repoId}
              onChangeText={(text) => {
                setRepoId(text);
                if (errorMessage) setErrorMessage(null);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.buttonsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonAdd,
                (loading || !ownerId.trim() || !repoId.trim()) && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleAdd}
              disabled={loading || !ownerId.trim() || !repoId.trim()}>
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.buttonAddText}>Buscando repositório...</Text>
                </View>
              ) : (
                <Text style={styles.buttonAddText}>Adicionar</Text>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                isDark ? styles.buttonCancelDark : styles.buttonCancelLight,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleCancel}
              disabled={loading}>
              <Text
                style={[
                  styles.buttonCancelText,
                  isDark ? styles.textDark : styles.textLight,
                ]}>
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        maxWidth: 540,
        marginHorizontal: 'auto',
        width: '100%',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  inputLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    color: '#0f172a',
  },
  inputDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    color: '#f8fafc',
  },
  inputDisabled: {
    opacity: 0.6,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAdd: {
    backgroundColor: '#2563eb',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonAddText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonCancelLight: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  buttonCancelDark: {
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
  },
  buttonCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textLight: {
    color: '#0f172a',
  },
  textDark: {
    color: '#f8fafc',
  },
  textMutedLight: {
    color: '#64748b',
  },
  textMutedDark: {
    color: '#94a3b8',
  },
});

