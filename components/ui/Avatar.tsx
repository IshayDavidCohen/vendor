import { View, Text, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';

interface AvatarProps {
  src?: string | null;
  fallback?: string;
  size?: number;
  style?: ViewStyle;
}

export function Avatar({ src, fallback, size = 32, style }: AvatarProps) {
  const initials = fallback
    ? fallback
        .split(' ')
        .map(w => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '?';

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          backgroundColor: Colors.muted,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          style={{ width: size, height: size }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <Text
          style={{
            fontSize: size * 0.4,
            fontFamily: 'PlusJakartaSans-SemiBold',
            color: Colors.mutedForeground,
          }}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}
