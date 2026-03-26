import { View, Text, type ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function PageHeader({ title, description, children, style }: PageHeaderProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 20,
          gap: 16,
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: 'DMSans-Bold',
            color: Colors.foreground,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
              marginTop: 4,
            }}
          >
            {description}
          </Text>
        )}
      </View>
      {children && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {children}
        </View>
      )}
    </View>
  );
}
