import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  useWindowDimensions,
  type ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Grid3x3 } from 'lucide-react-native';
import { categoriesApi } from '@/services/api';
import type { Category } from '@/types';
import { CategoryCard } from '@/components/CategoryCard';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Colors } from '@/constants/theme';

const GAP = 12;
const H_PADDING = 16;

function CategorySkeletonCard({ width }: { width: number }) {
  return (
    <View style={{ width, marginBottom: GAP }}>
      <Skeleton height={100} borderRadius={12} width="100%" />
      <View style={{ marginTop: 12, gap: 8 }}>
        <Skeleton height={14} width="75%" borderRadius={6} />
        <Skeleton height={12} width="45%" borderRadius={6} />
      </View>
    </View>
  );
}

export default function CategoriesBrowseScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = (width - H_PADDING * 2 - GAP) / 2;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await categoriesApi.getAll();
      if (cancelled) return;
      if (res.error) {
        setError(res.error);
        setCategories([]);
      } else {
        setCategories(res.data ?? []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      c =>
        c.title.toLowerCase().includes(q) ||
        c.oid.toLowerCase().includes(q),
    );
  }, [categories, search]);

  const skeletonData = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);

  const renderCategory: ListRenderItem<Category> = useCallback(
    ({ item }) => (
      <View style={{ width: cardWidth }}>
        <CategoryCard category={item} />
      </View>
    ),
    [cardWidth],
  );

  const renderSkeleton: ListRenderItem<number> = useCallback(
    ({ item }) => (
      <View style={{ width: cardWidth }}>
        <CategorySkeletonCard width={cardWidth} />
      </View>
    ),
    [cardWidth],
  );

  const keyExtractor = useCallback((item: Category | number) => {
    if (typeof item === 'number') return `sk-${item}`;
    return item.oid;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: insets.top,
      }}
    >
      <View style={{ flex: 1, paddingHorizontal: H_PADDING }}>
        <PageHeader
          title="Categories"
          description="Browse suppliers by product category"
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: Colors.secondary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Grid3x3 size={22} color={Colors.primary} />
          </View>
        </PageHeader>

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
              placeholder="Search categories..."
              value={search}
              onChangeText={setSearch}
              style={{ paddingLeft: 40 }}
              returnKeyType="search"
            />
          </View>
        </View>

        {error && !loading ? (
          <EmptyState
            icon={<Grid3x3 size={36} color={Colors.mutedForeground} />}
            title="Could not load categories"
            description={error}
          />
        ) : null}

        {loading ? (
          <FlatList
            data={skeletonData}
            keyExtractor={keyExtractor}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: GAP, marginBottom: 0 }}
            contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
            renderItem={renderSkeleton}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={36} color={Colors.mutedForeground} />}
            title={categories.length === 0 ? 'No categories yet' : 'No matches'}
            description={
              categories.length === 0
                ? 'Check back later for new supplier categories.'
                : 'Try a different search term.'
            }
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={keyExtractor}
            numColumns={2}
            columnWrapperStyle={{ gap: GAP }}
            contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
            renderItem={renderCategory}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
