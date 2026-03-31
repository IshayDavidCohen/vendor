import { View, Text, Pressable } from 'react-native';
import { Colors } from '@/constants/theme';

interface SupplierRankItemProps {
  initials: string;
  name: string;
  subtitle: string;
  value: string;
  onPress?: () => void;
}

export function SupplierRankItem({
  initials,
  name,
  subtitle,
  value,
  onPress,
}: SupplierRankItemProps) {
  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          backgroundColor: `${Colors.primary}18`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'PlusJakartaSans-Bold',
            color: Colors.primary,
          }}
        >
          {initials}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'PlusJakartaSans-SemiBold',
            color: Colors.foreground,
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'PlusJakartaSans',
            color: Colors.mutedForeground,
          }}
        >
          {subtitle}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 13,
          fontFamily: 'DMSans-Bold',
          color: Colors.foreground,
        }}
      >
        {value}
      </Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}
