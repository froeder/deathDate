import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Card, H2, H3, Body, Caps, Pill } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CountdownDisplay } from '@/components/CountdownDisplay';
import { OpportunityCard } from '@/components/OpportunityCard';
import { useProfile } from '@/providers/ProfileProvider';
import { colors, fonts, space, type as t } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, estimate, loading, migratedFromLegacy } = useProfile();

  if (loading) {
    return (
      <Screen scroll={false}>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[t.bodyMuted, { marginTop: space.md }]}>Calculando estimativa...</Text>
        </View>
      </Screen>
    );
  }

  // If user hasn't filled profile yet
  if (!profile || !estimate) {
    return (
      <Screen>
        <View style={styles.emptyContainer}>
          <View style={styles.skullIconWrapper}>
            <Ionicons name="hourglass-outline" size={56} color={colors.primary} />
          </View>
          <H2 style={{ textAlign: 'center', marginBottom: space.xs }}>
            Descubra sua Expectativa de Vida
          </H2>
          <Body style={{ textAlign: 'center', marginBottom: space.xl }}>
            Responda um questionário rápido sobre seus hábitos, estilo de vida e histórico de saúde para calcular seu tempo estimado com base nas tábuas do IBGE e estudos de Harvard e The Lancet.
          </Body>

          <Button
            title="Preencher Questionário"
            onPress={() => router.push('/(tabs)/assessment')}
            style={{ width: '100%' }}
          />

          <Card style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "Aproveite o hoje. A reflexão sobre a brevidade da vida não serve para gerar medo, mas sim para dar valor a cada segundo."
            </Text>
            <Caps style={{ textAlign: 'right', marginTop: space.sm }}>Memento Mori</Caps>
          </Card>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Caps>Painel de Longevidade</Caps>
          <H2 style={{ marginTop: 2 }}>Tempo Estimado</H2>
        </View>
        <Button
          title="Editar"
          variant="secondary"
          onPress={() => router.push('/(tabs)/assessment')}
          style={{ minHeight: 38, paddingHorizontal: 16 }}
        />
      </View>

      {migratedFromLegacy && (
        <Card style={styles.bannerCard} tint={colors.gold}>
          <View style={styles.bannerRow}>
            <Ionicons name="information-circle" size={20} color={colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={[t.body, { color: colors.gold, fontFamily: fonts.bodySemi }]}>
                Dados migrados da versão anterior
              </Text>
              <Text style={t.small}>
                Atualizamos com fatores mais recentes (sono, dieta, pressão). Revise seu questionário na aba "Meus Hábitos".
              </Text>
            </View>
          </View>
        </Card>
      )}

      {/* Main Countdown Display */}
      <CountdownDisplay estimate={estimate} />

      {/* Probabilistic Milestones */}
      <Card style={styles.milestonesCard}>
        <Caps>Probabilidade de Sobrevida</Caps>
        <Text style={[t.small, { marginTop: 2, marginBottom: space.md }]}>
          Com base na tábua atuarial Gompertz-Makeham calibrada para sua idade e perfil:
        </Text>

        <View style={styles.chancesRow}>
          <ChanceItem
            age={80}
            percentage={Math.round(estimate.chanceTo[80] * 100)}
            color={colors.teal}
          />
          <ChanceItem
            age={90}
            percentage={Math.round(estimate.chanceTo[90] * 100)}
            color={colors.primary}
          />
          <ChanceItem
            age={100}
            percentage={Math.round(estimate.chanceTo[100] * 100)}
            color={colors.ember}
          />
        </View>

        <View style={styles.distributionRow}>
          <Text style={t.small}>
            Faixa provável de falecimento: <Text style={{ color: colors.text, fontFamily: fonts.bodyMedium }}>{estimate.p25AgeAtDeath.toFixed(0)} a {estimate.p75AgeAtDeath.toFixed(0)} anos</Text>
          </Text>
        </View>
      </Card>

      {/* Top Opportunities Section */}
      {estimate.opportunities.length > 0 && (
        <View style={styles.opportunitiesSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Caps>Como viver mais e melhor</Caps>
              <H3 style={{ marginTop: 2 }}>
                Oportunidades de Ganho de Vida (+{estimate.potentialGainYears.toFixed(1)} anos)
              </H3>
            </View>
          </View>

          <View style={{ gap: 8, marginTop: space.sm }}>
            {estimate.opportunities.slice(0, 3).map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </View>

          <Button
            title="Ver simulador e todos os fatores"
            variant="secondary"
            onPress={() => router.push('/(tabs)/insights')}
            style={{ marginTop: space.md }}
          />
        </View>
      )}

      {/* Philosophical Quote Card */}
      <Card style={styles.quoteCard}>
        <Text style={styles.quoteText}>
          "Não temos pouco tempo, mas desperdiçamos muito. A vida é suficientemente longa quando bem aproveitada."
        </Text>
        <Caps style={{ textAlign: 'right', marginTop: space.sm }}>Sêneca — Sobre a Brevidade da Vida</Caps>
      </Card>
    </Screen>
  );
}

function ChanceItem({ age, percentage, color }: { age: number; percentage: number; color: string }) {
  return (
    <View style={styles.chanceItem}>
      <Text style={[styles.chancePercent, { color }]}>{percentage}%</Text>
      <Text style={styles.chanceLabel}>Até os {age} anos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: space.xxl,
    alignItems: 'center',
    gap: space.md,
  },
  skullIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.sm,
  },
  bannerCard: {
    padding: space.md,
    marginBottom: space.md,
    backgroundColor: 'rgba(255, 210, 122, 0.08)',
  },
  bannerRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  milestonesCard: {
    padding: space.lg,
    marginVertical: space.sm,
  },
  chancesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  chanceItem: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chancePercent: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 30,
  },
  chanceLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textDim,
    marginTop: 2,
  },
  distributionRow: {
    marginTop: space.md,
    paddingTop: space.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  opportunitiesSection: {
    marginTop: space.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quoteCard: {
    marginVertical: space.xl,
    padding: space.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  quoteText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
