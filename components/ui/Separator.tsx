import { View, type ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

export function Separator({ orientation = 'horizontal', style }: SeparatorProps) {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.border,
          ...(orientation === 'horizontal'
            ? { height: 1, width: '100%' }
            : { width: 1, height: '100%' }),
        },
        style,
      ]}
    />
  );
}
