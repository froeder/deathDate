import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Caps, Pill } from '@/components/ui/Card';
import { colors, fonts, radius, space, type as t } from '@/theme';
import { deathDateFromEstimate, type LongevityEstimate } from '@/lib/longevity';

interface Props {
  estimate: LongevityEstimate;
}

interface TimeParts {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateRemaining(targetDate: Date): TimeParts {
  const now = new Date();
  let diffSec = Math.floor((targetDate.getTime() - now.getTime()) / 1000);

  if (diffSec <= 0) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const SEC_DAY = 86400;
  const SEC_YEAR = SEC_DAY * 365.25;
  const SEC_MONTH = SEC_DAY * 30.4375;

  const years = Math.floor(diffSec / SEC_YEAR);
  diffSec %= SEC_YEAR;

  const months = Math.floor(diffSec / SEC_MONTH);
  diffSec %= SEC_MONTH;

  const days = Math.floor(diffSec / SEC_DAY);
  diffSec %= SEC_DAY;

  const hours = Math.floor(diffSec / 3600);
  diffSec %= 3600;

  const minutes = Math.floor(diffSec / 60);
  const seconds = diffSec % 60;

  return { years, months, days, hours, minutes, seconds, isPast: false };
}

export function CountdownDisplay({ estimate }: Props) {
  const [targetDate, setTargetDate] = useState(() => deathDateFromEstimate(estimate));
  const [parts, setParts] = useState(() => calculateRemaining(targetDate));

  useEffect(() => {
    const nextTarget = deathDateFromEstimate(estimate);
    setTargetDate(nextTarget);
    setParts(calculateRemaining(nextTarget));

    const interval = setInterval(() => {
      setParts(calculateRemaining(nextTarget));
    }, 1000);

    return () => clearInterval(interval);
  }, [estimate]);

  const totalLifeYears = estimate.expectedAgeAtDeath;
  const livedPercentage = Math.min(100, Math.max(0, (estimate.age / totalLifeYears) * 100));

  const formattedDate = targetDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      {/* Target Death Date Header */}
      <Card style={styles.heroCard} tint={colors.primary}>
        <View style={styles.headerRow}>
          <View style={styles.badgeRow}>
            <View style={styles.liveIndicator} />
            <Caps style={{ color: colors.teal }}>Tempo Estimado Restante</Caps>
          </View>
          <Pill
            label={`${estimate.expectedAgeAtDeath.toFixed(1)} anos estimados`}
            color={colors.primary}
            bg={colors.primarySoft}
          />
        </View>

        {/* Big Digit Grid */}
        <View style={styles.timeGrid}>
          <TimeUnit value={parts.years} label="ANOS" />
          <TimeUnit value={parts.months} label="MESES" />
          <TimeUnit value={parts.days} label="DIAS" />
        </View>

        <View style={styles.timeGridSecondary}>
          <TimeUnitSmall value={parts.hours} label="horas" />
          <Text style={styles.divider}>:</Text>
          <TimeUnitSmall value={parts.minutes} label="minutos" />
          <Text style={styles.divider}>:</Text>
          <TimeUnitSmall value={parts.seconds} label="segundos" highlight />
        </View>

        {/* Life Bar */}
        <View style={styles.lifeProgressSection}>
          <View style={styles.progressLabels}>
            <Text style={t.small}>
              Vida percorrida: <Text style={{ color: colors.text, fontFamily: fonts.bodySemi }}>{livedPercentage.toFixed(1)}%</Text> ({estimate.age.toFixed(0)} anos)
            </Text>
            <Text style={t.small}>
              Restante: <Text style={{ color: colors.teal, fontFamily: fonts.bodySemi }}>{estimate.remainingYears.toFixed(1)} anos</Text>
            </Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.bar, { width: `${livedPercentage}%` }]} />
          </View>
        </View>

        {/* Estimated Date Tag */}
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textDim} />
          <Text style={t.small}>
            Data estimada: <Text style={{ color: colors.text, fontFamily: fonts.bodyMedium }}>{formattedDate}</Text>
          </Text>
        </View>
      </Card>
    </View>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.timeBox}>
      <Text style={styles.timeNumber}>{value.toString().padStart(2, '0')}</Text>
      <Text style={styles.timeLabel}>{label}</Text>
    </View>
  );
}

function TimeUnitSmall({ value, label, highlight }: { value: number; label: string; highlight?: boolean }) {
  return (
    <View style={styles.timeBoxSmall}>
      <Text style={[styles.timeNumberSmall, highlight && { color: colors.teal }]}>
        {value.toString().padStart(2, '0')}
      </Text>
      <Text style={styles.timeLabelSmall}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: space.md,
  },
  heroCard: {
    padding: space.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.teal,
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: space.md,
  },
  timeBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  timeNumber: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 42,
    color: colors.text,
  },
  timeLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.textDim,
    marginTop: 2,
  },
  timeGridSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: radius.sm,
    marginBottom: space.lg,
  },
  timeBoxSmall: {
    alignItems: 'center',
  },
  timeNumberSmall: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    lineHeight: 24,
    color: colors.text,
  },
  timeLabelSmall: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textDim,
  },
  divider: {
    color: colors.textDim,
    fontSize: 18,
    fontFamily: fonts.display,
    marginTop: -8,
  },
  lifeProgressSection: {
    gap: 8,
    marginBottom: space.md,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceStrong,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    paddingTop: space.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
