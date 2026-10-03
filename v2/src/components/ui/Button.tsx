import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, fonts, gradients, radius } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ title, onPress, variant = 'primary', loading, disabled, icon, style, testID }: Props) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const inactive = disabled || loading;

  const handlePress = () => {
    if (inactive) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  };

  const textColor = variant === 'primary' ? '#0B0B16' : variant === 'danger' ? colors.rose : colors.text;

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      onPress={handlePress}
      onPressIn={() => (scale.value = withSpring(0.97, { damping: 18, stiffness: 320 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 14, stiffness: 260 }))}
      style={[anim, styles.base, variant === 'secondary' && styles.secondary, variant === 'danger' && styles.danger, inactive && styles.disabled, style]}
    >
      {variant === 'primary' && (
        <LinearGradient colors={gradients.aurora} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      )}
      <View style={styles.row}>
        {loading ? <ActivityIndicator color={textColor} /> : icon}
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 24,
  },
  secondary: { backgroundColor: colors.surfaceStrong, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.roseSoft, borderWidth: 1, borderColor: colors.rose + '55' },
  disabled: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  text: { fontFamily: fonts.bodySemi, fontSize: 16 },
});
