import { useState } from 'react';
import { View, Text, Pressable, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Store, Menu, X } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

const BREAKPOINT = 768;

interface NavbarProps {
  onScrollTo?: (section: string) => void;
}

export function Navbar({ onScrollTo }: NavbarProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < BREAKPOINT;
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'For Businesses', section: 'businesses' },
    { label: 'For Suppliers', section: 'suppliers' },
    { label: 'How It Works', section: 'how-it-works' },
  ];

  const handleNav = (section: string) => {
    setMenuOpen(false);
    onScrollTo?.(section);
  };

  const webHover = Platform.OS === 'web'
    ? { cursor: 'pointer' as const }
    : {};

  return (
    <View
      style={{
        position: Platform.OS === 'web' ? ('sticky' as any) : 'relative',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255,255,255,0.92)',
        ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } as any : {}),
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
      }}
    >
      <View
        style={{
          maxWidth: 1200,
          width: '100%',
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: isMobile ? 20 : 32,
          paddingVertical: 14,
        }}
      >
        {/* Logo */}
        <Pressable
          onPress={() => router.replace('/')}
          style={[{ flexDirection: 'row', alignItems: 'center', gap: 10 }, webHover]}
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: Colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Store size={18} color="#FFFFFF" />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'DMSans-Bold',
              color: Colors.foreground,
            }}
          >
            Vendor
          </Text>
        </Pressable>

        {/* Desktop nav links */}
        {!isMobile && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 32 }}>
            {navLinks.map(link => (
              <Pressable
                key={link.section}
                onPress={() => handleNav(link.section)}
                style={webHover}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSans-Medium',
                    color: Colors.mutedForeground,
                  }}
                >
                  {link.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Desktop CTAs */}
        {!isMobile && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              style={[
                {
                  paddingHorizontal: 18,
                  paddingVertical: 9,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: Colors.border,
                },
                webHover,
              ]}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans-Medium',
                  color: Colors.foreground,
                }}
              >
                Sign In
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/(auth)/register')}
              style={[
                {
                  paddingHorizontal: 18,
                  paddingVertical: 9,
                  borderRadius: 8,
                  backgroundColor: Colors.primary,
                },
                webHover,
              ]}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: '#FFFFFF',
                }}
              >
                Get Started
              </Text>
            </Pressable>
          </View>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <Pressable onPress={() => setMenuOpen(prev => !prev)} style={webHover}>
            {menuOpen ? (
              <X size={24} color={Colors.foreground} />
            ) : (
              <Menu size={24} color={Colors.foreground} />
            )}
          </Pressable>
        )}
      </View>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
            paddingHorizontal: 20,
            paddingBottom: 20,
            gap: 6,
          }}
        >
          {navLinks.map(link => (
            <Pressable
              key={link.section}
              onPress={() => handleNav(link.section)}
              style={[
                {
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border,
                },
                webHover,
              ]}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'PlusJakartaSans-Medium',
                  color: Colors.foreground,
                }}
              >
                {link.label}
              </Text>
            </Pressable>
          ))}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                router.push('/(auth)/login');
              }}
              style={[
                {
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: Colors.border,
                  alignItems: 'center',
                },
                webHover,
              ]}
            >
              <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans-Medium', color: Colors.foreground }}>
                Sign In
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                router.push('/(auth)/register');
              }}
              style={[
                {
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: Colors.primary,
                  alignItems: 'center',
                },
                webHover,
              ]}
            >
              <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans-SemiBold', color: '#FFFFFF' }}>
                Get Started
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
