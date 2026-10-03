import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Card, H2, H3, Body, Caps, Pill } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useProfile } from '@/providers/ProfileProvider';
import { loadHistory, type HistoryEntry } from '@/lib/profileRepo';
import { colors, fonts, space, type as t } from '@/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { deleteData, reload } = useProfile();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      setLoadingHistory(true);
      loadHistory(user.uid)
        .then(setHistory)
        .catch(() => {})
        .finally(() => setLoadingHistory(false));
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (err: any) {
      Alert.alert('Erro ao sair', err?.message);
    }
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Excluir Meus Dados',
      'Tem certeza de que deseja apagar permanentemente todas as suas respostas, perfil e histórico de cálculos salvos no servidor? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, Apagar Tudo',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteData();
              Alert.alert('Dados Excluídos', 'Todos os seus dados foram apagados com sucesso.');
              router.replace('/(tabs)');
            } catch (err: any) {
              Alert.alert('Erro ao excluir', err?.message);
            }
          },
        },
      ]
    );
  };

  const isGuest = !user || user.isAnonymous;

  return (
    <Screen>
      <View style={styles.header}>
        <Caps>Conta & Privacidade</Caps>
        <H2 style={{ marginTop: 2 }}>Perfil do Usuário</H2>
      </View>

      {/* Account Info Card */}
      <Card style={styles.card}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>
              {isGuest ? 'Usuário Convidado' : user?.email ?? 'Usuário'}
            </Text>
            <Text style={t.small}>
              {isGuest
                ? 'Seus dados são salvos localmente nesta sessão.'
                : 'Sincronizado na nuvem com o Firebase.'}
            </Text>
          </View>
          <Pill
            label={isGuest ? 'Convidado' : 'Conectado'}
            color={isGuest ? colors.gold : colors.teal}
          />
        </View>

        {isGuest && (
          <Button
            title="Criar conta ou Fazer Login"
            variant="secondary"
            onPress={() => router.push('/(auth)/login')}
            style={{ marginTop: space.md }}
          />
        )}
      </Card>

      {/* History Log Section */}
      <View style={styles.historySection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <H3>Histórico de Cálculos</H3>
        </View>

        {history.length > 0 ? (
          <View style={{ gap: 8, marginTop: space.sm }}>
            {history.map((item) => (
              <Card key={item.id} style={styles.historyItem}>
                <View style={styles.historyRow}>
                  <View>
                    <Text style={styles.historyDate}>
                      {item.createdAt.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                    <Text style={t.small}>Idade na avaliação: {item.age.toFixed(0)} anos</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.historyAge}>
                      {item.expectedAgeAtDeath.toFixed(1)} anos
                    </Text>
                    <Text style={[t.small, { color: colors.teal }]}>
                      {item.remainingYears.toFixed(1)} anos restantes
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card style={[styles.card, { marginTop: space.sm }]}>
            <Text style={[t.bodyMuted, { textAlign: 'center' }]}>
              {loadingHistory
                ? 'Carregando histórico...'
                : 'Nenhum histórico anterior registrado ainda. Seus próximos cálculos salvos aparecerão aqui.'}
            </Text>
          </Card>
        )}
      </View>

      {/* Privacy and LGPD Actions */}
      <View style={styles.actionsSection}>
        <Button
          title="Ver Termos e Aviso Legal"
          variant="secondary"
          onPress={() => router.push('/modal/disclaimer')}
        />

        <Button
          title="Excluir Todos os Meus Dados (LGPD)"
          variant="danger"
          onPress={handleDeleteData}
        />

        {!isGuest && (
          <Button
            title="Sair da Conta"
            variant="ghost"
            onPress={handleLogout}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: space.md,
  },
  card: {
    padding: space.lg,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.text,
  },
  historySection: {
    marginVertical: space.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyItem: {
    padding: space.md,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.text,
  },
  historyAge: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.text,
  },
  actionsSection: {
    gap: 12,
    marginBottom: space.xxl,
  },
});
