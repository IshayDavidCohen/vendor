import { View, Text, Pressable, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShoppingCart,
  Users,
  DollarSign,
} from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';

const BREAKPOINT = 768;

interface HeroSectionProps {
  onScrollTo?: (section: string) => void;
}

export function HeroSection({ onScrollTo }: HeroSectionProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < BREAKPOINT;

  const webHover = Platform.OS === 'web'
    ? { cursor: 'pointer' as const }
    : {};

  return (
    <View style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background blobs */}
      <View
        style={{
          position: 'absolute',
          top: -80,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: 200,
          backgroundColor: '#F5F3FF',
          opacity: 0.6,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 120,
          left: -80,
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: '#E1F5EE',
          opacity: 0.4,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          right: 60,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: '#FEF3C7',
          opacity: 0.3,
        }}
      />

      {/* Hero content */}
      <View
        style={{
          maxWidth: 1200,
          width: '100%',
          alignSelf: 'center',
          paddingHorizontal: isMobile ? 20 : 32,
          paddingTop: isMobile ? 48 : 72,
          paddingBottom: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Centered text */}
        <View style={{ alignItems: 'center', maxWidth: 640, alignSelf: 'center' }}>
          <View
            style={{
              backgroundColor: '#F5F3FF',
              paddingHorizontal: 14,
              paddingVertical: 5,
              borderRadius: 20,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'PlusJakartaSans-SemiBold',
                color: Colors.primary,
              }}
            >
              B2B marketplace for modern teams
            </Text>
          </View>

          <Text
            style={{
              fontSize: isMobile ? 32 : 48,
              fontFamily: 'DMSans-Bold',
              color: Colors.foreground,
              textAlign: 'center',
              lineHeight: isMobile ? 40 : 56,
              marginBottom: 16,
            }}
          >
            The smarter way to source, order, and grow.
          </Text>

          <Text
            style={{
              fontSize: isMobile ? 15 : 17,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
              textAlign: 'center',
              lineHeight: isMobile ? 24 : 28,
              maxWidth: 520,
              marginBottom: 28,
            }}
          >
            Vendor connects businesses with trusted suppliers — discover catalogues, manage orders, and build lasting partnerships, all in one place.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginBottom: isMobile ? 36 : 48,
            }}
          >
            <Pressable
              onPress={() => router.push('/(auth)/register')}
              style={[
                {
                  paddingHorizontal: 24,
                  paddingVertical: 13,
                  borderRadius: 10,
                  backgroundColor: Colors.primary,
                },
                webHover,
              ]}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: '#FFFFFF',
                }}
              >
                Get Started Free
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onScrollTo?.('how-it-works')}
              style={[
                {
                  paddingHorizontal: 24,
                  paddingVertical: 13,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: Colors.border,
                  backgroundColor: '#FFFFFF',
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
                See How It Works
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Product preview — mock dashboard */}
        <View
          style={{
            maxWidth: 900,
            width: '100%',
            alignSelf: 'center',
            backgroundColor: '#F9FAFB',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderWidth: 1,
            borderBottomWidth: 0,
            borderColor: Colors.border,
            padding: isMobile ? 12 : 20,
            ...(Platform.OS === 'web'
              ? {
                  transform: 'perspective(1200px) rotateX(2deg)',
                  transformOrigin: 'bottom center',
                  boxShadow: '0 -4px 40px rgba(124, 58, 237, 0.06)',
                } as any
              : {}),
          }}
        >
          {/* Mock top bar */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginBottom: 14,
            }}
          >
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                backgroundColor: Colors.primary,
              }}
            />
            <View style={{ width: 60, height: 8, borderRadius: 4, backgroundColor: Colors.border }} />
            <View style={{ flex: 1 }} />
            <View style={{ width: 40, height: 8, borderRadius: 4, backgroundColor: Colors.border }} />
            <View style={{ width: 40, height: 8, borderRadius: 4, backgroundColor: Colors.border }} />
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: Colors.border,
              }}
            />
          </View>

          {/* Stat cards */}
          <View style={{ flexDirection: 'row', gap: isMobile ? 8 : 10, marginBottom: isMobile ? 10 : 14 }}>
            {[
              {
                icon: ShoppingCart,
                iconBg: '#F5F3FF',
                iconColor: Colors.primary,
                label: 'Active orders',
                value: '12',
                sub: '+3 this week',
                subColor: '#059669',
              },
              {
                icon: Users,
                iconBg: '#E1F5EE',
                iconColor: '#0F6E56',
                label: 'My suppliers',
                value: '8',
                sub: '2 pending',
                subColor: Colors.mutedForeground,
              },
              {
                icon: DollarSign,
                iconBg: '#FEF3C7',
                iconColor: '#92400E',
                label: 'Spend this month',
                value: '$8,240',
                sub: '-12% vs last',
                subColor: '#059669',
              },
            ].map((stat, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  padding: isMobile ? 10 : 14,
                  borderWidth: 1,
                  borderColor: Colors.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      backgroundColor: stat.iconBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <stat.icon size={11} color={stat.iconColor} />
                  </View>
                  <Text
                    style={{
                      fontSize: isMobile ? 10 : 11,
                      fontFamily: 'PlusJakartaSans',
                      color: Colors.mutedForeground,
                    }}
                  >
                    {stat.label}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: isMobile ? 20 : 24,
                    fontFamily: 'DMSans-Bold',
                    color: i === 0 ? Colors.primary : Colors.foreground,
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: 'PlusJakartaSans-Medium',
                    color: stat.subColor,
                    marginTop: 2,
                  }}
                >
                  {stat.sub}
                </Text>
              </View>
            ))}
          </View>

          {/* Chart + orders row */}
          <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 14 }}>
            {/* Area chart */}
            <View
              style={{
                flex: 1.2,
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: isMobile ? 12 : 16,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: Colors.foreground,
                  marginBottom: 2,
                }}
              >
                Order volume
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.mutedForeground,
                  marginBottom: 12,
                }}
              >
                Last 6 months
              </Text>
              {/* SVG chart placeholder using View bars */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 60 }}>
                {[40, 55, 68, 52, 80, 95].map((h, i) => (
                  <View
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      backgroundColor: i === 5 ? Colors.primary : '#EDE9FE',
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                    }}
                  />
                ))}
              </View>
              <View style={{ flexDirection: 'row', marginTop: 6, gap: 4 }}>
                {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map(m => (
                  <Text
                    key={m}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 9,
                      fontFamily: 'PlusJakartaSans',
                      color: Colors.mutedForeground,
                    }}
                  >
                    {m}
                  </Text>
                ))}
              </View>
            </View>

            {/* Recent orders */}
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: isMobile ? 12 : 16,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: Colors.foreground,
                  marginBottom: 12,
                }}
              >
                Recent orders
              </Text>
              {[
                { initials: 'PW', name: 'Premium Wines', amount: '$1,240', status: 'Accepted', bg: '#D1FAE5', fg: '#059669', ibg: '#F5F3FF', ifc: Colors.primary },
                { initials: 'OF', name: 'Ocean Fresh', amount: '$890', status: 'Delivering', bg: '#FEF3C7', fg: '#92400E', ibg: '#E1F5EE', ifc: '#0F6E56' },
                { initials: 'GH', name: 'Golden Harvest', amount: '$2,100', status: 'Pending', bg: '#F3E8FF', fg: Colors.primary, ibg: '#FEF3C7', ifc: '#92400E' },
              ].map((order, i) => (
                <View key={i}>
                  {i > 0 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: Colors.border,
                        marginVertical: 8,
                      }}
                    />
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        backgroundColor: order.ibg,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: 'PlusJakartaSans-SemiBold',
                          color: order.ifc,
                        }}
                      >
                        {order.initials}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'PlusJakartaSans-SemiBold',
                          color: Colors.foreground,
                        }}
                      >
                        {order.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: 'PlusJakartaSans',
                          color: Colors.mutedForeground,
                          marginTop: 1,
                        }}
                      >
                        {order.amount}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 6,
                        backgroundColor: order.bg,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: 'PlusJakartaSans-SemiBold',
                          color: order.fg,
                        }}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
