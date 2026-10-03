import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radius, type as t } from '@/theme';

export interface Option<T> {
  value: T;
  label: string;
  description?: string;
}

/** Seleção única em formato de "chips" (quebra em várias linhas). */
export function ChoiceGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  hint,
}: {
  label?: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  hint?: string;
}) {
  return (
    <View style={styles.group}>
      {label ? <Text style={t.label}>{label}</Text> : null}
      <View style={styles.wrap}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <Pressable
              key={String(o.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              onPress={() => {
                void Haptics.selectionAsync().catch(() => {});
                onChange(o.value);
              }}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {hint ? <Text style={t.small}>{hint}</Text> : null}
    </View>
  );
}

/** Opções em cartões com descrição (para perguntas importantes). */
export function OptionCards<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.group}>
      {label ? <Text style={t.label}>{label}</Text> : null}
      <View style={{ gap: 8 }}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <Pressable
              key={String(o.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              onPress={() => {
                void Haptics.selectionAsync().catch(() => {});
                onChange(o.value);
              }}
              style={[styles.card, active && styles.cardActive]}
            >
              <View style={[styles.radio, active && styles.radioActive]}>{active && <View style={styles.radioDot} />}</View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, active && { color: colors.text }]}>{o.label}</Text>
                {o.description ? <Text style={t.small}>{o.description}</Text> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => {
        void Haptics.selectionAsync().catch(() => {});
        onChange(!value);
      }}
      style={styles.toggle}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {description ? <Text style={t.small}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.surfaceStrong, true: colors.primary }}
        thumbColor="#fff"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: { gap: 9 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontFamily: fonts.bodyMedium, fontSize: 14 },
  chipTextActive: { color: colors.text },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  cardTitle: { color: colors.textMuted, fontFamily: fonts.bodySemi, fontSize: 15 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleLabel: { color: colors.text, fontFamily: fonts.bodyMedium, fontSize: 15 },
});
