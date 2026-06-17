import { ActivityIndicator, View, type ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  fullScreen?: boolean;
}

export function Spinner({
  size = 'small',
  color = Colors.primary,
  style,
  fullScreen,
}: SpinnerProps) {
  if (fullScreen) {
    return (
      <View
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.background,
          },
          style,
        ]}
      >
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }
  return <ActivityIndicator size={size} color={color} style={style} />;
}
