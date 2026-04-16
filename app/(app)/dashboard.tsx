import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  type ViewStyle,
  type ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShoppingCart,
  Users,
  Handshake,
  Package,
  DollarSign,
  ClipboardList,
} from 'lucide-react-native';
import { useAuthStore } from '@/stores/auth.store';
import { ordersApi, handshakeApi } from '@/services/api';
import type { Business, Supplier, Order, Handshake as HandshakeType } from '@/types';
import { getSupplierById, getBusinessById } from '@/mocks/data';
import { StatsCard } from '@/components/StatsCard';
import { OrderCard } from '@/components/OrderCard';
import { OrderPipeline } from '@/components/OrderPipeline';
import { SpendCategoryBar } from '@/components/SpendCategoryBar';
import { SpendTrendChart } from '@/components/SpendTrendChart';
import { SupplierRankItem } from '@/components/SupplierRankItem';
import { HandshakeActivityItem } from '@/components/HandshakeActivityItem';
import { SectionHeader } from '@/components/SectionHeader';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { ActionCard } from '@/components/ActionCard';
import { Spinner } from '@/components/Spinner';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Colors, Spacing } from '@/constants/theme';

import { useCounterparties } from '@/hooks/useCounterparties';

const STAT_CARD_WIDTH = 260;
const OrderCardCount = 4; // Number of OrderCards to show in the recent orders section on the dashboard

// ─── Category colors ─────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  'cat-alcohol': '#7C3AED',
  'cat-meat': '#EF4444',
  'cat-seafood': '#3B82F6',
  'cat-dairy': '#10B981',
  'cat-produce': '#F59E0B',
  'cat-bakery': '#F97316',
  'cat-beverages': '#06B6D4',
  'cat-frozen': '#8B5CF6',
};

const ITEM_COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#F97316'];

// ─── Mock monthly spend/revenue data (derived from orders in production) ─────
const BUSINESS_MONTHLY_SPEND = [
  { label: 'Sep', value: 3200 },
  { label: 'Oct', value: 4100 },
  { label: 'Nov', value: 5800 },
  { label: 'Dec', value: 4500 },
  { label: 'Jan', value: 8069 },
];

const SUPPLIER_MONTHLY_REVENUE = [
  { label: 'Sep', value: 2800 },
  { label: 'Oct', value: 3200 },
  { label: 'Nov', value: 4600 },
  { label: 'Dec', value: 3900 },
  { label: 'Jan', value: 5640 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function ListDivider() {
  return <View style={{ height: 1, backgroundColor: Colors.border }} />;
}

function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <CardContent style={{ gap: Spacing.md }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={44} borderRadius={10} />
      ))}
    </CardContent>
  );
}

