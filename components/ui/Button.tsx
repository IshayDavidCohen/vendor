import { forwardRef } from 'react';
import {
  Platform,
  Pressable,
  Text,
  type PressableProps,
  type ViewStyle,
  type TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/theme';

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm';

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { backgroundColor: Colors.primary },
    text: { color: Colors.primaryForeground },
  },
  destructive: {
    container: { backgroundColor: Colors.destructive },
    text: { color: '#FFFFFF' },
  },
  outline: {
    container: {
      backgroundColor: Colors.background,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    text: { color: Colors.foreground },
  },
  secondary: {
    container: { backgroundColor: Colors.secondary },
    text: { color: Colors.secondaryForeground },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: Colors.foreground },
  },
  link: {
    container: { backgroundColor: 'transparent' },
    text: { color: Colors.primary, textDecorationLine: 'underline' },
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { height: 36, paddingHorizontal: 16, paddingVertical: 8 },
    text: { fontSize: 14 },
  },
  sm: {
    container: { height: 32, paddingHorizontal: 12 },
    text: { fontSize: 13 },
  },
  lg: {
    container: { height: 44, paddingHorizontal: 24 },
    text: { fontSize: 16 },
  },
  icon: {
    container: { height: 36, width: 36, paddingHorizontal: 0 },
    text: { fontSize: 14 },
  },
  'icon-sm': {
    container: { height: 32, width: 32, paddingHorizontal: 0 },
    text: { fontSize: 13 },
  },
};

export const Button = forwardRef<any, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      children,
      disabled,
      loading,
      style,
      ...props
    },
    ref,
  ) => {
    const vStyle = variantStyles[variant];
    const sStyle = sizeStyles[size];

    return (
      <Pressable
        ref={ref}
        disabled={disabled || loading}
        style={({ pressed }) => [
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            gap: 8,
            opacity: disabled || loading ? 0.5 : pressed ? 0.8 : 1,
            ...(Platform.OS === 'web'
              ? ({ cursor: disabled || loading ? 'not-allowed' : 'pointer' } as any)
              : {}),
          },
          vStyle.container,
          sStyle.container,
          typeof style === 'function' ? style({ pressed }) : style,
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={vStyle.text.color as string}
          />
        ) : typeof children === 'string' ? (
          <Text
            style={[
              {
                fontFamily: 'PlusJakartaSans-SemiBold',
                textAlign: 'center',
              },
              vStyle.text,
              sStyle.text,
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  },
);

Button.displayName = 'Button';
