import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Package, Minus, Plus, Ban, RotateCcw } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { itemsApi } from '@/services/api';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/theme';
import { UNIT_LABEL_MAP } from '@/constants/units';
import type { Item } from '@/types';

// ─── Constants ──────────────────────────────────────────
const LOW_STOCK_THRESHOLD = 10;
const DEBOUNCE_MS = 500;
const ROW_HEIGHT = 72;

// ─── Types ──────────────────────────────────────────────
type InventoryOverride = { stock_quantity?: number; out_of_stock?: boolean };

interface InventoryListProps {
  items: Item[];
  loading: boolean;
  onItemUpdated: () => void;
}

interface InventoryRowProps {
  item: Item;
  onQuantityChange: (itemId: string, newQty: number) => void;
  onToggleOutOfStock: (itemId: string) => void;
}

// ─── Skeleton ───────────────────────────────────────────
function InventoryRowSkeleton() {
  return (
    <Card style={{ marginBottom: 8 }}>
      <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Skeleton width={48} height={48} borderRadius={8} />
        <View style={{ flex: 1, gap: 4 }}>
          <Skeleton width={120} height={14} borderRadius={6} />
          <Skeleton width={80} height={12} borderRadius={6} />
        </View>
        <Skeleton width={100} height={32} borderRadius={8} />
      </View>
    </Card>
  );
}

// ─── Row ────────────────────────────────────────────────
function InventoryRow({ item, onQuantityChange, onToggleOutOfStock }: InventoryRowProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<TextInput>(null);

  const unitLabel = UNIT_LABEL_MAP[item.unit] ?? item.unit;
  const isOutOfStock = item.out_of_stock;
  const isLowStock = !isOutOfStock && item.stock_quantity <= LOW_STOCK_THRESHOLD && item.stock_quantity > 0;

  const handleDecrement = () => onQuantityChange(item.id, Math.max(0, item.stock_quantity - 1));
  const handleIncrement = () => onQuantityChange(item.id, item.stock_quantity + 1);

  const handleStartEdit = () => {
    setEditValue(item.stock_quantity.toString());
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleFinishEdit = () => {
    setEditing(false);
    const parsed = parseInt(editValue, 10);
    const newQty = Number.isNaN(parsed) ? item.stock_quantity : Math.max(0, parsed);
    if (newQty !== item.stock_quantity) onQuantityChange(item.id, newQty);
  };

  return (
    <Card style={{ marginBottom: 8, opacity: isOutOfStock ? 0.55 : 1 }}>
      <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {/* Thumbnail */}
        <View style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: Colors.muted, overflow: 'hidden' }}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={150} />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} color={Colors.mutedForeground} />
            </View>
          )}
        </View>

        {/* Name + meta */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans-SemiBold', color: Colors.foreground }} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans', color: Colors.mutedForeground, marginTop: 2 }} numberOfLines={1}>
            {unitLabel} · {item.currency} {item.base_price.toFixed(2)}
          </Text>
        </View>

        {/* Controls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Toggle out-of-stock */}
          <Pressable
            onPress={() => onToggleOutOfStock(item.id)}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 32, height: 32, borderRadius: 8,
              backgroundColor: isOutOfStock ? Colors.destructive : Colors.muted,
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
              ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
            })}
          >
            {isOutOfStock ? <RotateCcw size={14} color="#fff" /> : <Ban size={14} color={Colors.mutedForeground} />}
          </Pressable>

          {/* Stepper or badge */}
          {isOutOfStock ? (
            <Badge variant="destructive">Out of stock</Badge>
          ) : (
            <View
              style={{
                flexDirection: 'row', alignItems: 'center',
                borderWidth: 1, borderColor: isLowStock ? '#F59E0B' : Colors.border,
                borderRadius: 8, overflow: 'hidden',
              }}
            >
              <Pressable onPress={handleDecrement} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}) }}>
                <Minus size={14} color={Colors.mutedForeground} />
              </Pressable>

              {editing ? (
                <TextInput
                  ref={inputRef}
                  value={editValue}
                  onChangeText={setEditValue}
                  onBlur={handleFinishEdit}
                  onSubmitEditing={handleFinishEdit}
                  keyboardType="number-pad"
                  selectTextOnFocus
                  style={{
                    minWidth: 40, textAlign: 'center', fontSize: 14,
                    fontFamily: 'PlusJakartaSans-SemiBold', color: Colors.foreground,
                    borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border,
                    paddingVertical: 6, paddingHorizontal: 4,
                  }}
                />
              ) : (
                <Pressable
                  onPress={handleStartEdit}
                  style={{
                    minWidth: 40, alignItems: 'center', justifyContent: 'center',
                    borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border,
                    paddingVertical: 6,
                    ...(Platform.OS === 'web' ? { cursor: 'text' as any } : {}),
                  }}
                >
                  <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans-SemiBold', color: Colors.foreground }}>
                    {item.stock_quantity}
                  </Text>
                </Pressable>
              )}

              <Pressable onPress={handleIncrement} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}) }}>
                <Plus size={14} color={Colors.mutedForeground} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

