import { View, Text, type ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

type Status =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'delivering'
  | 'arrived'
  | 'acknowledged';

interface StatusBadgeProps {
  status: Status;
  style?: ViewStyle;
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const colors = Colors.statusBadge[status] ?? Colors.statusBadge.pending;
  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: colors.bg,
          borderRadius: 100,
          paddingHorizontal: 10,
          paddingVertical: 3,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'PlusJakartaSans-Medium',
          color: colors.text,
          textTransform: 'capitalize',
        }}
      >
        {status}
      </Text>
    </View>
  );
}
