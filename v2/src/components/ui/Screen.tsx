import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, space } from '@/theme';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  /** Espaço inferior extra (ex.: acima da tab bar). */
  bottomInset?: number;
  contentStyle?: StyleProp<ViewStyle>;
  /** Mostra os "orbs" de aurora no fundo. */
  aurora?: boolean;
}

export function Screen({ children, scroll = true, bottomInset = 0, contentStyle, aurora = true }: Props) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + space.lg,
    paddingBottom: insets.bottom + space.xxl + bottomInset,
    paddingHorizontal: space.xl,
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      {aurora && (
        <>
          <View pointerEvents="none" style={[styles.orb, styles.orbA]} />
          <View pointerEvents="none" style={[styles.orb, styles.orbB]} />
        </>
      )}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[padding, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, padding, contentStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  orb: { position: 'absolute', borderRadius: 999 },
  orbA: { width: 340, height: 340, top: -140, right: -120, backgroundColor: 'rgba(142,124,255,0.20)' },
  orbB: { width: 280, height: 280, top: 260, left: -160, backgroundColor: 'rgba(53,227,192,0.09)' },
});
