import React from 'react';
import { StyleSheet, Text, View, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Card, H2, H3, Body, Caps, Pill } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImpactChart } from '@/components/ImpactChart';
import { HabitSimulator } from '@/components/HabitSimulator';
import { useProfile } from '@/providers/ProfileProvider';
import { SOURCES } from '@/lib/longevity';
import { colors, fonts, space, type as t } from '@/theme';

export default function InsightsScreen() {
  const router = useRouter();
  const { profile, estimate } = useProfile();

  if (!profile || !estimate) {
    return (
      <Screen>
        <View style={styles.emptyContainer}>
          <Ionicons name="analytics-outline" size={56} color={colors.primary} />
          <H2 style={{ textAlign: 'center', marginTop: space.sm }}>Nenhuma análise disponível</H2>
          <Body style={{ textAlign: 'center', marginVertical: space.md }}>
            Preencha o questionário primeiro para visualizar o balanço detalhado de hábitos e simular melhorias.
          </Body>
          <Button
            title="Preencher Questionário"
            onPress={() => router.push('/(tabs)/assessment')}
            style={{ width: '100%' }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Caps>Evidências & Simulação</Caps>
        <H2 style={{ marginTop: 2 }}>Ciência da Longevidade</H2>
        <Body style={{ marginTop: 4 }}>
          Entenda os números por trás da sua estimativa e teste o impacto de novos hábitos.
        </Body>
      </View>

      {/* Impact Breakdown */}
      <ImpactChart
        contributions={estimate.contributions}
        deltaVsBaseline={estimate.deltaVsBaseline}
      />

      {/* Interactive Habit Simulator */}
      <View style={{ marginVertical: space.md }}>
        <HabitSimulator profile={profile} />
      </View>

      {/* Scientific Sources Section */}
      <View style={styles.sourcesSection}>
        <View style={styles.sourcesHeader}>
          <Ionicons name="library-outline" size={20} color={colors.primary} />
          <H3 style={{ color: colors.text }}>Fontes Científicas Utilizadas</H3>
        </View>

        <Text style={[t.small, { marginBottom: space.md }]}>
          Os cálculos do Death Date utilizam hazard ratios (HR) de estudos de coorte prospectivos de larga escala e metanálises de referência:
        </Text>

        <View style={{ gap: 10 }}>
          {SOURCES.map((source) => (
            <Card key={source.id} style={styles.sourceCard}>
              <View style={styles.sourceTitleRow}>
                <Text style={styles.sourceTitle}>{source.title}</Text>
                <Pill label={source.citation} color={colors.textDim} bg="rgba(255,255,255,0.05)" />
              </View>
              <Text style={styles.sourceFinding}>{source.finding}</Text>
              {source.url ? (
                <Pressable
                  style={styles.linkRow}
                  onPress={() => Linking.openURL(source.url!)}
                >
                  <Ionicons name="open-outline" size={14} color={colors.primary} />
                  <Text style={styles.linkText}>Abrir publicação científica</Text>
                </Pressable>
              ) : null}
            </Card>
          ))}
        </View>
      </View>

      <Card style={styles.disclaimerBanner} tint={colors.ember}>
        <View style={styles.disclaimerRow}>
          <Ionicons name="information-circle" size={24} color={colors.ember} />
          <View style={{ flex: 1 }}>
            <Text style={[t.body, { color: colors.ember, fontFamily: fonts.bodySemi }]}>
              Aviso de Isenção de Responsabilidade
            </Text>
            <Text style={[t.small, { marginTop: 2 }]}>
              O Death Date é um simulador estatístico educativo e não substitui avaliação ou diagnóstico médico.
            </Text>
          </View>
        </View>
        <Button
          title="Ler aviso completo & CVV (188)"
          variant="secondary"
          onPress={() => router.push('/modal/disclaimer')}
          style={{ marginTop: space.sm }}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: space.md,
  },
  emptyContainer: {
    paddingVertical: space.xxl,
    alignItems: 'center',
    gap: space.md,
  },
  sourcesSection: {
    marginVertical: space.lg,
  },
  sourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: space.xs,
  },
  sourceCard: {
    padding: space.md,
  },
  sourceTitleRow: {
    flexDirection: 'column',
    gap: 4,
    marginBottom: 6,
  },
  sourceTitle: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    color: colors.text,
  },
  sourceFinding: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  linkText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.primary,
  },
  disclaimerBanner: {
    padding: space.md,
    marginVertical: space.lg,
    backgroundColor: 'rgba(255, 138, 92, 0.08)',
  },
  disclaimerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
});
