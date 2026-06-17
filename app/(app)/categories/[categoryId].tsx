import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  View,
  Pressable,
  FlatList,
  useWindowDimensions,
  type ListRenderItem,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Store } from 'lucide-react-native';
import { supplierApi, categoriesApi } from '@/services/api';
import type { Category, SupplierCarouselItem } from '@/types';
import { SupplierCard } from '@/components/SupplierCard';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Colors } from '@/constants/theme';

const GAP = 12;
const H_PADDING = 16;

function useSingleParam(
  value: string | string[] | undefined,
): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function SupplierRowSkeleton({ width }: { width: number }) {
  return (
    <View style={{ width, marginBottom: GAP }}>
      <Skeleton height={100} borderRadius={12} width="100%" />
      <View style={{ marginTop: 12, flexDirection: 'row', gap: 10 }}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton height={15} width="70%" borderRadius={6} />
          <Skeleton height={12} width="100%" borderRadius={6} />
          <Skeleton height={12} width="85%" borderRadius={6} />
        </View>
      </View>
      <Skeleton height={36} borderRadius={8} width="100%" style={{ marginTop: 10 }} />
    </View>
  );
}

export default function CategoryDetailScreen() {
  const rawId = useLocalSearchParams<{ categoryId: string | string[] }>().categoryId;
  const categoryId = useSingleParam(rawId);
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = width - H_PADDING * 2;

  const [category, setCategory] = useState<Category | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierCarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      setError('Missing category');
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);

      const [catRes, supRes] = await Promise.all([
        categoriesApi.get(categoryId),
        supplierApi.getCategoryCarousel(categoryId),
      ]);

      if (cancelled) return;

      if (catRes.error) {
        setError(catRes.error);
        setCategory(null);
      } else {
        setCategory(catRes.data ?? null);
      }

      if (supRes.error) {
        setError(prev => prev ?? supRes.error!);
        setSuppliers([]);
      } else {
        setSuppliers(supRes.data ?? []);
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter(
      s =>
        s.title.toLowerCase().includes(q) ||
        (s.desc && s.desc.toLowerCase().includes(q)),
    );
  }, [suppliers, search]);

  const skeletonRows = useMemo(() => [0, 1, 2, 3], []);

  const renderSupplier: ListRenderItem<SupplierCarouselItem> = useCallback(
    ({ item }) => (
      <View style={{ width: cardWidth }}>
        <SupplierCard supplier={item} />
      </View>
    ),
    [cardWidth],
  );

  const renderSkeleton: ListRenderItem<number> = useCallback(
    () => (
      <View style={{ width: cardWidth }}>
        <SupplierRowSkeleton width={cardWidth} />
      </View>
    ),
    [cardWidth],
  );

  if (!categoryId) {
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
          icon={<Store size={36} color={Colors.mutedForeground} />}
          title="Invalid category"
          description="This link is missing a category id."
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: insets.top,
      }}
    >
      <View style={{ flex: 1, paddingHorizontal: H_PADDING }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: Colors.muted,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <ArrowLeft size={22} color={Colors.foreground} />
          </Pressable>
        </View>

        <PageHeader
          title={loading ? 'Loading…' : category?.title ?? 'Category'}
          description={
            category
              ? `${Object.keys(category.users || {}).length} supplier${
                  Object.keys(category.users || {}).length !== 1 ? 's' : ''
                } in this category`
              : undefined
          }
        />

        <View style={{ marginBottom: 16 }}>
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
              placeholder="Search suppliers..."
              value={search}
              onChangeText={setSearch}
              style={{ paddingLeft: 40 }}
              returnKeyType="search"
            />
          </View>
        </View>

        {error && !loading && !category ? (
          <EmptyState
            icon={<Store size={36} color={Colors.mutedForeground} />}
            title="Something went wrong"
            description={error}
          />
        ) : null}

        {loading ? (
          <FlatList
            data={skeletonRows}
            keyExtractor={i => `sk-${i}`}
            renderItem={renderSkeleton}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={36} color={Colors.mutedForeground} />}
            title={suppliers.length === 0 ? 'No suppliers' : 'No matches'}
            description={
              suppliers.length === 0
                ? 'No suppliers are listed in this category yet.'
                : 'Try a different search term.'
            }
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.link}
            renderItem={renderSupplier}
            contentContainerStyle={{ paddingBottom: insets.bottom + 24, gap: GAP }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
