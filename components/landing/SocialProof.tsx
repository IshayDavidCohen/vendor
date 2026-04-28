import { View, Text, useWindowDimensions } from 'react-native';
import { Star } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

const BREAKPOINT = 768;

const AVATAR_COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export function SocialProof() {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAKPOINT;

  return (
    <View
      style={{
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.border,
        paddingVertical: 20,
        paddingHorizontal: isMobile ? 20 : 32,
      }}
    >
      <View
        style={{
          maxWidth: 1200,
          width: '100%',
          alignSelf: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? 16 : 32,
        }}
      >
        {/* Avatar stack + text */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            {AVATAR_COLORS.map((color, i) => (
              <View
                key={i}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: color,
                  borderWidth: 2,
                  borderColor: '#F9FAFB',
                  marginLeft: i > 0 ? -8 : 0,
                  zIndex: AVATAR_COLORS.length - i,
                }}
              />
            ))}
          </View>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans-Medium',
              color: Colors.mutedForeground,
            }}
          >
            500+ businesses onboarded
          </Text>
        </View>

        {/* Divider */}
        {!isMobile && (
          <View
            style={{
              width: 1,
              height: 20,
              backgroundColor: Colors.border,
            }}
          />
        )}

        {/* Star rating */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />
            ))}
          </View>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans-Medium',
              color: Colors.mutedForeground,
            }}
          >
            Rated 4.9 by suppliers
          </Text>
        </View>

        {!isMobile && (
          <View
            style={{
              width: 1,
              height: 20,
              backgroundColor: Colors.border,
            }}
          />
        )}

        {/* Orders processed */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              backgroundColor: '#E1F5EE',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 12 }}>📦</Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans-Medium',
              color: Colors.mutedForeground,
            }}
          >
            10,000+ orders processed
          </Text>
        </View>
      </View>
    </View>
  );
}
