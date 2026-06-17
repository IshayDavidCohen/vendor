import { View, Text, Pressable } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  description,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
      }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'PlusJakartaSans-SemiBold',
            color: Colors.cardForeground,
            lineHeight: 22,
          }}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
              lineHeight: 18,
            }}
          >
            {description}
          </Text>
        )}
      </View>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
        >
          <Text
            style={{
              fontFamily: 'PlusJakartaSans-SemiBold',
              fontSize: 13,
              color: Colors.foreground,
            }}
          >
            {actionLabel}
          </Text>
          <ArrowRight size={16} color={Colors.foreground} />
        </Pressable>
      )}
    </View>
  );
}
