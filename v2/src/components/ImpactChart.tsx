import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Caps } from '@/components/ui/Card';
import { colors, fonts, radius, space, type as t } from '@/theme';
import type { FactorContribution } from '@/lib/longevity';

interface Props {
  contributions: FactorContribution[];
  deltaVsBaseline: number;
}

export function ImpactChart({ contributions, deltaVsBaseline }: Props) {
  // Sort into positive effects and risk factors
  const risks = contributions.filter((c) => c.yearsVsAverage < -0.1);
  const protectors = contributions.filter((c) => c.yearsVsAverage > 0.1);

  const maxMagnitude = Math.max(
    ...contributions.map((c) => Math.abs(c.yearsVsAverage)),
    4
  );

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Caps>Balanço de Hábitos & Riscos</Caps>
          <Text style={[t.h3, { marginTop: 2 }]}>
            {deltaVsBaseline >= 0 ? (
              <Text style={{ color: colors.teal }}>+{deltaVsBaseline.toFixed(1)} anos </Text>
            ) : (
              <Text style={{ color: colors.rose }}>{deltaVsBaseline.toFixed(1)} anos </Text>
            )}
            em relação à média da UF
          </Text>
        </View>
      </View>

      <Text style={[t.small, { marginBottom: space.md }]}>
        Estimativa baseada em hazard ratios de coortes populacionais comparados à média dos adultos no Brasil:
      </Text>

      {/* Protectors list */}
      {protectors.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={16} color={colors.teal} />
            <Text style={[styles.sectionTitle, { color: colors.teal }]}>Fatores que prolongam sua vida</Text>
          </View>
          {protectors.map((item) => (
            <FactorRow key={item.id} item={item} maxMag={maxMagnitude} isPositive />
          ))}
        </View>
      )}

      {/* Risks list */}
      {risks.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning" size={16} color={colors.rose} />
            <Text style={[styles.sectionTitle, { color: colors.rose }]}>Fatores que reduzem sua expectativa</Text>
          </View>
          {risks.map((item) => (
            <FactorRow key={item.id} item={item} maxMag={maxMagnitude} isPositive={false} />
          ))}
        </View>
      )}

      {protectors.length === 0 && risks.length === 0 && (
        <Text style={[t.bodyMuted, { textAlign: 'center', marginVertical: space.md }]}>
          Seu perfil está exatamente na média estatística populacional brasileira.
        </Text>
      )}
    </Card>
  );
}

function FactorRow({
  item,
  maxMag,
  isPositive,
}: {
  item: FactorContribution;
  maxMag: number;
  isPositive: boolean;
}) {
  const percent = Math.min(100, Math.round((Math.abs(item.yearsVsAverage) / maxMag) * 100));
  const color = isPositive ? colors.teal : colors.rose;

  return (
    <View style={styles.factorRow}>
      <View style={styles.factorInfo}>
        <Text style={styles.factorLabel}>{item.label}</Text>
        <Text style={styles.factorSummary}>{item.summary}</Text>
      </View>

      <View style={styles.barContainer}>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                width: `${percent}%`,
                backgroundColor: color,
                alignSelf: isPositive ? 'flex-start' : 'flex-end',
              },
            ]}
          />
        </View>
        <Text style={[styles.factorYears, { color }]}>
          {isPositive ? '+' : ''}
          {item.yearsVsAverage.toFixed(1)}a
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: space.lg,
    marginVertical: space.sm,
  },
  header: {
    marginBottom: space.sm,
  },
  section: {
    marginTop: space.md,
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  factorInfo: {
    flex: 1.2,
    paddingRight: 8,
  },
  factorLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
  },
  factorSummary: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textDim,
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceStrong,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  factorYears: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    width: 44,
    textAlign: 'right',
  },
});
