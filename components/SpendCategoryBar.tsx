import { useState, useCallback } from 'react';
import { View, Text, type LayoutChangeEvent } from 'react-native';
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
  const [trackWidth, setTrackWidth] = useState(0);

  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  }, []);

  const ratio = maxValue > 0 ? value / maxValue : 0;
  // Compute fill width in absolute pixels (works on iOS and web)
  const fillWidth = trackWidth > 0 ? Math.max(4, Math.round(trackWidth * ratio)) : 0;

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
        onLayout={onTrackLayout}
        style={{
          flex: 1,
          height: 8,
          backgroundColor: Colors.muted,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {fillWidth > 0 && (
          <View
            style={{
              width: fillWidth,
              height: 8,
              backgroundColor: color,
              borderRadius: 4,
            }}
          />
        )}
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
