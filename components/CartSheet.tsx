// components/CartSheet.tsx
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Modal, ModalHeader } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import {
  useCartStore,
  resolveUnitPrice,
  type CartItem,
} from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { ordersApi } from '@/services/api';
import {
  formatMoney,
  formatCurrencyTotals,
  toCurrencyTotalRows,
} from '@/utils/formatMoney';
import { Colors } from '@/constants/theme';

// ─────────────────────────────────────────────────────────────────────────────
// Row
// ─────────────────────────────────────────────────────────────────────────────

interface CartItemRowProps {
  cartItem: CartItem;
  businessId: string | null;
}

function CartItemRow({ cartItem, businessId }: CartItemRowProps) {
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeItem = useCartStore(s => s.removeItem);

  const unitPrice = resolveUnitPrice(cartItem, businessId);
  const lineTotal = unitPrice * cartItem.quantity;

  return (
    <View style={{ flexDirection: 'row', gap: 12, paddingVertical: 12 }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: Colors.muted,
        }}
      >
        {cartItem.item.image ? (
          <Image
            source={{ uri: cartItem.item.image }}
            style={{ width: 56, height: 56 }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingCart size={20} color={Colors.mutedForeground} />
          </View>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'PlusJakartaSans-Medium',
                color: Colors.foreground,
              }}
              numberOfLines={1}
            >
              {cartItem.item.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'PlusJakartaSans',
                color: Colors.mutedForeground,
              }}
            >
              {cartItem.supplierName}
            </Text>
          </View>
          <Pressable
            onPress={() => removeItem(cartItem.item.id)}
            hitSlop={8}
          >
            <Trash2 size={16} color={Colors.mutedForeground} />
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable
              onPress={() =>
                updateQuantity(cartItem.item.id, cartItem.quantity - 1)
              }
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: Colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Minus size={14} color={Colors.foreground} />
            </Pressable>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'PlusJakartaSans-Medium',
                color: Colors.foreground,
                width: 28,
                textAlign: 'center',
              }}
            >
              {cartItem.quantity}
            </Text>
            <Pressable
              onPress={() =>
                updateQuantity(cartItem.item.id, cartItem.quantity + 1)
              }
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: Colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={14} color={Colors.foreground} />
            </Pressable>
          </View>

          <Text
            style={{
              fontSize: 14,
              fontFamily: 'PlusJakartaSans-SemiBold',
              color: Colors.foreground,
            }}
          >
            {formatMoney(lineTotal, cartItem.item.currency)}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Total block (Option C — per-currency rows)
// ─────────────────────────────────────────────────────────────────────────────

interface CartTotalBlockProps {
  totals: Record<string, number>;
}

function CartTotalBlock({ totals }: CartTotalBlockProps) {
  const rows = toCurrencyTotalRows(totals);

  // Single-currency path: keep the existing, compact "Total ⋯ $X" layout.
  if (rows.length <= 1) {
    const only = rows[0];
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'PlusJakartaSans-SemiBold',
            color: Colors.foreground,
          }}
        >
          Total
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'PlusJakartaSans-SemiBold',
            color: Colors.foreground,
          }}
        >
          {only?.amount ?? formatMoney(0, 'USD')}
        </Text>
      </View>
    );
  }

  // Multi-currency path: one row per currency with a muted label.
  return (
    <View style={{ gap: 8 }}>
      {rows.map(row => (
        <View
          key={row.currency}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
            }}
          >
            {row.label}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'PlusJakartaSans-SemiBold',
              color: Colors.foreground,
            }}
          >
            {row.amount}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sheet
// ─────────────────────────────────────────────────────────────────────────────

interface CartSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function CartSheet({ visible, onClose }: CartSheetProps) {
  const [loading, setLoading] = useState(false);

  const items = useCartStore(s => s.items);
  const getItemsBySupplierId = useCartStore(s => s.getItemsBySupplierId);
  const getTotalItems = useCartStore(s => s.getTotalItems);
  const getCurrencyTotals = useCartStore(s => s.getCurrencyTotals);
  const getSupplierCurrencyTotals = useCartStore(s => s.getSupplierCurrencyTotals);
  const clearCart = useCartStore(s => s.clearCart);

  const platformId = useAuthStore(s => s.platformId);
  const role = useAuthStore(s => s.role);
  const businessId = role === 'business' ? platformId : null;

  const itemsBySupplier = getItemsBySupplierId();
  const totalItems = getTotalItems();
  const currencyTotals = getCurrencyTotals(businessId);

  const handlePlaceOrder = async () => {
    if (!platformId || items.length === 0) return;
    setLoading(true);

    try {
      const orders: Record<string, Record<string, number>> = {};
      items.forEach(ci => {
        if (!orders[ci.supplierId]) orders[ci.supplierId] = {};
        orders[ci.supplierId][ci.item.id] = ci.quantity;
      });

      const { error } = await ordersApi.create({
        business: platformId,
        orders,
      });

      if (error) {
        Toast.show({ type: 'error', text1: 'Failed to place order', text2: error });
        return;
      }

      Toast.show({ type: 'success', text1: 'Order placed successfully!' });
      clearCart();
      onClose();
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to place order' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} animationType="slide">
      <ModalHeader
        title="Shopping Cart"
        description={`${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
        onClose={onClose}
      />

      {items.length === 0 ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 48,
            gap: 16,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: Colors.muted,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingCart size={40} color={Colors.mutedForeground} />
          </View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
              textAlign: 'center',
              paddingHorizontal: 32,
            }}
          >
            Your cart is empty. Browse suppliers to add items.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            style={{ maxHeight: 400, paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {Object.entries(itemsBySupplier).map(([supplierId, supplierItems]) => {
              const subtotalLabel = formatCurrencyTotals(
                getSupplierCurrencyTotals(supplierId, businessId),
              );
              return (
                <View key={supplierId}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 12,
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'PlusJakartaSans-SemiBold',
                        color: Colors.mutedForeground,
                      }}
                    >
                      {supplierItems[0]?.supplierName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'PlusJakartaSans',
                        color: Colors.mutedForeground,
                      }}
                    >
                      {subtotalLabel}
                    </Text>
                  </View>

                  {supplierItems.map(ci => (
                    <CartItemRow
                      key={ci.item.id}
                      cartItem={ci}
                      businessId={businessId}
                    />
                  ))}
                  <Separator />
                </View>
              );
            })}
          </ScrollView>

          <View
            style={{
              padding: 16,
              borderTopWidth: 1,
              borderTopColor: Colors.border,
              gap: 12,
            }}
          >
            <CartTotalBlock totals={currencyTotals} />
            <Button size="lg" onPress={handlePlaceOrder} loading={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </View>
        </>
      )}
    </Modal>
  );
}