import { useState } from 'react';
import { Pressable, View, Text, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import {
  LayoutDashboard,
  Grid3x3,
  ShoppingCart,
  Handshake,
  User,
  Package,
  ClipboardList,
} from 'lucide-react-native';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { useResponsive } from '@/hooks/useResponsive';
import { CartSheet } from '@/components/CartSheet';
import { Sidebar } from '@/components/Sidebar';
import { Colors } from '@/constants/theme';

function CartBadge({ onPress }: { onPress: () => void }) {
  const items = useCartStore(s => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  
  return (
    <Pressable
      onPress={onPress}
      style={{
        marginRight: 16,
        position: 'relative',
        ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
      }}
    >
      <ShoppingCart size={22} color={Colors.foreground} />
      {cartCount > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -6,
            right: -8,
            backgroundColor: Colors.primary,
            borderRadius: 10,
            minWidth: 18,
            height: 18,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={{
              color: Colors.primaryForeground,
              fontSize: 10,
              fontFamily: 'PlusJakartaSans-Bold',
            }}
          >
            {cartCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default function AppLayout() {
  const role = useAuthStore(s => s.role);
  const { isWideWeb } = useResponsive();
  const [cartVisible, setCartVisible] = useState(false);

  return (
    <>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {isWideWeb && <Sidebar />}
        <View style={{ flex: 1 }}>

          {isWideWeb && role === 'business' && (
            <View style={{ position: 'absolute', top: 16, right: 24, zIndex: 10 }}>
              <CartBadge onPress={() => setCartVisible(true)} />
            </View>
          )}

          <Tabs
            screenOptions={{
              headerStyle: { backgroundColor: Colors.background },
              headerTitleStyle: {
                fontFamily: 'DMSans-Bold',
                color: Colors.foreground,
                fontSize: 18,
              },
              headerShadowVisible: false,
              headerShown: !isWideWeb,
              headerRight: () =>
                role === 'business' ? (
                  <CartBadge onPress={() => setCartVisible(true)} />
                ) : null,
              tabBarActiveTintColor: Colors.primary,
              tabBarInactiveTintColor: Colors.mutedForeground,
              tabBarStyle: isWideWeb
                ? { display: 'none' }
                : {
                    backgroundColor: Colors.background,
                    borderTopColor: Colors.border,
                  },
              tabBarLabelStyle: {
                fontFamily: 'PlusJakartaSans-Medium',
                fontSize: 11,
              },
            }}
          >
            <Tabs.Screen
              name="dashboard"
              options={{
                title: 'Dashboard',
                tabBarIcon: ({ color, size }) => (
                  <LayoutDashboard size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="categories"
              options={{
                title: 'Browse',
                href: role === 'supplier' ? null : undefined,
                tabBarIcon: ({ color, size }) => (
                  <Grid3x3 size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="orders"
              options={{
                title: 'Orders',
                tabBarIcon: ({ color, size }) =>
                  role === 'supplier' ? (
                    <ClipboardList size={size} color={color} />
                  ) : (
                    <ShoppingCart size={size} color={color} />
                  ),
              }}
            />
            <Tabs.Screen
              name="handshakes"
              options={{
                title: 'Handshakes',
                tabBarIcon: ({ color, size }) => (
                  <Handshake size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="items"
              options={{
                title: 'Items',
                href: role === 'business' ? null : undefined,
                tabBarIcon: ({ color, size }) => (
                  <Package size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                  <User size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="supplier"
              options={{ href: null, headerShown: false }}
            />
            <Tabs.Screen
              name="cart"
              options={{ href: null, headerShown: false }}
            />
          </Tabs>
        </View>
      </View>
      <CartSheet visible={cartVisible} onClose={() => setCartVisible(false)} />
    </>
  );
}
