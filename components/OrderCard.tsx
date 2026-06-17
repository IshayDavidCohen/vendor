// components/OrderCard.tsx
import { useState, useCallback } from 'react';
import { View, Text, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Image } from 'expo-image';
import {
  Package,
  Clock,
  ChevronDown,
  Check,
  X,
  Truck,
  Archive,
  RefreshCw,
  Store,
  Building2,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { OrderProgressBar } from '@/components/OrderProgressBar';
import { ordersApi, itemsApi } from '@/services/api';
import { useCartStore } from '@/stores/cart.store';
import { Colors } from '@/constants/theme';
import type { Order, OrderStatus } from '@/types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

export interface OrderCardCounterparty {
  name: string;
  icon?: string;
}

interface OrderCardProps {
  order: Order;
  role: 'business' | 'supplier';
  /**
   * The other side of the order.
   * - When `role === 'business'`, this is the supplier.
   * - When `role === 'supplier'`, this is the business.
   *
   * Parent is responsible for resolving this (see `useCounterparties`).
   */
  counterparty?: OrderCardCounterparty;
  onStatusUpdate?: () => void;
  compact?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function OrderCard({
  order,
  role,
  counterparty,
  onStatusUpdate,
  compact,
}: OrderCardProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const addItem = useCartStore(s => s.addItem);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const cartItems = useCartStore(s => s.items);

  const toggle = useCallback(() => {
    if (compact) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(prev => !prev);
  }, [compact]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setLoading(true);
    try {
      const { error } = await ordersApi.updateStatus(order.id, newStatus);
      if (error) {
        Toast.show({ type: 'error', text1: 'Failed to update status', text2: error });
        return;
      }
      Toast.show({ type: 'success', text1: `Order marked as ${newStatus}` });
      onStatusUpdate?.();
    } catch {
      Toast.show({ type: 'error', text1: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    setLoading(true);
    try {
      const { error } = await ordersApi.archive(order.id);
      if (error) {
        Toast.show({ type: 'error', text1: 'Failed to archive', text2: error });
        return;
      }
      Toast.show({ type: 'success', text1: 'Order archived' });
      onStatusUpdate?.();
    } catch {
      Toast.show({ type: 'error', text1: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAgain = async () => {
    setLoading(true);
    try {
      let anyAdded = false;
      for (const orderedItem of order.ordered_items) {
        const { data: freshItem } = await itemsApi.get(orderedItem.item_id);
        if (freshItem) {
          const alreadyInCart = cartItems.find(c => c.item.id === freshItem.id);
          if (alreadyInCart) {
            updateQuantity(freshItem.id, orderedItem.quantity);
          } else {
            addItem(freshItem, order.supplier_id, order.supplier_id, orderedItem.quantity);
          }
          anyAdded = true;
        }
      }
      if (anyAdded) {
        Toast.show({ type: 'success', text1: 'Items added to cart' });
      } else {
        Toast.show({ type: 'error', text1: 'Could not fetch current items' });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to add items to cart' });
    } finally {
      setLoading(false);
    }
  };

  const canArchive = order.status === 'arrived' || order.status === 'rejected';
  const dateStr = new Date(order.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  // Counterparty presentation
  const CounterpartyIcon = role === 'business' ? Store : Building2;
  const counterpartyFallback = role === 'business' ? 'Supplier' : 'Customer';
  const counterpartyName = counterparty?.name ?? counterpartyFallback;

  return (
    <Card
      style={open ? { borderColor: Colors.primary, borderWidth: 1.5 } : undefined}
    >
      <Pressable onPress={toggle}>
        <CardHeader style={{ paddingBottom: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* ── Left: counterparty avatar + name + order meta ── */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                flex: 1,
                minWidth: 0,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: `${Colors.primary}18`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {counterparty?.icon ? (
                  <Image
                    source={{ uri: counterparty.icon }}
                    style={{ width: 40, height: 40 }}
                    contentFit="cover"
                  />
                ) : (
                  <CounterpartyIcon size={20} color={Colors.primary} />
                )}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    color: Colors.foreground,
                  }}
                >
                  {counterpartyName}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    fontFamily: 'PlusJakartaSans',
                    color: Colors.mutedForeground,
                  }}
                >
                  Order #{order.id.slice(-6)} · {order.ordered_items.length} item
                  {order.ordered_items.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {/* ── Right: total, date, status, chevron ── */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    color: Colors.foreground,
                  }}
                >
                  ${order.total_price.toFixed(2)}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Clock size={11} color={Colors.mutedForeground} />
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'PlusJakartaSans',
                      color: Colors.mutedForeground,
                    }}
                  >
                    {dateStr}
                  </Text>
                </View>
              </View>
              <StatusBadge status={order.status} />
              {!compact && (
                <ChevronDown
                  size={18}
                  color={Colors.mutedForeground}
                  style={{
                    transform: [{ rotate: open ? '180deg' : '0deg' }],
                  }}
                />
              )}
            </View>
          </View>
        </CardHeader>
      </Pressable>

      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <OrderProgressBar status={order.status} />
      </View>

      {open && !compact && (
        <CardContent>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: Colors.border,
              paddingTop: 12,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'PlusJakartaSans-Medium',
                color: Colors.mutedForeground,
                marginBottom: 4,
              }}
            >
              Order Items
            </Text>
            {order.ordered_items.map((item, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: Colors.muted,
                  borderRadius: 8,
                  padding: 10,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'PlusJakartaSans-Medium',
                      color: Colors.foreground,
                    }}
                  >
                    Item #{item.item_id.slice(-6)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'PlusJakartaSans',
                      color: Colors.mutedForeground,
                    }}
                  >
                    Qty: {item.quantity} · ${item.price_at_order.toFixed(2)} each
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    color: Colors.foreground,
                  }}
                >
                  ${item.total_price_for_item.toFixed(2)}
                </Text>
              </View>
            ))}

            {/* ── Role-specific action bar ── */}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {role === 'supplier' && order.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onPress={() => handleStatusUpdate('accepted')}
                    loading={loading}
                    style={{ flex: 1 }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Check size={14} color={Colors.primaryForeground} />
                      <Text
                        style={{
                          color: Colors.primaryForeground,
                          fontFamily: 'PlusJakartaSans-SemiBold',
                          fontSize: 13,
                        }}
                      >
                        Accept
                      </Text>
                    </View>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => handleStatusUpdate('rejected')}
                    loading={loading}
                    style={{ flex: 1 }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <X size={14} color={Colors.destructive} />
                      <Text
                        style={{
                          color: Colors.destructive,
                          fontFamily: 'PlusJakartaSans-SemiBold',
                          fontSize: 13,
                        }}
                      >
                        Reject
                      </Text>
                    </View>
                  </Button>
                </>
              )}

              {role === 'supplier' && order.status === 'accepted' && (
                <Button
                  size="sm"
                  onPress={() => handleStatusUpdate('delivering')}
                  loading={loading}
                  style={{ flex: 1 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Truck size={14} color={Colors.primaryForeground} />
                    <Text
                      style={{
                        color: Colors.primaryForeground,
                        fontFamily: 'PlusJakartaSans-SemiBold',
                        fontSize: 13,
                      }}
                    >
                      Mark as Delivering
                    </Text>
                  </View>
                </Button>
              )}

              {role === 'business' && order.status === 'delivering' && (
                <Button
                  size="sm"
                  onPress={() => handleStatusUpdate('arrived')}
                  loading={loading}
                  style={{ flex: 1 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Check size={14} color={Colors.primaryForeground} />
                    <Text
                      style={{
                        color: Colors.primaryForeground,
                        fontFamily: 'PlusJakartaSans-SemiBold',
                        fontSize: 13,
                      }}
                    >
                      Confirm Arrival
                    </Text>
                  </View>
                </Button>
              )}

              {role === 'business' && canArchive && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={handleOrderAgain}
                    loading={loading}
                    style={{ flex: 1 }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <RefreshCw size={14} color={Colors.foreground} />
                      <Text
                        style={{
                          color: Colors.foreground,
                          fontFamily: 'PlusJakartaSans-SemiBold',
                          fontSize: 13,
                        }}
                      >
                        Order Again
                      </Text>
                    </View>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={handleArchive}
                    loading={loading}
                    style={{ flex: 1 }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Archive size={14} color={Colors.foreground} />
                      <Text
                        style={{
                          color: Colors.foreground,
                          fontFamily: 'PlusJakartaSans-SemiBold',
                          fontSize: 13,
                        }}
                      >
                        Archive
                      </Text>
                    </View>
                  </Button>
                </>
              )}
            </View>
          </View>
        </CardContent>
      )}
    </Card>
  );
}