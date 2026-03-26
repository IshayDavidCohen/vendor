import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  DollarSign,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { confirm } from '@/utils/confirm';
import { useAuthStore } from '@/stores/auth.store';
import { supplierApi, itemsApi, categoriesApi } from '@/services/api';
import type { Item, Category, Supplier } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Colors } from '@/constants/theme';

interface ItemFormData {
  name: string;
  category: string;
  image: string;
  desc: string;
  base_price: string;
  unit: string;
  currency: string;
}

const defaultFormData: ItemFormData = {
  name: '',
  category: '',
  image: '',
  desc: '',
  base_price: '',
  unit: 'unit',
  currency: 'USD',
};

const CURRENCY_OPTIONS = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
  { label: 'ILS', value: 'ILS' },
];

function ItemSkeletonTile({ width }: { width: number }) {
  return (
    <Card style={{ width, overflow: 'hidden' }}>
      <Skeleton width={width} height={140} borderRadius={0} />
      <CardContent style={{ padding: 12 }}>
        <Skeleton width={width * 0.55} height={16} borderRadius={6} />
        <Skeleton
          width={width * 0.9}
          height={12}
          borderRadius={6}
          style={{ marginTop: 8 }}
        />
        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Skeleton width={56} height={20} borderRadius={6} />
          <Skeleton width={72} height={22} borderRadius={8} />
        </View>
      </CardContent>
    </Card>
  );
}

