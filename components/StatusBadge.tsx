import { View, Text, type ViewStyle } from 'react-native';

type Status =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'delivering'
  | 'arrived'
  | 'acknowledged';

const statusStyles: Record<Status, { bg: string; text: string }> = {
  pending: { bg: '#F3E8FF', text: '#7C3AED' },
  accepted: { bg: '#D1FAE5', text: '#059669' },
  rejected: { bg: '#FEE2E2', text: '#DC2626' },
  delivering: { bg: '#DBEAFE', text: '#2563EB' },
  arrived: { bg: '#D1FAE5', text: '#059669' },
  acknowledged: { bg: '#F3F4F6', text: '#4B5563' },
};

interface StatusBadgeProps {
  status: Status;
  style?: ViewStyle;
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const colors = statusStyles[status] ?? statusStyles.pending;

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
