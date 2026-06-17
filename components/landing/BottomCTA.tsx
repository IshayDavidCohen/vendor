import { View, Text, Pressable, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

const BREAKPOINT = 768;

export function BottomCTA() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < BREAKPOINT;

  const webHover = Platform.OS === 'web' ? { cursor: 'pointer' as const } : {};

  return (
    <View
      style={{
        backgroundColor: Colors.primary,
        paddingVertical: isMobile ? 56 : 80,
        paddingHorizontal: isMobile ? 20 : 32,
      }}
    >
      <View
        style={{
          maxWidth: 640,
          width: '100%',
          alignSelf: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: isMobile ? 24 : 32,
            fontFamily: 'DMSans-Bold',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          Ready to streamline your supply chain?
        </Text>
        <Text
          style={{
            fontSize: isMobile ? 15 : 17,
            fontFamily: 'PlusJakartaSans',
            color: 'rgba(255,255,255,0.75)',
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          Join Vendor today — it's free to get started.
        </Text>
        <View
          style={{
            flexDirection: isMobile ? 'column' : 'row',
            gap: 12,
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <Pressable
            onPress={() => router.push('/(auth)/register')}
            style={[
              {
                paddingHorizontal: 28,
                paddingVertical: 14,
                borderRadius: 10,
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
              },
              webHover,
            ]}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'PlusJakartaSans-SemiBold',
                color: Colors.primary,
              }}
            >
              Get Started Free
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              // Placeholder for future sales contact flow
            }}
            style={[
              {
                paddingHorizontal: 28,
                paddingVertical: 14,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.4)',
                alignItems: 'center',
              },
              webHover,
            ]}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'PlusJakartaSans-Medium',
                color: '#FFFFFF',
              }}
            >
              Talk to Sales
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
