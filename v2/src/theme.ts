import { Platform } from 'react-native';

export const colors = {
  bg: '#06070D',
  bgElevated: '#0D0F1A',
  surface: 'rgba(255,255,255,0.05)',
  surfaceStrong: 'rgba(255,255,255,0.09)',
  border: 'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.18)',

  text: '#F5F6FB',
  textMuted: '#A3A8C3',
  textDim: '#6C7194',

  primary: '#8E7CFF',
  primarySoft: 'rgba(142,124,255,0.16)',
  teal: '#35E3C0',
  tealSoft: 'rgba(53,227,192,0.14)',
  ember: '#FF8A5C',
  emberSoft: 'rgba(255,138,92,0.15)',
  rose: '#FF5C7A',
  roseSoft: 'rgba(255,92,122,0.15)',
  gold: '#FFD27A',
  success: '#4ADE9A',
  successSoft: 'rgba(74,222,154,0.14)',
  danger: '#FF5C7A',
} as const;

export const gradients = {
  background: ['#0B0C1E', '#06070D', '#06070D'] as const,
  primary: ['#8E7CFF', '#5B8CFF'] as const,
  aurora: ['#8E7CFF', '#35E3C0'] as const,
  ember: ['#FF8A5C', '#FF5C7A'] as const,
  card: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)'] as const,
};

export const fonts = {
  display: 'Outfit_700Bold',
  displayMedium: 'Outfit_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  mono: Platform.select({ ios: 'Menlo', default: 'monospace' }) as string,
} as const;

export const radius = { sm: 10, md: 16, lg: 22, xl: 30, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const type = {
  hero: { fontFamily: fonts.display, fontSize: 34, lineHeight: 40, color: colors.text },
  h1: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, color: colors.text },
  h2: { fontFamily: fonts.displayMedium, fontSize: 21, lineHeight: 27, color: colors.text },
  h3: { fontFamily: fonts.displayMedium, fontSize: 17, lineHeight: 22, color: colors.text },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.text },
  bodyMuted: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.textMuted },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.textMuted },
  label: { fontFamily: fonts.bodySemi, fontSize: 13, lineHeight: 18, color: colors.textMuted, letterSpacing: 0.3 },
  caps: {
    fontFamily: fonts.bodySemi, fontSize: 11, lineHeight: 14, color: colors.textDim,
    letterSpacing: 1.2, textTransform: 'uppercase' as const,
  },
} as const;
