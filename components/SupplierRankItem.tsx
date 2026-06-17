// components/SupplierRankItem.tsx
import { View, Text, Pressable } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Colors } from '@/constants/theme';

interface SupplierRankItemProps {
  /** Image URL for the company logo. Falls back to initials when absent. */
  iconUrl?: string | null;
  /** Full display name — used for both label and initials fallback. */
  name: string;
  subtitle: string;
  value: string;
  onPress?: () => void;
}

export function SupplierRankItem({
  iconUrl,
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
      <Avatar src={iconUrl} fallback={name} size={34} />
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
          numberOfLines={1}
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