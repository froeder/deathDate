import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Pill } from '@/components/ui/Card';
import { colors, fonts, space, type as t } from '@/theme';
import type { Opportunity } from '@/lib/longevity';

interface Props {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: Props) {
  return (
    <Card style={styles.card} tint={colors.teal}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles" size={16} color={colors.teal} />
          </View>
          <Text style={styles.title}>{opportunity.label}</Text>
        </View>
        <Pill
          label={`+${opportunity.yearsGain.toFixed(1)} anos`}
          color={colors.teal}
          bg={colors.tealSoft}
        />
      </View>

      <Text style={styles.actionText}>{opportunity.action}</Text>

      {opportunity.evidence ? (
        <View style={styles.evidenceBox}>
          <Ionicons name="school-outline" size={13} color={colors.textDim} />
          <Text style={styles.evidenceText}>{opportunity.evidence}</Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: space.md,
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    color: colors.text,
  },
  actionText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    marginVertical: space.xs,
  },
  evidenceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingTop: space.xs,
    marginTop: space.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  evidenceText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textDim,
  },
});
