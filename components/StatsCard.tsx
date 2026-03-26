import { View, Text } from 'react-native';
import { Card, CardContent } from '@/components/ui/Card';
import { Colors } from '@/constants/theme';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

export function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent style={{ padding: 16 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: `${Colors.primary}18`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </View>
        <View style={{ marginTop: 12 }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'DMSans-Bold',
              color: Colors.foreground,
            }}
          >
            {value}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'PlusJakartaSans-Medium',
              color: Colors.foreground,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
            }}
          >
            {description}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}
