import { forwardRef } from 'react';
import {
  Platform,
  TextInput,
  View,
  Text,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/theme';

const webInputStyle = Platform.OS === 'web'
  ? ({ outlineStyle: 'none' } as any)
  : {};

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, style, ...props }, ref) => {
    return (
      <View style={containerStyle}>
        {label && (
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'PlusJakartaSans-Medium',
              color: Colors.foreground,
              marginBottom: 6,
            }}
          >
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          placeholderTextColor={Colors.mutedForeground}
          style={[
            {
              height: 40,
              borderWidth: 1,
              borderColor: error ? Colors.destructive : Colors.input,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              fontFamily: 'PlusJakartaSans',
              color: Colors.foreground,
              backgroundColor: Colors.background,
              ...webInputStyle,
            },
            style,
          ]}
          {...props}
        />
        {error && (
          <Text
            style={{
              fontSize: 12,
              color: Colors.destructive,
              marginTop: 4,
              fontFamily: 'PlusJakartaSans',
            }}
          >
            {error}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';

interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const TextArea = forwardRef<TextInput, TextAreaProps>(
  ({ label, error, containerStyle, style, ...props }, ref) => {
    return (
      <View style={containerStyle}>
        {label && (
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'PlusJakartaSans-Medium',
              color: Colors.foreground,
              marginBottom: 6,
            }}
          >
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          multiline
          textAlignVertical="top"
          placeholderTextColor={Colors.mutedForeground}
          style={[
            {
              minHeight: 80,
              borderWidth: 1,
              borderColor: error ? Colors.destructive : Colors.input,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 14,
              fontFamily: 'PlusJakartaSans',
              color: Colors.foreground,
              backgroundColor: Colors.background,
              ...webInputStyle,
            },
            style,
          ]}
          {...props}
        />
        {error && (
          <Text
            style={{
              fontSize: 12,
              color: Colors.destructive,
              marginTop: 4,
              fontFamily: 'PlusJakartaSans',
            }}
          >
            {error}
          </Text>
        )}
      </View>
    );
  },
);

TextArea.displayName = 'TextArea';
