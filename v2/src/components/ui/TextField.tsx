import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, type as t } from '@/theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secure?: boolean;
  suffix?: string;
}

export function TextField({ label, error, hint, icon, secure, suffix, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={styles.group}>
      <Text style={t.label}>{label}</Text>
      <View style={[styles.field, focused && styles.focused, !!error && styles.errored]}>
        {icon && <Ionicons name={icon} size={19} color={focused ? colors.primary : colors.textDim} />}
        <TextInput
          {...rest}
          accessibilityLabel={label}
          placeholderTextColor={colors.textDim}
          secureTextEntry={hidden}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, style]}
          selectionColor={colors.primary}
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
        {secure && (
          <Pressable hitSlop={10} onPress={() => setHidden((h) => !h)} accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textDim} />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={t.small}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 7 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  focused: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  errored: { borderColor: colors.rose },
  input: { flex: 1, color: colors.text, fontFamily: fonts.body, fontSize: 16, paddingVertical: 12 },
  suffix: { color: colors.textDim, fontFamily: fonts.bodyMedium, fontSize: 14 },
  error: { color: colors.rose, fontFamily: fonts.bodyMedium, fontSize: 13 },
});
