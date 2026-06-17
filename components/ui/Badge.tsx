import { View, Text, type ViewStyle, type TextStyle } from 'react-native';
import { Colors } from '@/constants/theme';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'warning';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<BadgeVariant, { bg: ViewStyle; text: TextStyle }> = {
  default: {
    bg: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    text: { color: Colors.primaryForeground },
  },
  secondary: {
    bg: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
    text: { color: Colors.secondaryForeground },
  },
  destructive: {
    bg: { backgroundColor: Colors.destructive, borderColor: Colors.destructive },
    text: { color: '#FFFFFF' },
  },
  outline: {
    bg: { backgroundColor: 'transparent', borderColor: Colors.border },
    text: { color: Colors.foreground },
  },
  warning: {
    bg: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
    text: { color: '#92400E' },
  },
};

export function Badge({ variant = 'default', children, style, textStyle }: BadgeProps) {
  const v = variantStyles[variant];
  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          borderWidth: 1,
          paddingHorizontal: 8,
          paddingVertical: 2,
        },
        v.bg,
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          style={[
            {
              fontSize: 12,
              fontFamily: 'PlusJakartaSans-Medium',
            },
            v.text,
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}
