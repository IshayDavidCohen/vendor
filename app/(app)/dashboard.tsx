import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  type ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShoppingCart,
  Users,
  Handshake,
  Package,
  ArrowRight,
} from 'lucide-react-native';
import { useAuthStore } from '@/stores/auth.store';
import { ordersApi } from '@/services/api';
import type { Business, Supplier, Order } from '@/types';
import { StatsCard } from '@/components/StatsCard';
import { OrderCard } from '@/components/OrderCard';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/Spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Colors, Spacing } from '@/constants/theme';

const STAT_CARD_WIDTH = 260;

function BusinessDashboard({ profile }: { profile: Business }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await ordersApi.getBusinessOrders(profile.id);
    if (data) setOrders(data);
    setLoading(false);
  }, [profile.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const activeOrdersCount = profile.active_orders?.length ?? 0;
  const suppliersCount = profile.my_suppliers?.length ?? 0;
  const pendingHandshakes = profile.handshake_requests?.length ?? 0;
  const recent = orders.slice(0, 5);

  const renderOrder: ListRenderItem<Order> = ({ item }) => (
    <View style={{ marginBottom: Spacing.md }}>
      <OrderCard order={item} role="business" onStatusUpdate={fetchOrders} compact />
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingBottom: Spacing['3xl'] }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: Spacing.lg }}>
        <PageHeader
          title={`Welcome back, ${profile.company_name}`}
          description="Here's an overview of your business activity"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: Spacing.md, paddingBottom: Spacing.lg }}
        >
          <View style={{ width: STAT_CARD_WIDTH }}>
            <StatsCard
              title="Active Orders"
              value={activeOrdersCount}
              description="Orders in progress"
              icon={<ShoppingCart size={24} color={Colors.primary} />}
            />
          </View>
          <View style={{ width: STAT_CARD_WIDTH }}>
            <StatsCard
              title="Connected Suppliers"
              value={suppliersCount}
              description="Your supplier network"
              icon={<Users size={24} color={Colors.primary} />}
            />
          </View>
          <View style={{ width: STAT_CARD_WIDTH }}>
            <StatsCard
              title="Pending Handshakes"
              value={pendingHandshakes}
              description="Awaiting response"
              icon={<Handshake size={24} color={Colors.primary} />}
            />
          </View>
        </ScrollView>

        <Card>
          <CardHeader
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flex: 1 }}>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest order activity</CardDescription>
            </View>
            <Button variant="ghost" size="sm" onPress={() => router.push('/(app)/orders')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text
                  style={{
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    fontSize: 13,
                    color: Colors.foreground,
                  }}
                >
                  View all
                </Text>
                <ArrowRight size={16} color={Colors.foreground} />
              </View>
            </Button>
          </CardHeader>
          {loading ? (
            <CardContent style={{ gap: Spacing.md }}>
              <Skeleton height={64} borderRadius={10} />
              <Skeleton height={64} borderRadius={10} />
              <Skeleton height={64} borderRadius={10} />
            </CardContent>
          ) : orders.length === 0 ? (
            <CardContent>
              <EmptyState
                icon={<ShoppingCart size={36} color={Colors.mutedForeground} />}
                title="No orders yet"
                description="Browse suppliers to place your first order"
                action={
                  <Button onPress={() => router.push('/(app)/categories')}>
                    Browse Suppliers
                  </Button>
                }
              />
            </CardContent>
          ) : (
            <FlatList
              data={recent}
              keyExtractor={item => item.id}
              renderItem={renderOrder}
              scrollEnabled={false}
              nestedScrollEnabled
              contentContainerStyle={{
                paddingHorizontal: Spacing.lg,
                paddingBottom: Spacing.lg,
              }}
            />
          )}
        </Card>

        <View style={{ marginTop: Spacing.lg, gap: Spacing.md }}>
          <Pressable onPress={() => router.push('/(app)/categories')}>
            <Card>
              <CardContent style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
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
                  <Users size={24} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      fontSize: 15,
                      color: Colors.foreground,
                    }}
                  >
                    Browse Suppliers
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans',
                      fontSize: 13,
                      color: Colors.mutedForeground,
                      marginTop: 2,
                    }}
                  >
                    Find new suppliers
                  </Text>
                </View>
              </CardContent>
            </Card>
          </Pressable>

          <Pressable onPress={() => router.push('/(app)/orders')}>
            <Card>
              <CardContent style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
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
                  <ShoppingCart size={24} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      fontSize: 15,
                      color: Colors.foreground,
                    }}
                  >
                    View Orders
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans',
                      fontSize: 13,
                      color: Colors.mutedForeground,
                      marginTop: 2,
                    }}
                  >
                    Track your orders
                  </Text>
                </View>
              </CardContent>
            </Card>
          </Pressable>

          <Pressable onPress={() => router.push('/(app)/handshakes')}>
            <Card>
              <CardContent style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
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
                  <Handshake size={24} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      fontSize: 15,
                      color: Colors.foreground,
                    }}
                  >
                    Manage Handshakes
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans',
                      fontSize: 13,
                      color: Colors.mutedForeground,
                      marginTop: 2,
                    }}
                  >
                    Connection requests
                  </Text>
                </View>
              </CardContent>
            </Card>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function SupplierDashboard({ profile }: { profile: Supplier }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await ordersApi.getSupplierOrders(profile.id);
    if (data) setOrders(data);
    setLoading(false);
  }, [profile.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const activeOrdersCount = profile.active_orders?.length ?? 0;
  const itemsCount = profile.items?.length ?? 0;
  const pendingHandshakes = profile.handshake_requests?.length ?? 0;
  const recent = orders.slice(0, 5);

  const renderOrder: ListRenderItem<Order> = ({ item }) => (
    <View style={{ marginBottom: Spacing.md }}>
      <OrderCard order={item} role="supplier" onStatusUpdate={fetchOrders} compact />
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingBottom: Spacing['3xl'] }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: Spacing.lg }}>
        <PageHeader
          title={`Welcome back, ${profile.company_name}`}
          description="Here's an overview of your supplier activity"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: Spacing.md, paddingBottom: Spacing.lg }}
        >
          <View style={{ width: STAT_CARD_WIDTH }}>
            <StatsCard
              title="Active Orders"
              value={activeOrdersCount}
              description="Orders to fulfill"
              icon={<ShoppingCart size={24} color={Colors.primary} />}
            />
          </View>
          <View style={{ width: STAT_CARD_WIDTH }}>
            <StatsCard
              title="Total Items"
              value={itemsCount}
              description="In your catalogue"
              icon={<Package size={24} color={Colors.primary} />}
            />
          </View>
          <View style={{ width: STAT_CARD_WIDTH }}>
            <StatsCard
              title="Pending Requests"
              value={pendingHandshakes}
              description="Business requests"
              icon={<Handshake size={24} color={Colors.primary} />}
            />
          </View>
        </ScrollView>

        <Card>
          <CardHeader
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flex: 1 }}>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Orders from your customers</CardDescription>
            </View>
            <Button variant="ghost" size="sm" onPress={() => router.push('/(app)/orders')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text
                  style={{
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    fontSize: 13,
                    color: Colors.foreground,
                  }}
                >
                  View all
                </Text>
                <ArrowRight size={16} color={Colors.foreground} />
              </View>
            </Button>
          </CardHeader>
          {loading ? (
            <CardContent style={{ gap: Spacing.md }}>
              <Skeleton height={64} borderRadius={10} />
              <Skeleton height={64} borderRadius={10} />
              <Skeleton height={64} borderRadius={10} />
            </CardContent>
          ) : orders.length === 0 ? (
            <CardContent>
              <EmptyState
                icon={<Package size={36} color={Colors.mutedForeground} />}
                title="No orders yet"
                description="Orders from businesses will appear here"
              />
            </CardContent>
          ) : (
            <FlatList
              data={recent}
              keyExtractor={item => item.id}
              renderItem={renderOrder}
              scrollEnabled={false}
              nestedScrollEnabled
              contentContainerStyle={{
                paddingHorizontal: Spacing.lg,
                paddingBottom: Spacing.lg,
              }}
            />
          )}
        </Card>

        <View style={{ marginTop: Spacing.lg, gap: Spacing.md }}>
          <Pressable onPress={() => router.push('/(app)/items')}>
            <Card>
              <CardContent style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
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
                  <Package size={24} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      fontSize: 15,
                      color: Colors.foreground,
                    }}
                  >
                    Manage Items
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans',
                      fontSize: 13,
                      color: Colors.mutedForeground,
                      marginTop: 2,
                    }}
                  >
                    Edit your catalogue
                  </Text>
                </View>
              </CardContent>
            </Card>
          </Pressable>

          <Pressable onPress={() => router.push('/(app)/orders')}>
            <Card>
              <CardContent style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
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
                  <ShoppingCart size={24} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      fontSize: 15,
                      color: Colors.foreground,
                    }}
                  >
                    View Orders
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans',
                      fontSize: 13,
                      color: Colors.mutedForeground,
                      marginTop: 2,
                    }}
                  >
                    Manage incoming orders
                  </Text>
                </View>
              </CardContent>
            </Card>
          </Pressable>

          <Pressable onPress={() => router.push('/(app)/handshakes')}>
            <Card>
              <CardContent style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
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
                  <Handshake size={24} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      fontSize: 15,
                      color: Colors.foreground,
                    }}
                  >
                    Manage Handshakes
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'PlusJakartaSans',
                      fontSize: 13,
                      color: Colors.mutedForeground,
                      marginTop: 2,
                    }}
                  >
                    Business requests
                  </Text>
                </View>
              </CardContent>
            </Card>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

export default function DashboardScreen() {
  const profile = useAuthStore(s => s.profile);
  const role = useAuthStore(s => s.role);

  if (!profile) {
    return <Spinner fullScreen />;
  }

  if (role === 'supplier') {
    return <SupplierDashboard profile={profile as Supplier} />;
  }

  return <BusinessDashboard profile={profile as Business} />;
}
