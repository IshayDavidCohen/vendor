import { useState, useCallback } from 'react';
import { View, Text, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Package, Clock, ChevronDown, Check, X, Truck, Archive, RefreshCw } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { OrderProgressBar } from '@/components/OrderProgressBar';
import { ordersApi, itemsApi } from '@/services/api';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { getItemById } from '@/mocks/data';
import { Colors } from '@/constants/theme';
import type { Order, OrderStatus } from '@/types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface OrderCardProps {
  order: Order;
  role: 'business' | 'supplier';
  onStatusUpdate?: () => void;
  compact?: boolean;
}

export function OrderCard({ order, role, onStatusUpdate, compact }: OrderCardProps) {
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: `${Colors.primary}18`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Package size={20} color={Colors.primary} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    color: Colors.foreground,
                  }}
                >
                  Order #{order.id.slice(-6)}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'PlusJakartaSans',
                    color: Colors.mutedForeground,
                  }}
                >
                  {order.ordered_items.length} item
                  {order.ordered_items.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
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
                    Qty: {item.quantity} @ ${item.price_at_order.toFixed(2)}
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
          </View>

          {role === 'supplier' && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginTop: 12,
              }}
            >
              {order.status === 'pending' && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onPress={() => handleStatusUpdate('accepted')}
                    disabled={loading}
                    style={{ backgroundColor: '#059669' }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Check size={14} color="#fff" />
                      <Text style={{ color: '#fff', fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 13 }}>Accept</Text>
                    </View>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onPress={() => handleStatusUpdate('rejected')}
                    disabled={loading}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <X size={14} color="#fff" />
                      <Text style={{ color: '#fff', fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 13 }}>Reject</Text>
                    </View>
                  </Button>
                </>
              )}
              {order.status === 'accepted' && (
                <Button
                  size="sm"
                  onPress={() => handleStatusUpdate('delivering')}
                  disabled={loading}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Truck size={14} color="#fff" />
                    <Text style={{ color: '#fff', fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 13 }}>Mark Delivering</Text>
                  </View>
                </Button>
              )}
              {order.status === 'delivering' && (
                <Button
                  size="sm"
                  onPress={() => handleStatusUpdate('arrived')}
                  disabled={loading}
                  style={{ backgroundColor: '#059669' }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Check size={14} color="#fff" />
                    <Text style={{ color: '#fff', fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 13 }}>Mark Arrived</Text>
                  </View>
                </Button>
              )}
              {canArchive && (
                <Button
                  variant="outline"
                  size="sm"
                  onPress={handleArchive}
                  disabled={loading}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Archive size={14} color={Colors.foreground} />
                    <Text style={{ color: Colors.foreground, fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 13 }}>Archive</Text>
                  </View>
                </Button>
              )}
            </View>
          )}
        </CardContent>
        
      )}

      {/* Order Again Section */}
      {!compact && role === 'business' && order.status === 'arrived' && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            backgroundColor: Colors.muted,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            overflow: 'hidden',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans', color: Colors.mutedForeground }}>
              Delivered {dateStr}
            </Text>
          </View>
          <Pressable
            onPress={handleOrderAgain}
            disabled={loading}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: loading ? `${Colors.primary}99` : Colors.primary,
              borderRadius: 20,
              paddingVertical: 7,
              paddingHorizontal: 16,
              opacity: pressed ? 0.85 : 1,
              ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
            })}
          >
            <RefreshCw size={13} color="#fff" />
            <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans-SemiBold', color: '#fff' }}>
              Order again
            </Text>
          </Pressable>
        </View>
      )}
    </Card>
  );
}
