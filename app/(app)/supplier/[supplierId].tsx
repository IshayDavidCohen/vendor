import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  useWindowDimensions,
  type ListRenderItem,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Package,
  Handshake,
  Mail,
  Phone,
  MapPin,
  Check,
} from 'lucide-react-native';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { supplierApi, handshakeApi } from '@/services/api';
import type { Business, Item, Supplier, UserRole } from '@/types';
import { ItemCard } from '@/components/ItemCard';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Colors } from '@/constants/theme';

const GAP = 12;
const H_PADDING = 16;
const BANNER_HEIGHT = 160;

function useSingleParam(
  value: string | string[] | undefined,
): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function ItemSkeletonCell({ width }: { width: number }) {
  return (
    <View style={{ width }}>
      <Skeleton height={120} borderRadius={12} width="100%" />
      <View style={{ marginTop: 10, gap: 6 }}>
        <Skeleton height={14} width="80%" borderRadius={6} />
        <Skeleton height={16} width="50%" borderRadius={6} />
        <Skeleton height={36} borderRadius={8} width="100%" />
      </View>
    </View>
  );
}

interface SupplierStoreHeaderProps {
  supplier: Supplier | null;
  loading: boolean;
  role: UserRole;
  isConnected: boolean;
  platformId: string | null;
  handshakeLoading: boolean;
  handshakeMessage: string | null;
  onRequestHandshake: () => void;
  onBack: () => void;
  search: string;
  onSearchChange: (q: string) => void;
}

function SupplierStoreHeader({
  supplier,
  loading,
  role,
  isConnected,
  platformId,
  handshakeLoading,
  handshakeMessage,
  onRequestHandshake,
  onBack,
  search,
  onSearchChange,
}: SupplierStoreHeaderProps) {
  if (!supplier && !loading) return null;

  return (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          borderRadius: 12,
          overflow: 'hidden',
          height: BANNER_HEIGHT,
          backgroundColor: Colors.muted,
        }}
      >
        {supplier?.banner ? (
          <Image
            source={{ uri: supplier.banner }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Package size={48} color={Colors.mutedForeground} />
          </View>
        )}

        <Pressable
          onPress={onBack}
          style={({ pressed }) => ({
            position: 'absolute',
            top: 12,
            left: 12,
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,0.45)',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <ArrowLeft size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={{ marginTop: -36, paddingHorizontal: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 14 }}>
          <Avatar
            src={supplier?.icon}
            fallback={supplier?.company_name ?? 'S'}
            size={88}
            style={{
              borderWidth: 4,
              borderColor: Colors.background,
            }}
          />
          <View style={{ flex: 1, paddingBottom: 4 }}>
            {loading ? (
              <>
                <Skeleton height={22} width="70%" borderRadius={6} />
                <Skeleton
                  height={14}
                  width="40%"
                  borderRadius={6}
                  style={{ marginTop: 8 }}
                />
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: 'DMSans-Bold',
                    color: Colors.foreground,
                  }}
                  numberOfLines={2}
                >
                  {supplier?.company_name}
                </Text>
                {role === 'business' ? (
                  <View style={{ marginTop: 8 }}>
                    {isConnected ? (
                      <Badge
                        style={{
                          backgroundColor: Colors.primary,
                          borderColor: Colors.primary,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Check size={14} color="#FFFFFF" />
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: 'PlusJakartaSans-Medium',
                            color: '#FFFFFF',
                          }}
                        >
                          Connected
                        </Text>
                      </Badge>
                    ) : (
                      <View style={{ gap: 8 }}>
                        <Button
                          onPress={onRequestHandshake}
                          loading={handshakeLoading}
                          disabled={!platformId}
                          style={{ alignSelf: 'flex-start' }}
                        >
                          <Handshake size={16} color={Colors.primaryForeground} />
                          <Text
                            style={{
                              fontFamily: 'PlusJakartaSans-SemiBold',
                              fontSize: 14,
                              color: Colors.primaryForeground,
                            }}
                          >
                            Request Handshake
                          </Text>
                        </Button>
                        {handshakeMessage ? (
                          <Text
                            style={{
                              fontSize: 13,
                              fontFamily: 'PlusJakartaSans',
                              color: handshakeMessage.includes('sent')
                                ? Colors.status.accepted.bg
                                : Colors.destructive,
                            }}
                          >
                            {handshakeMessage}
                          </Text>
                        ) : null}
                      </View>
                    )}
                  </View>
                ) : null}
              </>
            )}
          </View>
        </View>
      </View>

      {!loading && supplier?.desc ? (
        <Text
          style={{
            marginTop: 16,
            fontSize: 14,
            fontFamily: 'PlusJakartaSans',
            color: Colors.mutedForeground,
            lineHeight: 20,
          }}
        >
          {supplier.desc}
        </Text>
      ) : null}

      {!loading && supplier ? (
        <Card style={{ marginTop: 16 }}>
          <CardContent style={{ paddingTop: 16, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Mail size={18} color={Colors.mutedForeground} />
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.foreground,
                }}
              >
                {supplier.email}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Phone size={18} color={Colors.mutedForeground} />
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.foreground,
                }}
              >
                {supplier.phone}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <MapPin
                size={18}
                color={Colors.mutedForeground}
                style={{ marginTop: 2 }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.foreground,
                  lineHeight: 20,
                }}
              >
                {supplier.address}
              </Text>
            </View>
          </CardContent>
        </Card>
      ) : null}

      <View style={{ marginTop: 20 }}>
        <PageHeader title="Catalogue" description="Items available from this supplier" />
      </View>

      <View style={{ marginBottom: 12 }}>
        <View style={{ position: 'relative', justifyContent: 'center' }}>
          <View
            style={{
              position: 'absolute',
              left: 12,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <Search size={18} color={Colors.mutedForeground} />
          </View>
          <Input
            placeholder="Search items..."
            value={search}
            onChangeText={onSearchChange}
            style={{ paddingLeft: 40 }}
            returnKeyType="search"
          />
        </View>
      </View>
    </View>
  );
}

