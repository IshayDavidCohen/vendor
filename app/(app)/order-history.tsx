import { useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package } from 'lucide-react-native';

import { useAuthStore } from '@/stores/auth.store';
import type { Order, Business, Supplier } from '@/types';

import { Button } from "@/components/ui/Button";
import { OrderCard } from '@/components/OrderCard';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardHeader } from '@/components/ui/Card';
import { Colors } from '@/constants/theme';
import { useCounterparties } from '@/hooks/useCounterparties';
import { usePaginatedOrderHistory } from '@/hooks/usePaginatedOrderHistory';

function OrderSkeleton() {
  return (
    <Card>
      <CardHeader style={{ paddingBottom: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Skeleton width={40} height={40} borderRadius={10} />
            <View>
              <Skeleton width={96} height={18} borderRadius={6} />
              <Skeleton width={64} height={14} borderRadius={6} style={{ marginTop: 6 }} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ alignItems: 'flex-end' }}>
              <Skeleton width={72} height={18} borderRadius={6} />
              <Skeleton width={88} height={12} borderRadius={6} style={{ marginTop: 6 }} />
            </View>
            <Skeleton width={72} height={24} borderRadius={12} />
          </View>
        </View>
      </CardHeader>
    </Card>
  );
}

export default function OrderHistoryScreen() {
  const role = useAuthStore(s => s.role);
  const platformId = useAuthStore(s => s.platformId);
  const profile = useAuthStore(s => s.profile) as Business | Supplier | null;

  const { orders, loading, refreshing, hasMore, total, loadMore, refresh } =
    usePaginatedOrderHistory(role ?? null, platformId);

  const counterparties = useCounterparties(
    orders,
    role === 'supplier' ? 'supplier' : 'business',
  );

  const roleLabel =
    role === 'supplier'
      ? 'Full history of orders from your customers'
      : 'Full history of your past orders';
  const subtitle =
    profile?.company_name != null && profile.company_name.length > 0
      ? `${roleLabel} · ${profile.company_name}`
      : roleLabel;

  const renderItem = useCallback(
    ({ item }: { item: Order }) => (
      <View style={{ marginBottom: 12 }}>
        <OrderCard
          order={item}
          role={role!}
          counterparty={counterparties[item.id]}
        />
      </View>
    ),
    [role, counterparties],
  );

  if (!platformId || !role) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['bottom']}>
        <View style={{ flex: 1, padding: 16 }}>
          <PageHeader title="Order History" description={subtitle} />
          <EmptyState
            icon={<Package size={40} color={Colors.mutedForeground} />}
            title="Sign in required"
            description="Unable to load order history without an active account."
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['bottom']}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
        <PageHeader title="Order History" description={subtitle} />

        {!loading && orders.length > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <RNText style={{ fontSize: 13, fontFamily: 'PlusJakartaSans-Medium', color: Colors.mutedForeground }}>
            {`Showing ${orders.length} of ${total} orders`}
            </RNText>
        </View>
        )}

        {loading && orders.length === 0 ? (
          <View style={{ gap: 12 }}>
            {[0, 1, 2].map(i => (
              <OrderSkeleton key={i} />
            ))}
          </View>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<Package size={40} color={Colors.mutedForeground} />}
            title="No archived orders"
            description="Older orders will appear here over time."
          />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={o => o.id}
            renderItem={renderItem}
            onEndReached={loadMore}
            onEndReachedThreshold={0.4}
            refreshing={refreshing}
            onRefresh={refresh}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
            hasMore ? (
                <View style={{ alignItems: 'center', paddingVertical: 16, gap: 8 }}>
                <ActivityIndicator color={Colors.primary} />
                <Button variant="outline" size="sm" onPress={loadMore}>
                    {'Load more orders'}
                </Button>
                </View>
            ) : orders.length > 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                <RNText style={{ fontSize: 13, fontFamily: 'PlusJakartaSans', color: Colors.mutedForeground }}>
                    No more orders to load
                </RNText>
                </View>
            ) : null
            }
            removeClippedSubviews
            initialNumToRender={10}
            windowSize={7}
          />
        )}
      </View>
    </SafeAreaView>
  );
}