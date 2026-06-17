import { View, Text } from 'react-native';
import { Colors } from '@/constants/theme';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: Colors.muted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          fontSize: 17,
          fontFamily: 'PlusJakartaSans-SemiBold',
          color: Colors.foreground,
          marginTop: 8,
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
            textAlign: 'center',
            paddingHorizontal: 32,
          }}
        >
          {description}
        </Text>
      )}
      {action && <View style={{ marginTop: 8 }}>{action}</View>}
    </View>
  );
}
