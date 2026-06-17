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

  // bg: '#FEF3C7', text: '#92400E',
  
  status: {
    pending:     { fg: '#7C3AED', bg: '#F3E8FF', bar: '#7C3AED' },
    accepted:    { fg: '#059669', bg: '#D1FAE5', bar: '#10B981' },
    delivering:  { fg: '#92400E', bg: '#FEF3C7', bar: '#F59E0B' },
    arrived:     { fg: '#7C3AED', bg: '#D1FAE5', bar: '#7C3AED' },
    rejected:    { fg: '#DC2626', bg: '#FEE2E2', bar: '#EF4444' },
    acknowledged:{ fg: '#4B5563', bg: '#F3F4F6', bar: '#6B7280'},
  },

  statusBadge: {
    pending: { bg: '#F3E8FF', text: '#7C3AED' },
    accepted: { bg: '#D1FAE5', text: '#059669' },
    rejected: { bg: '#FEE2E2', text: '#DC2626' },
    delivering: { bg: '#FEF3C7', text: '#92400E' },
    arrived: { bg: '#F3E8FF', text: '#7C3AED' },
    acknowledged: { bg: '#F3F4F6', text: '#4B5563' },
    // Old arrived version: arrived: { bg: '#D1FAE5', text: '#059669' },
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