// ─── List ───────────────────────────────────────────────
export function InventoryList({ items: externalItems, loading, onItemUpdated }: InventoryListProps) {
  const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const overridesRef = useRef<Map<string, InventoryOverride>>(new Map());
  const [overrideVersion, setOverrideVersion] = useState(0);

  // ── Optimistic override — updates ref + bumps version for re-render ──
  const applyOverride = useCallback((itemId: string, data: InventoryOverride) => {
    const existing = overridesRef.current.get(itemId);
    overridesRef.current.set(itemId, { ...existing, ...data });
    setOverrideVersion(v => v + 1);
  }, []);

  // ── Clear overrides when external data syncs (no useEffect) ──
  const prevExternalRef = useRef(externalItems);
  if (prevExternalRef.current !== externalItems) {
    prevExternalRef.current = externalItems;
    if (overridesRef.current.size > 0) overridesRef.current.clear();
  }

  // ── Stable sort — recomputes only on external data change ──
  const sortedIds = useMemo(() =>
    [...externalItems]
      .sort((a, b) => {
        if (a.out_of_stock !== b.out_of_stock) return a.out_of_stock ? 1 : -1;
        const aLow = !a.out_of_stock && a.stock_quantity <= LOW_STOCK_THRESHOLD;
        const bLow = !b.out_of_stock && b.stock_quantity <= LOW_STOCK_THRESHOLD;
        if (aLow !== bLow) return aLow ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map(i => i.id),
  [externalItems]);

  // ── Merge external + overrides in stable order ──
  const displayItems = useMemo(() => {
    const map = new Map(externalItems.map(i => [i.id, i]));
    return sortedIds.reduce<Item[]>((acc, id) => {
      const item = map.get(id);
      if (!item) return acc;
      const ov = overridesRef.current.get(id);
      acc.push(ov ? { ...item, ...ov } : item);
      return acc;
    }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedIds, externalItems, overrideVersion]);

  // ── Memoized counts ──
  const { outOfStockCount, lowStockCount } = useMemo(() => ({
    outOfStockCount: displayItems.filter(i => i.out_of_stock).length,
    lowStockCount: displayItems.filter(i => !i.out_of_stock && i.stock_quantity <= LOW_STOCK_THRESHOLD).length,
  }), [displayItems]);

  // ── Cleanup debounce timers on unmount ──
  useEffect(() => {
    return () => { debounceTimers.current.forEach(t => clearTimeout(t)); };
  }, []);

  // ── Debounced API persist ──
  const persistInventory = useCallback((itemId: string, data: InventoryOverride) => {
    const existing = debounceTimers.current.get(itemId);
    if (existing) clearTimeout(existing);

    debounceTimers.current.set(itemId, setTimeout(async () => {
      debounceTimers.current.delete(itemId);
      try {
        const { error } = await itemsApi.updateInventory(itemId, data);
        if (error) {
          Toast.show({ type: 'error', text1: 'Failed to save', text2: error });
          onItemUpdated();
        }
      } catch {
        Toast.show({ type: 'error', text1: 'Failed to save' });
        onItemUpdated();
      }
    }, DEBOUNCE_MS));
  }, [onItemUpdated]);

  // ── Handlers ──
  const handleQuantityChange = useCallback((itemId: string, newQty: number) => {
    const safeQty = Math.max(0, newQty);
    const autoOos = safeQty <= 0;
    const override: InventoryOverride = {
      stock_quantity: safeQty,
      ...(autoOos ? { out_of_stock: true } : {}),
    };

    applyOverride(itemId, override);
    persistInventory(itemId, override);

    if (autoOos) Toast.show({ type: 'info', text1: 'Item marked out of stock' });
  }, [applyOverride, persistInventory]);

  const handleToggleOutOfStock = useCallback((itemId: string) => {
    const base = externalItems.find(i => i.id === itemId);
    const ov = overridesRef.current.get(itemId);
    const current = base ? { ...base, ...ov } : null;
    if (!current) return;

    const newOos = !current.out_of_stock;
    const newQty = (!newOos && current.stock_quantity <= 0) ? 1 : undefined;
    const override: InventoryOverride = {
      out_of_stock: newOos,
      ...(newQty !== undefined ? { stock_quantity: newQty } : {}),
    };

    applyOverride(itemId, override);

    // Toggle is deliberate — persist immediately, no debounce
    (async () => {
      try {
        const { error } = await itemsApi.updateInventory(itemId, override);
        if (error) {
          Toast.show({ type: 'error', text1: 'Failed to update', text2: error });
          onItemUpdated();
          return;
        }
        Toast.show({ type: 'success', text1: newOos ? 'Marked out of stock' : 'Restored to in stock' });
      } catch {
        Toast.show({ type: 'error', text1: 'Failed to update' });
        onItemUpdated();
      }
    })();
  }, [externalItems, applyOverride, onItemUpdated]);

  // ── FlatList performance helpers ──
  const getItemLayout = useCallback((_: unknown, index: number) => ({
    length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index,
  }), []);

  const renderRow = useCallback(({ item }: { item: Item }) => (
    <InventoryRow item={item} onQuantityChange={handleQuantityChange} onToggleOutOfStock={handleToggleOutOfStock} />
  ), [handleQuantityChange, handleToggleOutOfStock]);

  const keyExtractor = useCallback((item: Item) => item.id, []);

  // ── Render ──
  if (loading) {
    return (
      <View>{[0, 1, 2, 3, 4].map(i => <InventoryRowSkeleton key={i} />)}</View>
    );
  }

  if (externalItems.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 48 }}>
        <Package size={40} color={Colors.mutedForeground} />
        <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans-SemiBold', color: Colors.foreground, marginTop: 16 }}>
          No items yet
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans', color: Colors.mutedForeground, marginTop: 4 }}>
          Add items in the Catalogue tab first
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8 }}>
        <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans', color: Colors.mutedForeground }}>
          {outOfStockCount} out of stock · {lowStockCount} low
        </Text>
      </View>
      <FlatList
        data={displayItems}
        keyExtractor={keyExtractor}
        renderItem={renderRow}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={Platform.OS !== 'web'}
        maxToRenderPerBatch={15}
        windowSize={7}
      />
    </View>
  );
}