export default function ItemsScreen() {
  const role = useAuthStore(s => s.role);
  const platformId = useAuthStore(s => s.platformId);
  const profile = useAuthStore(s => s.profile);

  const { width } = useWindowDimensions();
  const horizontalPad = 16;
  const colGap = 12;
  const contentW = width - horizontalPad * 2;
  const tileW = (contentW - colGap) / 2;

  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<ItemFormData>(defaultFormData);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categoryOptions = useMemo(
    () => categories.map(c => ({ label: c.title, value: c.oid })),
    [categories],
  );

  const fetchItems = useCallback(async () => {
    if (!platformId || role !== 'supplier') {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supplierApi.getItems(platformId);
      if (error) {
        Toast.show({ type: 'error', text1: 'Failed to load items', text2: error });
        return;
      }
      if (data) setItems(data);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to load items' });
    } finally {
      setLoading(false);
    }
  }, [platformId, role]);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await categoriesApi.getAll();
    if (error) {
      Toast.show({ type: 'error', text1: 'Failed to load categories', text2: error });
      return;
    }
    if (data) setCategories(data);
  }, []);

  useEffect(() => {
    if (role === 'supplier' && platformId) {
      fetchItems();
      fetchCategories();
    } else {
      setLoading(false);
    }
  }, [role, platformId, fetchItems, fetchCategories]);

  const openModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        image: item.image,
        desc: item.desc,
        base_price: item.base_price.toString(),
        unit: item.unit,
        currency: item.currency,
      });
    } else {
      setEditingItem(null);
      setFormData(defaultFormData);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData(defaultFormData);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.base_price.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill in required fields' });
      return;
    }
    const price = parseFloat(formData.base_price);
    if (Number.isNaN(price)) {
      Toast.show({ type: 'error', text1: 'Invalid price' });
      return;
    }
    if (!platformId) return;

    setSaving(true);
    try {
      if (editingItem) {
        const { error } = await itemsApi.update(editingItem.id, {
          name: formData.name,
          category: formData.category,
          image: formData.image,
          desc: formData.desc,
          base_price: price,
          unit: formData.unit,
          currency: formData.currency,
        });
        if (error) {
          Toast.show({ type: 'error', text1: 'Failed to update item', text2: error });
          return;
        }
        Toast.show({ type: 'success', text1: 'Item updated' });
      } else {
        const { error } = await supplierApi.createItem({
          supplier_id: platformId,
          name: formData.name,
          category: formData.category,
          image: formData.image,
          desc: formData.desc,
          base_price: price,
          unit: formData.unit,
          currency: formData.currency,
        });
        if (error) {
          Toast.show({ type: 'error', text1: 'Failed to create item', text2: error });
          return;
        }
        Toast.show({ type: 'success', text1: 'Item created' });
      }
      closeModal();
      fetchItems();
    } catch {
      Toast.show({ type: 'error', text1: 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const runDelete = async (itemId: string) => {
    setDeletingId(itemId);
    try {
      const { error } = await supplierApi.deleteItem(itemId);
      if (error) {
        Toast.show({ type: 'error', text1: 'Failed to delete item', text2: error });
        return;
      }
      Toast.show({ type: 'success', text1: 'Item deleted' });
      fetchItems();
    } catch {
      Toast.show({ type: 'error', text1: 'An error occurred' });
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (item: Item) => {
    confirm(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      () => runDelete(item.id),
    );
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  if (role !== 'supplier' || !platformId) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.background }}
        edges={['bottom']}
      >
        <View style={{ flex: 1, paddingHorizontal: horizontalPad, paddingTop: 8 }}>
          <PageHeader
            title="My Items"
            description="Manage your product catalogue"
          />
          <EmptyState
            icon={<Package size={40} color={Colors.mutedForeground} />}
            title="Supplier only"
            description="Switch to a supplier account in Profile (dev tools) to manage items."
          />
        </View>
      </SafeAreaView>
    );
  }

  const supplier = profile as Supplier | null;
  const catalogueDescription = supplier?.company_name
    ? `Manage catalogue for ${supplier.company_name}`
    : 'Manage your product catalogue';

  const ListHeader = (
    <View style={{ gap: 16, marginBottom: 12 }}>
      <PageHeader title="My Items" description={catalogueDescription}>
        <Button onPress={() => openModal()}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Plus size={18} color={Colors.primaryForeground} />
            <Text
              style={{
                color: Colors.primaryForeground,
                fontFamily: 'PlusJakartaSans-SemiBold',
                fontSize: 14,
              }}
            >
              Add Item
            </Text>
          </View>
        </Button>
      </PageHeader>

      <View style={{ position: 'relative' }}>
        <View
          style={{
            position: 'absolute',
            left: 12,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <Search size={18} color={Colors.mutedForeground} />
        </View>
        <Input
          placeholder="Search items..."
          value={search}
          onChangeText={setSearch}
          style={{ paddingLeft: 40 }}
        />
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Item }) => {
    const customCount = Object.keys(item.custom_prices ?? {}).length;
    return (
      <View style={{ width: tileW }}>
        <Card style={{ overflow: 'hidden' }}>
          <View style={{ position: 'relative' }}>
            <View
              style={{
                height: 140,
                backgroundColor: Colors.muted,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <Package size={48} color={Colors.mutedForeground} />
              )}
            </View>
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                flexDirection: 'row',
                gap: 6,
              }}
            >
              <Button size="icon-sm" variant="secondary" onPress={() => openModal(item)}>
                <Edit2 size={16} color={Colors.foreground} />
              </Button>
              <Button
                size="icon-sm"
                variant="destructive"
                onPress={() => confirmDelete(item)}
                disabled={deletingId === item.id}
                loading={deletingId === item.id}
              >
                <Trash2 size={16} color="#fff" />
              </Button>
            </View>
          </View>
          <CardContent style={{ padding: 12 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'PlusJakartaSans-SemiBold',
                color: Colors.foreground,
              }}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'PlusJakartaSans',
                color: Colors.mutedForeground,
                marginTop: 4,
              }}
              numberOfLines={2}
            >
              {item.desc || 'No description'}
            </Text>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'PlusJakartaSans-Bold',
                    color: Colors.primary,
                  }}
                >
                  {item.currency} {item.base_price.toFixed(2)}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: 'PlusJakartaSans',
                    color: Colors.mutedForeground,
                  }}
                >
                  per {item.unit}
                </Text>
              </View>
              {customCount > 0 && (
                <Badge variant="secondary">
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <DollarSign size={12} color={Colors.secondaryForeground} />
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'PlusJakartaSans-Medium',
                        color: Colors.secondaryForeground,
                      }}
                    >
                      {customCount} custom
                    </Text>
                  </View>
                </Badge>
              )}
            </View>
          </CardContent>
        </Card>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.background }}
      edges={['bottom']}
    >
      {loading ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: horizontalPad,
            paddingTop: 8,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          {ListHeader}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: colGap,
            }}
          >
            {[0, 1, 2, 3, 4, 5].map(i => (
              <ItemSkeletonTile key={i} width={tileW} />
            ))}
          </View>
        </ScrollView>
      ) : filteredItems.length === 0 ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: horizontalPad,
            paddingTop: 8,
            paddingBottom: 32,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {ListHeader}
          <EmptyState
            icon={<Package size={40} color={Colors.mutedForeground} />}
            title={search.trim() ? 'No items found' : 'No items yet'}
            description={
              search.trim()
                ? 'Try a different search term'
                : 'Add your first item to start selling'
            }
            action={
              !search.trim() ? (
                <Button onPress={() => openModal()}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Plus size={18} color={Colors.primaryForeground} />
                    <Text
                      style={{
                        color: Colors.primaryForeground,
                        fontFamily: 'PlusJakartaSans-SemiBold',
                        fontSize: 14,
                      }}
                    >
                      Add Item
                    </Text>
                  </View>
                </Button>
              ) : undefined
            }
          />
        </ScrollView>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={it => it.id}
          numColumns={2}
          columnWrapperStyle={{ gap: colGap, marginBottom: colGap }}
          contentContainerStyle={{
            paddingHorizontal: horizontalPad,
            paddingTop: 8,
            paddingBottom: 32,
          }}
          ListHeaderComponent={ListHeader}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}

      <Modal visible={modalOpen} onClose={closeModal} animationType="slide">
        <ModalHeader
          title={editingItem ? 'Edit Item' : 'Add New Item'}
          description={
            editingItem ? 'Update the details of your item' : 'Add a new item to your catalogue'
          }
          onClose={closeModal}
        />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ maxHeight: 480 }}
          nestedScrollEnabled
        >
          <ModalContent style={{ gap: 14 }}>
            <Input
              label="Name *"
              placeholder="Product name"
              value={formData.name}
              onChangeText={v => setFormData(p => ({ ...p, name: v }))}
            />
            <Select
              label="Category"
              placeholder="Select a category"
              options={categoryOptions}
              value={formData.category || undefined}
              onValueChange={v => setFormData(p => ({ ...p, category: v }))}
            />
            <Input
              label="Image URL"
              placeholder="https://example.com/image.png"
              value={formData.image}
              onChangeText={v => setFormData(p => ({ ...p, image: v }))}
            />
            <TextArea
              label="Description"
              placeholder="Describe your product"
              value={formData.desc}
              onChangeText={v => setFormData(p => ({ ...p, desc: v }))}
            />
            <Input
              label="Price *"
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={formData.base_price}
              onChangeText={v => setFormData(p => ({ ...p, base_price: v }))}
            />
            <Select
              label="Currency"
              options={CURRENCY_OPTIONS}
              value={formData.currency}
              onValueChange={v => setFormData(p => ({ ...p, currency: v }))}
            />
            <Input
              label="Unit"
              placeholder="kg, unit, etc."
              value={formData.unit}
              onChangeText={v => setFormData(p => ({ ...p, unit: v }))}
            />
          </ModalContent>
        </ScrollView>
        <ModalFooter>
          <Button variant="outline" onPress={closeModal}>
            Cancel
          </Button>
          <Button onPress={handleSave} loading={saving} disabled={saving}>
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </Modal>
    </SafeAreaView>
  );
}
