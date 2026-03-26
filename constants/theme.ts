export const Colors = {
  primary: '#7C3AED',
  primaryForeground: '#FFFFFF',
  secondary: '#F5F3FF',
  secondaryForeground: '#5B21B6',
  muted: '#F9FAFB',
  mutedForeground: '#6B7280',
  accent: '#EDE9FE',
  accentForeground: '#5B21B6',
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',
  background: '#FFFFFF',
  foreground: '#1F2937',
  card: '#FFFFFF',
  cardForeground: '#1F2937',
  border: '#E5E7EB',
  input: '#E5E7EB',
  ring: '#7C3AED',

  status: {
    pending: '#7C3AED',
    accepted: '#10B981',
    rejected: '#EF4444',
    delivering: '#3B82F6',
    arrived: '#10B981',
    acknowledged: '#6B7280',
  },
} as const;

export const Fonts = {
  sans: 'PlusJakartaSans',
  heading: 'DMSans',
} as const;

export const Radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;
