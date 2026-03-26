import { Platform, View, Text, type ViewProps, type TextProps } from 'react-native';
import { Colors } from '@/constants/theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

const cardShadow = Platform.select({
  web: {
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  } as any,
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

export function Card({ children, style, ...props }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.card,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: Colors.border,
          overflow: 'hidden' as const,
          ...cardShadow,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardHeader({ children, style, ...props }: CardProps) {
  return (
    <View
      style={[{ padding: 16, paddingBottom: 8, gap: 4 }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardContent({ children, style, ...props }: CardProps) {
  return (
    <View style={[{ paddingHorizontal: 16, paddingBottom: 16 }, style]} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ children, style, ...props }: CardProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingBottom: 16,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

interface CardTitleProps extends TextProps {
  children: React.ReactNode;
}

export function CardTitle({ children, style, ...props }: CardTitleProps) {
  return (
    <Text
      style={[
        {
          fontSize: 16,
          fontFamily: 'PlusJakartaSans-SemiBold',
          color: Colors.cardForeground,
          lineHeight: 22,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function CardDescription({ children, style, ...props }: CardTitleProps) {
  return (
    <Text
      style={[
        {
          fontSize: 13,
          fontFamily: 'PlusJakartaSans',
          color: Colors.mutedForeground,
          lineHeight: 18,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
