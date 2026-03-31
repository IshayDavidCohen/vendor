import { View, Text } from 'react-native';
import { Colors } from '@/constants/theme';

interface SpendCategoryBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  currency?: string;
}

export function SpendCategoryBar({
  label,
  value,
  maxValue,
  color,
  currency = '$',
}: SpendCategoryBarProps) {
  const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          width: 72,
          fontSize: 12,
          fontFamily: 'PlusJakartaSans-SemiBold',
          color: Colors.foreground,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
      <View
        style={{
          flex: 1,
          height: 8,
          backgroundColor: Colors.muted,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 4,
          }}
        />
      </View>
      <Text
        style={{
          width: 60,
          textAlign: 'right',
          fontSize: 12,
          fontFamily: 'PlusJakartaSans-SemiBold',
          color: Colors.mutedForeground,
        }}
      >
        {currency}{value.toLocaleString()}
      </Text>
    </View>
  );
}
