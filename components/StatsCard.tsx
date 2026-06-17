import { View, Text } from 'react-native';
import { Card, CardContent } from '@/components/ui/Card';
import { Colors } from '@/constants/theme';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: {
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

const trendColors = {
  up: { bg: '#ECFDF5', text: '#065F46' },
  down: { bg: '#FEF2F2', text: '#991B1B' },
  neutral: { bg: '#F3F4F6', text: '#4B5563' },
};

export function StatsCard({ title, value, description, icon, iconBg, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: iconBg ?? `${Colors.primary}18`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </View>
          {trend && (
            <View
              style={{
                backgroundColor: trendColors[trend.direction].bg,
                borderRadius: 100,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: trendColors[trend.direction].text,
                }}
              >
                {trend.label}
              </Text>
            </View>
          )}
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
