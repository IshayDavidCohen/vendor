import { View, Text, Pressable, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShoppingBag,
  Truck,
  Check,
} from 'lucide-react-native';
import { Colors } from '@/constants/theme';

const BREAKPOINT = 768;
const BREAKPOINT_LG = 1024;

function CheckItem({ text, color }: { text: string; color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: color === 'purple' ? '#F5F3FF' : '#E1F5EE',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Check size={12} color={color === 'purple' ? Colors.primary : '#0F6E56'} />
      </View>
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'PlusJakartaSans',
          color: Colors.mutedForeground,
          lineHeight: 20,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

function CategoryCard({ emoji, name, count }: { emoji: string; name: string; count: string }) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 4 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'PlusJakartaSans-SemiBold',
          color: Colors.foreground,
          marginBottom: 2,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontFamily: 'PlusJakartaSans',
          color: Colors.mutedForeground,
        }}
      >
        {count}
      </Text>
    </View>
  );
}

function CatalogueItem({
  emoji,
  name,
  desc,
  price,
  bg,
}: {
  emoji: string;
  name: string;
  desc: string;
  price: string;
  bg: string;
}) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: Colors.border,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'PlusJakartaSans-SemiBold',
            color: Colors.foreground,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'PlusJakartaSans',
            color: Colors.mutedForeground,
            marginTop: 1,
          }}
        >
          {desc}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'PlusJakartaSans-SemiBold',
          color: Colors.primary,
        }}
      >
        {price}
      </Text>
    </View>
  );
}

export function ValueProps() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < BREAKPOINT;
  const isTablet = width >= BREAKPOINT && width < BREAKPOINT_LG;

  const webHover = Platform.OS === 'web' ? { cursor: 'pointer' as const } : {};

  return (
    <View
      style={{
        paddingVertical: isMobile ? 48 : 80,
        paddingHorizontal: isMobile ? 20 : 32,
      }}
    >
      <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center' }}>
        {/* Section heading */}
        <View style={{ alignItems: 'center', marginBottom: isMobile ? 36 : 56 }}>
          <Text
            style={{
              fontSize: isMobile ? 24 : 32,
              fontFamily: 'DMSans-Bold',
              color: Colors.foreground,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            One platform, two sides
          </Text>
          <Text
            style={{
              fontSize: isMobile ? 14 : 16,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
              textAlign: 'center',
            }}
          >
            Whether you buy or sell, Vendor works for you.
          </Text>
        </View>

        {/* FOR BUSINESSES */}
        <View
          style={{
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 24 : 40,
            marginBottom: isMobile ? 40 : 64,
            alignItems: 'center',
          }}
        >
          {/* Text side */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: '#F5F3FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBag size={18} color={Colors.primary} />
              </View>
              <Text
                style={{
                  fontSize: isMobile ? 20 : 22,
                  fontFamily: 'DMSans-Bold',
                  color: Colors.foreground,
                }}
              >
                For Businesses
              </Text>
            </View>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'PlusJakartaSans',
                color: Colors.mutedForeground,
                lineHeight: 24,
                marginBottom: 20,
              }}
            >
              Browse suppliers by category, send handshake requests, and place orders — all from one dashboard.
            </Text>
            <View style={{ gap: 10, marginBottom: 20 }}>
              <CheckItem text="Browse verified suppliers by category" color="purple" />
              <CheckItem text="Place and track orders in real time" color="purple" />
              <CheckItem text="Manage spend and supplier relationships" color="purple" />
            </View>
            <Pressable
              onPress={() => router.push('/(auth)/register?role=business')}
              style={webHover}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: Colors.primary,
                }}
              >
                Join as a Business →
              </Text>
            </Pressable>
          </View>

          {/* Category browser preview */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#F9FAFB',
              borderRadius: 16,
              padding: isMobile ? 14 : 20,
              borderWidth: 1,
              borderColor: Colors.border,
              maxWidth: isMobile ? '100%' : 480,
              width: '100%',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'PlusJakartaSans-SemiBold',
                color: Colors.mutedForeground,
                marginBottom: 12,
              }}
            >
              Browse categories
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {[
                { emoji: '🍷', name: 'Alcohol', count: '24 suppliers' },
                { emoji: '🥩', name: 'Meat', count: '18 suppliers' },
                { emoji: '🐟', name: 'Seafood', count: '15 suppliers' },
                { emoji: '🧀', name: 'Dairy', count: '21 suppliers' },
                { emoji: '🥬', name: 'Produce', count: '19 suppliers' },
                { emoji: '🍞', name: 'Bakery', count: '12 suppliers' },
              ].map(cat => (
                <View key={cat.name} style={{ width: '48%', flexGrow: 1 }}>
                  <CategoryCard {...cat} />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: Colors.border, marginBottom: isMobile ? 40 : 64 }} />

        {/* FOR SUPPLIERS */}
        <View
          style={{
            flexDirection: isMobile ? 'column-reverse' : 'row',
            gap: isMobile ? 24 : 40,
            alignItems: 'center',
          }}
        >
          {/* Catalogue preview */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#F9FAFB',
              borderRadius: 16,
              padding: isMobile ? 14 : 20,
              borderWidth: 1,
              borderColor: Colors.border,
              maxWidth: isMobile ? '100%' : 480,
              width: '100%',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'PlusJakartaSans-SemiBold',
                color: Colors.mutedForeground,
                marginBottom: 12,
              }}
            >
              Your catalogue
            </Text>
            <View style={{ gap: 8 }}>
              <CatalogueItem emoji="🍾" name="Champagne Brut NV" desc="750ml · Case of 6" price="$89" bg="#FEF3C7" />
              <CatalogueItem emoji="🍇" name="Pinot Noir Reserve" desc="750ml · Case of 12" price="$62" bg="#F5F3FF" />
              <CatalogueItem emoji="🫒" name="Extra Virgin Olive Oil" desc="1L · Single bottle" price="$24" bg="#E1F5EE" />
              <CatalogueItem emoji="🧈" name="Artisan Butter" desc="250g · Pack of 10" price="$38" bg="#FEF3C7" />
            </View>
          </View>

          {/* Text side */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: '#E1F5EE',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Truck size={18} color="#0F6E56" />
              </View>
              <Text
                style={{
                  fontSize: isMobile ? 20 : 22,
                  fontFamily: 'DMSans-Bold',
                  color: Colors.foreground,
                }}
              >
                For Suppliers
              </Text>
            </View>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'PlusJakartaSans',
                color: Colors.mutedForeground,
                lineHeight: 24,
                marginBottom: 20,
              }}
            >
              List your products, set your own prices, and let businesses come to you.
            </Text>
            <View style={{ gap: 10, marginBottom: 20 }}>
              <CheckItem text="Manage your full product catalogue" color="teal" />
              <CheckItem text="Accept handshakes and receive orders" color="teal" />
              <CheckItem text="Track revenue and fulfilment history" color="teal" />
            </View>
            <Pressable
              onPress={() => router.push('/(auth)/register?role=supplier')}
              style={webHover}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: '#0F6E56',
                }}
              >
                Join as a Supplier →
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
