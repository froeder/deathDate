import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Caps, Pill } from '@/components/ui/Card';
import { ToggleRow } from '@/components/ui/Choice';
import { colors, fonts, space, type as t } from '@/theme';
import {
  computeBmi,
  estimateLongevity,
  type HealthProfile,
} from '@/lib/longevity';

interface Props {
  profile: HealthProfile;
}

export function HabitSimulator({ profile }: Props) {
  // Simulator state: toggle hypothetical improvements
  const [quitSmoking, setQuitSmoking] = useState(false);
  const [boostActivity, setBoostActivity] = useState(false);
  const [optimizeDiet, setOptimizeDiet] = useState(false);
  const [optimizeSleep, setOptimizeSleep] = useState(false);
  const [healthyWeight, setHealthyWeight] = useState(false);
  const [controlHypertension, setControlHypertension] = useState(false);

  // Baseline estimate
  const baseEstimate = useMemo(() => estimateLongevity(profile), [profile]);

  // Simulated profile
  const simulatedProfile = useMemo(() => {
    let p: HealthProfile = { ...profile };

    if (quitSmoking && p.smoking !== 'never') {
      p.smoking = 'former';
      p.yearsSinceQuit = 15;
    }

    if (boostActivity) {
      p.activityMinutes = Math.max(p.activityMinutes, 300);
      p.activityIntensity = 'moderate';
    }

    if (optimizeDiet) {
      p.diet = { produce: 2, legumes: 2, meat: 2, ultra: 2 };
    }

    if (optimizeSleep) {
      p.sleepHours = 7.5;
    }

    if (healthyWeight) {
      const h = p.heightCm / 100;
      p.weightKg = 22.5 * h * h;
    }

    if (controlHypertension && p.conditions.hypertension === 'uncontrolled') {
      p.conditions = { ...p.conditions, hypertension: 'controlled' };
    }

    return p;
  }, [
    profile,
    quitSmoking,
    boostActivity,
    optimizeDiet,
    optimizeSleep,
    healthyWeight,
    controlHypertension,
  ]);

  const simulatedEstimate = useMemo(
    () => estimateLongevity(simulatedProfile),
    [simulatedProfile]
  );

  const yearsGained = simulatedEstimate.remainingYears - baseEstimate.remainingYears;
  const isSmoking = profile.smoking === 'current' || profile.smoking === 'vape';
  const currentBmi = computeBmi(profile);
  const hasAbnormalWeight = currentBmi > 25 || currentBmi < 18.5;
  const hasUncontrolledBP = profile.conditions.hypertension === 'uncontrolled';

  return (
    <Card style={styles.card} tint={yearsGained > 0.1 ? colors.teal : undefined}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Caps>Simulador "E Se...?"</Caps>
          <Text style={[t.h3, { marginTop: 2 }]}>Simule mudanças no seu estilo de vida</Text>
        </View>
        {yearsGained > 0.05 && (
          <Pill
            label={`+${yearsGained.toFixed(1)} anos`}
            color={colors.teal}
            bg={colors.tealSoft}
          />
        )}
      </View>

      <Text style={[t.small, { marginBottom: space.md }]}>
        Ative as melhorias abaixo para ver o impacto direto na sua longevidade em tempo real:
      </Text>

      {/* Simulator Toggles */}
      <View style={{ gap: 8 }}>
        {isSmoking && (
          <ToggleRow
            label="Parar de fumar completamente"
            description="Recupera até 9 a 10 anos de expectativa ao longo do tempo"
            value={quitSmoking}
            onChange={setQuitSmoking}
          />
        )}

        <ToggleRow
          label="Exercitar-se 300 min/semana"
          description="Caminhada rápida, corrida ou pedal diário (≈ 45 min/dia)"
          value={boostActivity}
          onChange={setBoostActivity}
        />

        <ToggleRow
          label="Adotar dieta de alta qualidade"
          description="Mais legumes, integrais, frutas e castanhas; menos ultraprocessados"
          value={optimizeDiet}
          onChange={setOptimizeDiet}
        />

        <ToggleRow
          label="Dormir 7 a 8 horas por noite"
          description="Regularizar horário de dormir e qualidade do sono"
          value={optimizeSleep}
          onChange={setOptimizeSleep}
        />

        {hasAbnormalWeight && (
          <ToggleRow
            label="Alcançar peso saudável (IMC 22.5)"
            description={`Seu IMC atual é ${currentBmi.toFixed(1)}`}
            value={healthyWeight}
            onChange={setHealthyWeight}
          />
        )}

        {hasUncontrolledBP && (
          <ToggleRow
            label="Controlar a pressão arterial (< 130/80)"
            description="Com acompanhamento médico e redução de sódio"
            value={controlHypertension}
            onChange={setControlHypertension}
          />
        )}
      </View>

      {/* Result Display */}
      <View style={styles.resultBox}>
        <View style={styles.statCol}>
          <Text style={t.small}>Idade Atual Estimada</Text>
          <Text style={styles.statCurrent}>{baseEstimate.expectedAgeAtDeath.toFixed(1)} anos</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statCol}>
          <Text style={t.small}>Com Melhorias</Text>
          <Text style={[styles.statSimulated, yearsGained > 0.1 && { color: colors.teal }]}>
            {simulatedEstimate.expectedAgeAtDeath.toFixed(1)} anos
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: space.lg,
    marginVertical: space.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.sm,
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: space.lg,
    padding: space.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCol: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  statCurrent: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.textDim,
    marginTop: 2,
  },
  statSimulated: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.text,
    marginTop: 2,
  },
});
