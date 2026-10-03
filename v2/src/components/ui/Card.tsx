import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, space, type as t } from '@/theme';

export function Card({
  children,
  style,
  tint,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Cor de realce na borda (ex.: colors.primary). */
  tint?: string;
}) {
  return (
    <View style={[styles.wrap, tint ? { borderColor: tint + '55' } : null, style]}>
      <LinearGradient colors={gradients.card} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

export const H1 = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => (
  <Text accessibilityRole="header" style={[t.h1, style]}>{children}</Text>
);
export const H2 = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => (
  <Text accessibilityRole="header" style={[t.h2, style]}>{children}</Text>
);
export const H3 = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => (
  <Text style={[t.h3, style]}>{children}</Text>
);
export const Body = ({ children, style, muted = true }: { children: React.ReactNode; style?: StyleProp<TextStyle>; muted?: boolean }) => (
  <Text style={[muted ? t.bodyMuted : t.body, style]}>{children}</Text>
);
export const Small = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => (
  <Text style={[t.small, style]}>{children}</Text>
);
export const Caps = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => (
  <Text style={[t.caps, style]}>{children}</Text>
);

export function Pill({ label, color = colors.primary, bg }: { label: string; color?: string; bg?: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg ?? color + '26' }]}>
      <Text style={[t.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    padding: space.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
});
