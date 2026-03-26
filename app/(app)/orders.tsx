import { useCallback, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { useAuthStore } from '@/stores/auth.store';
import { ordersApi } from '@/services/api';
import type { Order, OrderStatus, Business, Supplier } from '@/types';

const IN_PROGRESS: OrderStatus[] = ['accepted', 'delivering'];
const COMPLETED: OrderStatus[] = ['arrived', 'rejected'];
import { OrderCard } from '@/components/OrderCard';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardHeader } from '@/components/ui/Card';
import { Colors } from '@/constants/theme';

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
              <Skeleton
                width={64}
                height={14}
                borderRadius={6}
                style={{ marginTop: 6 }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ alignItems: 'flex-end' }}>
              <Skeleton width={72} height={18} borderRadius={6} />
              <Skeleton
                width={88}
                height={12}
                borderRadius={6}
                style={{ marginTop: 6 }}
              />
            </View>
            <Skeleton width={72} height={24} borderRadius={12} />
          </View>
        </View>
      </CardHeader>
    </Card>
  );
}

export default function OrdersScreen() {
  const role = useAuthStore(s => s.role);
  const platformId = useAuthStore(s => s.platformId);
  const profile = useAuthStore(s => s.profile) as Business | Supplier | null;

  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!platformId || !role) {
      setActiveOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (role === 'business') {
        const { data, error } = await ordersApi.getBusinessOrders(platformId);
        if (error) {
          Toast.show({ type: 'error', text1: 'Failed to load orders', text2: error });
          return;
        }
        if (data) setActiveOrders(data);
      } else {
        const { data, error } = await ordersApi.getSupplierOrders(platformId);
        if (error) {
          Toast.show({ type: 'error', text1: 'Failed to load orders', text2: error });
          return;
        }
        if (data) setActiveOrders(data);
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to load orders' });
    } finally {
      setLoading(false);
    }
  }, [platformId, role]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const pendingOrders = activeOrders.filter(o => o.status === 'pending');
  const inProgressOrders = activeOrders.filter(o => IN_PROGRESS.includes(o.status));
  const completedOrders = activeOrders.filter(o => COMPLETED.includes(o.status));

  const roleLabel =
    role === 'supplier'
      ? 'Manage orders from your customers'
      : 'Track your orders and their status';
  const subtitle =
    profile?.company_name != null && profile.company_name.length > 0
      ? `${roleLabel} · ${profile.company_name}`
      : roleLabel;

  if (!platformId || !role) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.background }}
        edges={['bottom']}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <PageHeader title="Orders" description={subtitle} />
          <EmptyState
            icon={<Package size={40} color={Colors.mutedForeground} />}
            title="Sign in required"
            description="Unable to load orders without an active account."
          />
        </View>
      </SafeAreaView>
    );
  }

  const renderOrderList = (list: Order[], emptyTitle: string, emptyDescription: string) => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
      keyboardShouldPersistTaps="handled"
    >
      {list.length === 0 ? (
        <EmptyState
          icon={<Package size={40} color={Colors.mutedForeground} />}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        list.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            role={role}
            onStatusUpdate={fetchOrders}
          />
        ))
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.background }}
      edges={['bottom']}
    >
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
        <PageHeader title="Orders" description={subtitle} />

        <Tabs defaultValue="all" style={{ flex: 1 }}>
          <TabsList scrollable style={{ marginBottom: 8 }}>
            <TabsTrigger value="all" style={{ flexGrow: 0, minWidth: 72 }}>
              {`All (${activeOrders.length})`}
            </TabsTrigger>
            <TabsTrigger value="pending" style={{ flexGrow: 0, minWidth: 88 }}>
              {`Pending (${pendingOrders.length})`}
            </TabsTrigger>
            <TabsTrigger value="in-progress" style={{ flexGrow: 0, minWidth: 100 }}>
              {`In Progress (${inProgressOrders.length})`}
            </TabsTrigger>
            <TabsTrigger value="completed" style={{ flexGrow: 0, minWidth: 104 }}>
              {`Completed (${completedOrders.length})`}
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <View style={{ gap: 12 }}>
              {[0, 1, 2].map(i => (
                <OrderSkeleton key={i} />
              ))}
            </View>
          ) : (
            <>
              <TabsContent value="all" style={{ flex: 1 }}>
                {renderOrderList(
                  activeOrders,
                  'No orders yet',
                  'Orders will appear here once they are placed',
                )}
              </TabsContent>
              <TabsContent value="pending" style={{ flex: 1 }}>
                {renderOrderList(
                  pendingOrders,
                  'No pending orders',
                  'Orders will appear here once they are placed',
                )}
              </TabsContent>
              <TabsContent value="in-progress" style={{ flex: 1 }}>
                {renderOrderList(
                  inProgressOrders,
                  'No orders in progress',
                  'Accepted and delivering orders show up here',
                )}
              </TabsContent>
              <TabsContent value="completed" style={{ flex: 1 }}>
                {renderOrderList(
                  completedOrders,
                  'No completed orders',
                  'Arrived or rejected orders appear here',
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