function TwoColumnRow({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: Spacing.md,
          marginTop: Spacing.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// BUSINESS DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════

function BusinessDashboard({ profile }: { profile: Business }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [handshakes, setHandshakes] = useState<HandshakeType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [ordersRes, hsRes] = await Promise.all([
      ordersApi.getBusinessOrders(profile.id),
      handshakeApi.getUserHandshakes('business', profile.id),
    ]);
    if (ordersRes.data) setOrders(ordersRes.data);
    if (hsRes.data) setHandshakes(hsRes.data);
    setLoading(false);
  }, [profile.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeOrders = useMemo(
    () => orders.filter(o => o.status !== 'arrived' && o.status !== 'rejected'),
    [orders],
  );

  const totalActiveValue = useMemo(
    () => activeOrders.reduce((sum, o) => sum + o.total_price, 0),
    [activeOrders],
  );

  const activeOrdersCount = activeOrders.length ?? 0;
  const suppliersCount = useMemo(
    () => new Set(orders.map(o => o.supplier_id)).size,
    [orders],
  );
  const pendingHandshakes = useMemo(
    () => handshakes.filter(h => h.status === 'pending').length,
    [handshakes],
  );

  const supplierSpend = useMemo(() => {
    const map: Record<string, number> = {};
    for (const order of orders) {
      map[order.supplier_id] = (map[order.supplier_id] ?? 0) + order.total_price;
    }
    return Object.entries(map)
      .map(([id, spend]) => {
        const sup = getSupplierById(id);
        return {
          id,
          name: sup?.company_name ?? id,
          icon: sup?.icon ?? null,
          category: sup?.categories?.[0] ?? '',
          spend,
        };
      })
      .sort((a, b) => b.spend - a.spend);
  }, [orders]);

  const categorySpend = useMemo(() => {
    const map: Record<string, { label: string; value: number }> = {};
    for (const order of orders) {
      const sup = getSupplierById(order.supplier_id);
      const cat = sup?.categories?.[0] ?? 'other';
      const label = cat.replace('cat-', '').replace(/^\w/, c => c.toUpperCase());
      if (!map[cat]) map[cat] = { label, value: 0 };
      map[cat].value += order.total_price;
    }
    return Object.entries(map)
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => b.value - a.value);
  }, [orders]);

  const maxCategorySpend = categorySpend[0]?.value ?? 1;

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, OrderCardCount),
    [orders],
  );

  const recentHandshakes = useMemo(
    () =>
      handshakes
        .filter(h => h.status === 'pending')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4),
    [handshakes],
  );

  const counterparties = useCounterparties(recentOrders, 'business');

  const renderOrder: ListRenderItem<Order> = ({ item }) => (
    <View style={{ marginBottom: Spacing.md }}>
      <OrderCard
        order={item}
        role="business"
        counterparty={counterparties[item.id]}
        onStatusUpdate={fetchData}
      />
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

        {/* ── Stat cards ────────────────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: Spacing.md, paddingBottom: Spacing.lg }}
        >
          <View style={{ width: STAT_CARD_WIDTH }}>
            <StatsCard
              title="Active Orders"
              value={activeOrdersCount}
              description={`$${totalActiveValue.toLocaleString()} total value`}
              icon={<ShoppingCart size={24} color={Colors.primary} />}
              trend={
                activeOrdersCount > 0
                  ? { label: `${activeOrdersCount} in progress`, direction: 'up' }
                  : undefined
              }
            />
          </View>
          <View style={{ width: STAT_CARD_WIDTH }}>
            <StatsCard
              title="Connected Suppliers"
              value={suppliersCount}
              description={`Across ${profile.categories?.length ?? 0} categories`}
              icon={<Users size={24} color="#3B82F6" />}
              iconBg="#EFF6FF"
            />
          </View>
          <View style={{ width: STAT_CARD_WIDTH }}>
            <StatsCard
              title="Pending Handshakes"
              value={pendingHandshakes}
              description="Awaiting response"
              icon={<Handshake size={24} color="#F59E0B" />}
              iconBg="#FFFBEB"
            />
          </View>
        </ScrollView>

        {/* ── Monthly spend chart + Order pipeline ──────────────────────── */}
        <TwoColumnRow style={{ marginTop: 0 }}>
          <View style={{ flex: 1.15 }}>
            <Card style={{ flex: 1 }}>
              <SectionHeader title="Monthly spend" />
              <CardContent>
                {loading ? (
                  <Skeleton height={160} borderRadius={10} />
                ) : (
                  <SpendTrendChart
                    data={BUSINESS_MONTHLY_SPEND}
                    color={Colors.primary}
                    currency="$"
                  />
                )}
              </CardContent>
            </Card>
          </View>
          <View style={{ flex: 1 }}>
            <Card style={{ flex: 1 }}>
              <SectionHeader title="Order pipeline" />
              <CardContent>
                {loading ? (
                  <Skeleton height={64} borderRadius={10} />
                ) : (
                  <OrderPipeline orders={orders} role="business" />
                )}
              </CardContent>
            </Card>
          </View>
        </TwoColumnRow>

        {/* ── Spend by category (full width) ────────────────────────────── */}
        <View style={{ marginTop: Spacing.lg }}>
          <Card>
            <SectionHeader title="Spend by category" />
            <CardContent>
              {loading ? (
                <CardSkeleton rows={4} />
              ) : categorySpend.length === 0 ? (
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'PlusJakartaSans',
                    color: Colors.mutedForeground,
                    textAlign: 'center',
                    paddingVertical: 12,
                  }}
                >
                  No order data yet
                </Text>
              ) : (
                categorySpend.map((cat, i) => (
                  <SpendCategoryBar
                    key={cat.key}
                    label={cat.label}
                    value={cat.value}
                    maxValue={maxCategorySpend}
                    color={CATEGORY_COLORS[cat.key] ?? ITEM_COLORS[i % ITEM_COLORS.length]}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </View>

        {/* ── Recent orders (full OrderCard with progress bar) ───────────── */}
        <View style={{ marginTop: Spacing.lg }}>
          <Card>
            <SectionHeader
              title="Recent orders"
              description="Your latest order activity"
              actionLabel="View all"
              onAction={() => router.push('/(app)/orders')}
            />
            {loading ? (
              <CardContent style={{ gap: Spacing.md }}>
                <Skeleton height={64} borderRadius={10} />
                <Skeleton height={64} borderRadius={10} />
                <Skeleton height={64} borderRadius={10} />
              </CardContent>
            ) : recentOrders.length === 0 ? (
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
                data={recentOrders}
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
        </View>

        {/* ── Handshake activity (full width) ───────────────────────────── */}
        <View style={{ marginTop: Spacing.lg }}>
          <Card>
            <SectionHeader
              title="Handshake activity"
              actionLabel="Manage"
              onAction={() => router.push('/(app)/handshakes')}
            />
            <CardContent>
              {loading ? (
                <CardSkeleton rows={3} />
              ) : recentHandshakes.length === 0 ? (
                <EmptyState
                  icon={<Handshake size={30} color={Colors.mutedForeground} />}
                  title="All clear"
                  description="No pending requests"
                />
              ) : (
                recentHandshakes.map((hs, i) => (
                  <View key={hs.id}>
                    {i > 0 && <ListDivider />}
                    <HandshakeActivityItem
                      handshake={hs}
                      platformId={profile.id}
                    />
                  </View>
                ))
              )}
            </CardContent>
          </Card>
        </View>

        {/* ── Top suppliers (full width) ────────────────────────────────── */}
        <View style={{ marginTop: Spacing.lg }}>
          <Card>
            <SectionHeader
              title="Top suppliers"
              actionLabel="Browse"
              onAction={() => router.push('/(app)/categories')}
            />
            <CardContent>
              {loading ? (
                <CardSkeleton rows={4} />
              ) : supplierSpend.length === 0 ? (
                <EmptyState
                  icon={<Users size={30} color={Colors.mutedForeground} />}
                  title="No suppliers"
                  description="Connect with suppliers to get started"
                />
              ) : (
                supplierSpend.slice(0, 5).map((sup, i) => (
                  <View key={sup.id}>
                    {i > 0 && <ListDivider />}
                    <SupplierRankItem
                      iconUrl={sup.icon}
                      name={sup.name}
                      subtitle={sup.category.replace('cat-', '').replace(/^\w/, c => c.toUpperCase())}
                      value={`$${sup.spend.toLocaleString()}`}
                    />
                  </View>
                ))
              )}
            </CardContent>
          </Card>
        </View>

        {/* ── Quick actions ──────────────────────────────────────────────── */}
        <View style={{ marginTop: Spacing.lg, gap: Spacing.md }}>
          <ActionCard
            icon={<Users size={24} color={Colors.primary} />}
            title="Browse Suppliers"
            description="Find new suppliers"
            onPress={() => router.push('/(app)/categories')}
          />
          <ActionCard
            icon={<ShoppingCart size={24} color={Colors.primary} />}
            title="View Orders"
            description="Track your orders"
            onPress={() => router.push('/(app)/orders')}
          />
          <ActionCard
            icon={<Handshake size={24} color={Colors.primary} />}
            title="Manage Handshakes"
            description="Connection requests"
            onPress={() => router.push('/(app)/handshakes')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUPPLIER DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════

function SupplierDashboard({ profile }: { profile: Supplier }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [handshakes, setHandshakes] = useState<HandshakeType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [ordersRes, hsRes] = await Promise.all([
      ordersApi.getSupplierOrders(profile.id),
      handshakeApi.getUserHandshakes('supplier', profile.id),
    ]);
    if (ordersRes.data) setOrders(ordersRes.data);
    if (hsRes.data) setHandshakes(hsRes.data);
    setLoading(false);
  }, [profile.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const itemsCount = profile.items?.length ?? 0; // TODO: needs to come from API when we have item management in place
  const activeOrders = useMemo(
    () => orders.filter(o => o.status !== 'arrived' && o.status !== 'rejected'),
    [orders],
  );
  const activeOrdersCount = activeOrders.length;


  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + o.total_price, 0),
    [orders],
  );

  const itemRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    for (const order of orders) {
      for (const oi of order.ordered_items) {
        map[oi.item_id] = (map[oi.item_id] ?? 0) + oi.total_price_for_item;
      }
    }
    return Object.entries(map)
      .map(([id, revenue]) => ({
        id,
        label: id.replace('item-', '').replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()),
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, OrderCardCount);
  }, [orders]);

  const maxItemRevenue = itemRevenue[0]?.revenue ?? 1;

  const businessRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    for (const order of orders) {
      map[order.business_id] = (map[order.business_id] ?? 0) + order.total_price;
    }
    return Object.entries(map)
      .map(([id, revenue]) => {
        const biz = getBusinessById(id);
        return {
          id,
          name: biz?.company_name ?? id,
          icon: biz?.icon ?? null,
          desc: biz?.desc?.slice(0, 30) ?? '',
          revenue,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, OrderCardCount),
    [orders],
  );

  const recentHandshakes = useMemo(
    () =>
      handshakes
        .filter(h => h.status === 'pending')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4),
    [handshakes],
  );

  const counterparties = useCounterparties(recentOrders, 'supplier');

  const renderOrder: ListRenderItem<Order> = ({ item }) => (
    <View style={{ marginBottom: Spacing.md }}>
      <OrderCard
        order={item}
        role="supplier"
        counterparty={counterparties[item.id]}
        onStatusUpdate={fetchData}
      />
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

        {/* ── Stat cards ────────────────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: Spacing.md, paddingBottom: Spacing.lg }}
        >
          <View style={{ width: STAT_CARD_WIDTH }}>
            <StatsCard
              title="Total Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              description={`From ${orders.length} orders`}
              icon={<DollarSign size={24} color="#10B981" />}
              iconBg="#ECFDF5"
              trend={
                totalRevenue > 0
                  ? { label: `${orders.length} orders`, direction: 'up' }
                  : undefined
              }
            />
          </View>
          <View style={{ width: STAT_CARD_WIDTH }}>
            <StatsCard
              title="Active Orders"
              value={activeOrdersCount}
              description="Orders to fulfill"
              icon={<ClipboardList size={24} color={Colors.primary} />}
            />
          </View>
          <View style={{ width: STAT_CARD_WIDTH }}>
            <StatsCard
              title="Catalogue Items"
              value={itemsCount}
              description="In your catalogue"
              icon={<Package size={24} color="#3B82F6" />}
              iconBg="#EFF6FF"
            />
          </View>
        </ScrollView>

        {/* ── Revenue trend chart + Fulfillment status ──────────────────── */}
        <TwoColumnRow style={{ marginTop: 0 }}>
          <View style={{ flex: 1.15 }}>
            <Card style={{ flex: 1 }}>
              <SectionHeader title="Revenue trend" />
              <CardContent>
                {loading ? (
                  <Skeleton height={160} borderRadius={10} />
                ) : (
                  <SpendTrendChart
                    data={SUPPLIER_MONTHLY_REVENUE}
                    color="#10B981"
                    currency="$"
                  />
                )}
              </CardContent>
            </Card>
          </View>
          <View style={{ flex: 1 }}>
            <Card style={{ flex: 1 }}>
              <SectionHeader title="Fulfillment status" />
              <CardContent>
                {loading ? (
                  <Skeleton height={64} borderRadius={10} />
                ) : (
                  <OrderPipeline orders={orders} role="supplier" />
                )}
              </CardContent>
            </Card>
          </View>
        </TwoColumnRow>

        {/* ── Top items by revenue (full width) ─────────────────────────── */}
        <View style={{ marginTop: Spacing.lg }}>
          <Card>
            <SectionHeader title="Top items by revenue" />
            <CardContent>
              {loading ? (
                <CardSkeleton rows={4} />
              ) : itemRevenue.length === 0 ? (
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'PlusJakartaSans',
                    color: Colors.mutedForeground,
                    textAlign: 'center',
                    paddingVertical: 12,
                  }}
                >
                  No sales data yet
                </Text>
              ) : (
                itemRevenue.map((item, i) => (
                  <SpendCategoryBar
                    key={item.id}
                    label={item.label}
                    value={item.revenue}
                    maxValue={maxItemRevenue}
                    color={ITEM_COLORS[i % ITEM_COLORS.length]}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </View>

        {/* ── Incoming orders (full OrderCard with progress bar) ─────────── */}
        <View style={{ marginTop: Spacing.lg }}>
          <Card>
            <SectionHeader
              title="Incoming orders"
              description="Orders from your customers"
              actionLabel="View all"
              onAction={() => router.push('/(app)/orders')}
            />
            {loading ? (
              <CardContent style={{ gap: Spacing.md }}>
                <Skeleton height={64} borderRadius={10} />
                <Skeleton height={64} borderRadius={10} />
                <Skeleton height={64} borderRadius={10} />
              </CardContent>
            ) : recentOrders.length === 0 ? (
              <CardContent>
                <EmptyState
                  icon={<Package size={36} color={Colors.mutedForeground} />}
                  title="No orders yet"
                  description="Orders from businesses will appear here"
                />
              </CardContent>
            ) : (
              <FlatList
                data={recentOrders}
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
        </View>

        {/* ── Connected businesses (full width) */}
        <View style={{ marginTop: Spacing.lg }}>
          <Card>
            <SectionHeader
              title="Connected businesses"
              actionLabel="View all"
              onAction={() => router.push('/(app)/handshakes')}
            />
            <CardContent>
              {loading ? (
                <CardSkeleton rows={3} />
              ) : businessRevenue.length === 0 ? (
                <EmptyState
                  icon={<Users size={30} color={Colors.mutedForeground} />}
                  title="No businesses yet"
                  description="Businesses will appear once connected"
                />
              ) : (
                businessRevenue.map((biz, i) => (
                  <View key={biz.id}>
                    {i > 0 && <ListDivider />}
                    <SupplierRankItem
                      iconUrl={biz.icon}
                      name={biz.name}
                      subtitle={`${biz.desc}…`}
                      value={`$${biz.revenue.toLocaleString()}`}
                    />
                  </View>
                ))
              )}
            </CardContent>
          </Card>
        </View>

        {/* ── Business requests (full width) */}
        <View style={{ marginTop: Spacing.lg }}>
          <Card>
            <SectionHeader
              title="Business requests"
              actionLabel="Manage"
              onAction={() => router.push('/(app)/handshakes')}
            />
            <CardContent>
              {loading ? (
                <CardSkeleton rows={3} />
              ) : recentHandshakes.length === 0 ? (
                <EmptyState
                  icon={<Handshake size={30} color={Colors.mutedForeground} />}
                  title="All clear"
                  description="No pending requests"
                />
              ) : (
                recentHandshakes.map((hs, i) => (
                  <View key={hs.id}>
                    {i > 0 && <ListDivider />}
                    <HandshakeActivityItem
                      handshake={hs}
                      platformId={profile.id}
                    />
                  </View>
                ))
              )}
            </CardContent>
          </Card>
        </View>

        {/* ── Quick actions ──────────────────────────────────────────────── */}
        <View style={{ marginTop: Spacing.lg, gap: Spacing.md }}>
          <ActionCard
            icon={<Package size={24} color={Colors.primary} />}
            title="Manage Items"
            description="Edit your catalogue"
            onPress={() => router.push('/(app)/items')}
          />
          <ActionCard
            icon={<ShoppingCart size={24} color={Colors.primary} />}
            title="View Orders"
            description="Manage incoming orders"
            onPress={() => router.push('/(app)/orders')}
          />
          <ActionCard
            icon={<Handshake size={24} color={Colors.primary} />}
            title="Manage Handshakes"
            description="Business requests"
            onPress={() => router.push('/(app)/handshakes')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SCREEN ENTRY
// ═════════════════════════════════════════════════════════════════════════════

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
