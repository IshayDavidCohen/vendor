import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import {
  View,
  Text,
  Pressable,
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

export function ActionCard({
  icon,
  title,
  description,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card>
        <CardContent
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            paddingTop: Spacing.lg,
            paddingBottom: Spacing.lg,
          }}
        >
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

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'PlusJakartaSans-SemiBold',
                fontSize: 15,
                color: Colors.foreground,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontFamily: 'PlusJakartaSans',
                fontSize: 13,
                color: Colors.mutedForeground,
                marginTop: 2,
              }}
            >
              {description}
            </Text>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}