export default function SupplierStorefrontScreen() {
  const rawId = useLocalSearchParams<{ supplierId: string | string[] }>().supplierId;
  const supplierId = useSingleParam(rawId);
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const itemColWidth = (width - H_PADDING * 2 - GAP) / 2;

  const profile = useAuthStore(s => s.profile);
  const role = useAuthStore(s => s.role);
  const platformId = useAuthStore(s => s.platformId);

  const cartItems = useCartStore(s => s.items);
  const addItem = useCartStore(s => s.addItem);
  const updateQuantity = useCartStore(s => s.updateQuantity);

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [handshakeLoading, setHandshakeLoading] = useState(false);
  const [handshakeMessage, setHandshakeMessage] = useState<string | null>(null);

  const isConnected =
    !!supplierId &&
    role === 'business' &&
    !!(profile as Business | null)?.my_suppliers?.includes(supplierId);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    if (!supplierId) {
      setLoading(false);
      setError('Missing supplier');
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setHandshakeMessage(null);

      const businessId =
        role === 'business' && platformId ? platformId : undefined;

      const [supRes, itemsRes] = await Promise.all([
        supplierApi.get(supplierId),
        supplierApi.getItems(supplierId, businessId),
      ]);

      if (cancelled) return;

      if (supRes.error) {
        setError(supRes.error);
        setSupplier(null);
      } else {
        setSupplier(supRes.data ?? null);
      }

      if (itemsRes.error) {
        setError(prev => prev ?? itemsRes.error!);
        setItems([]);
      } else {
        setItems(itemsRes.data ?? []);
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [supplierId, role, platformId]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      it =>
        it.name.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q),
    );
  }, [items, search]);

  const getCartQuantity = useCallback(
    (itemId: string) => {
      if (!supplierId) return 0;
      const row = cartItems.find(
        c => c.item.id === itemId && c.supplierId === supplierId,
      );
      return row?.quantity ?? 0;
    },
    [cartItems, supplierId],
  );

  const showCart =
    role === 'business' && !!platformId && !!supplier && isConnected;

  const onRequestHandshake = useCallback(async () => {
    if (!supplierId || !platformId || role !== 'business') return;
    setHandshakeLoading(true);
    setHandshakeMessage(null);
    const res = await handshakeApi.create({
      sender_id: platformId,
      recipient_id: supplierId,
      sender_type: 'business',
      recipient_type: 'supplier',
    });
    setHandshakeLoading(false);
    if (res.error) {
      setHandshakeMessage(res.error);
      return;
    }
    setHandshakeMessage('Handshake request sent. The supplier will be notified.');
  }, [supplierId, platformId, role]);

  const skeletonGrid = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => (
      <View style={{ width: itemColWidth }}>
        <ItemCard
          item={item}
          businessId={platformId ?? undefined}
          onAddToCart={
            showCart
              ? it => addItem(it, supplierId!, supplier!.company_name)
              : undefined
          }
          cartQuantity={getCartQuantity(item.id)}
          onUpdateQuantity={
            showCart
              ? qty => {
                  updateQuantity(item.id, qty);
                }
              : undefined
          }
          disabled={!showCart}
        />
      </View>
    ),
    [
      itemColWidth,
      platformId,
      showCart,
      supplierId,
      supplier,
      addItem,
      getCartQuantity,
      updateQuantity,
    ],
  );

  const renderItemSkeleton: ListRenderItem<number> = useCallback(
    () => (
      <View style={{ width: itemColWidth }}>
        <ItemSkeletonCell width={itemColWidth} />
      </View>
    ),
    [itemColWidth],
  );

  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  if (!supplierId) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          paddingTop: insets.top,
          paddingHorizontal: H_PADDING,
        }}
      >
        <EmptyState
          icon={<Package size={36} color={Colors.mutedForeground} />}
          title="Invalid supplier"
          description="This link is missing a supplier id."
        />
      </View>
    );
  }

  if (error && !loading && !supplier) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          paddingTop: insets.top,
          paddingHorizontal: H_PADDING,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'PlusJakartaSans-Medium',
              color: Colors.foreground,
            }}
          >
            Back
          </Text>
        </Pressable>
        <EmptyState
          icon={<Package size={36} color={Colors.mutedForeground} />}
          title="Supplier not found"
          description={error}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, paddingTop: insets.top }}>
      <FlatList<Item | number>
        data={loading ? skeletonGrid : filteredItems}
        keyExtractor={(item, idx) =>
          typeof item === 'number' ? `sk-${idx}` : item.id
        }
        numColumns={2}
        columnWrapperStyle={loading || filteredItems.length > 0 ? { gap: GAP } : undefined}
        ListHeaderComponent={
          <>
            <SupplierStoreHeader
              supplier={supplier}
              loading={loading}
              role={role}
              isConnected={isConnected}
              platformId={platformId}
              handshakeLoading={handshakeLoading}
              handshakeMessage={handshakeMessage}
              onRequestHandshake={onRequestHandshake}
              onBack={onBack}
              search={search}
              onSearchChange={setSearch}
            />
            {error && supplier && !loading ? (
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.destructive,
                  marginBottom: 12,
                }}
              >
                {error}
              </Text>
            ) : null}
          </>
        }
        renderItem={({ item }) => {
          if (typeof item === 'number') {
            return (
              <View style={{ width: itemColWidth }}>
                <ItemSkeletonCell width={itemColWidth} />
              </View>
            );
          }
          return (
            <View style={{ width: itemColWidth }}>
              <ItemCard
                item={item}
                businessId={platformId ?? undefined}
                onAddToCart={
                  showCart
                    ? it => addItem(it, supplierId!, supplier!.company_name)
                    : undefined
                }
                cartQuantity={getCartQuantity(item.id)}
                onUpdateQuantity={
                  showCart
                    ? qty => updateQuantity(item.id, qty)
                    : undefined
                }
                disabled={!showCart}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon={<Search size={36} color={Colors.mutedForeground} />}
              title={items.length === 0 ? 'No items yet' : 'No matches'}
              description={
                items.length === 0
                  ? 'This supplier has not listed any products.'
                  : 'Try a different search term.'
              }
            />
          ) : null
        }
        contentContainerStyle={{
          paddingHorizontal: H_PADDING,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
