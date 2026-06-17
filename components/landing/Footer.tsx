import { View, Text, Pressable, Platform, useWindowDimensions } from 'react-native';
import { Store } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

const BREAKPOINT = 768;

export function Footer() {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAKPOINT;

  const webHover = Platform.OS === 'web' ? { cursor: 'pointer' as const } : {};

  const links = [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingVertical: isMobile ? 24 : 28,
        paddingHorizontal: isMobile ? 20 : 32,
      }}
    >
      <View
        style={{
          maxWidth: 1200,
          width: '100%',
          alignSelf: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: isMobile ? 16 : 0,
        }}
      >
        {/* Logo + copyright */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              backgroundColor: Colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Store size={11} color="#FFFFFF" />
          </View>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
            }}
          >
            © 2026 Vendor. All rights reserved.
          </Text>
        </View>

        {/* Links */}
        <View style={{ flexDirection: 'row', gap: 24 }}>
          {links.map(link => (
            <Pressable key={link.label} style={webHover}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans-Medium',
                  color: Colors.mutedForeground,
                }}
              >
                {link.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
