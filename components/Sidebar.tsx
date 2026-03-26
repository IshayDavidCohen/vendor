import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import {
  LayoutDashboard,
  Grid3x3,
  ShoppingCart,
  Handshake as HandshakeIcon,
  User,
  Package,
  ClipboardList,
  Store,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useAuthStore } from '@/stores/auth.store';
import { Colors } from '@/constants/theme';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const businessNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/(app)/dashboard', icon: LayoutDashboard },
  { title: 'Browse', href: '/(app)/categories', icon: Grid3x3 },
  { title: 'Orders', href: '/(app)/orders', icon: ShoppingCart },
  { title: 'Handshakes', href: '/(app)/handshakes', icon: HandshakeIcon },
  { title: 'Profile', href: '/(app)/profile', icon: User },
];

const supplierNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/(app)/dashboard', icon: LayoutDashboard },
  { title: 'Items', href: '/(app)/items', icon: Package },
  { title: 'Orders', href: '/(app)/orders', icon: ClipboardList },
  { title: 'Handshakes', href: '/(app)/handshakes', icon: HandshakeIcon },
  { title: 'Profile', href: '/(app)/profile', icon: User },
];

const SIDEBAR_WIDTH = 240;

export function Sidebar() {
  const role = useAuthStore(s => s.role);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = role === 'supplier' ? supplierNavItems : businessNavItems;

  return (
    <View
      style={{
        width: SIDEBAR_WIDTH,
        backgroundColor: Colors.card,
        borderRightWidth: 1,
        borderRightColor: Colors.border,
        paddingTop: 16,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 20,
          paddingBottom: 24,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Store size={20} color={Colors.primaryForeground} />
        </View>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'DMSans-Bold',
            color: Colors.foreground,
          }}
        >
          Vendor
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href as any)}
              style={({ hovered }: any) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginHorizontal: 8,
                borderRadius: 8,
                backgroundColor: isActive
                  ? `${Colors.primary}12`
                  : hovered
                    ? Colors.muted
                    : 'transparent',
                ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
              })}
            >
              <Icon
                size={20}
                color={isActive ? Colors.primary : Colors.mutedForeground}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: isActive
                    ? 'PlusJakartaSans-SemiBold'
                    : 'PlusJakartaSans-Medium',
                  color: isActive ? Colors.primary : Colors.foreground,
                }}
              >
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export { SIDEBAR_WIDTH };
