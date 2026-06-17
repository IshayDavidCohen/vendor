import type {
  ApiResponse,
  Business,
  BusinessCreateData,
  Category,
  CategoryCreateData,
  Handshake,
  HandshakeCreateData,
  Item,
  ItemCreateData,
  Order,
  OrderCreateData,
  OrderStatus,
  Supplier,
  SupplierCarouselItem,
  SupplierCreateData,
} from '@/types';

import {
  mockCategories,
  mockSuppliers,
  mockItems,
  mockHandshakes,
  mockOrders,
  mockOrderHistory,
  mockBusinesses,
  getSupplierCarousel,
  getSupplierItems,
  getSupplierById,
  getBusinessById,
  getItemById,
  addOrder,
  updateOrderStatus,
  archiveOrder,
  updateHandshakeStatus,
  addHandshake,
  addItem,
  updateItem,
  deleteItem,
  updateBusiness,
  updateSupplier,
  setCustomPrice,
  deleteCustomPrice,
} from '@/mocks/data';

const USE_MOCK_DATA = true;

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export interface PaginatedOrders {
  items: Order[];
  next_cursor: string | null;
  has_more: boolean;
  total: number;
}

interface HistoryPageParams {
  cursor?: string | null;
  limit?: number;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: (errorData as Record<string, string>).message || `Error: ${response.status}` };
    }

    if (response.status === 204) {
      return { data: undefined as T };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ========================
// Business endpoints
// ========================
export const businessApi = {
  create: async (data: BusinessCreateData): Promise<ApiResponse<{ id: string }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { data: { id: 'bus-new-' + Date.now() } };
    }
    return apiRequest<{ id: string }>('/api/v1/business/create/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  get: async (businessId: string): Promise<ApiResponse<Business>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const business = getBusinessById(businessId);
      if (business) return { data: business };
      return { error: 'Business not found' };
    }
    return apiRequest<Business>(`/api/v1/business/get/${businessId}`);
  },

  update: async (
    businessId: string,
    data: Partial<BusinessCreateData>,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      updateBusiness(businessId, data as Partial<Business>);
      return { data: { success: true } };
    }
    return apiRequest<{ success: boolean }>(`/api/v1/business/update/${businessId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (businessId: string): Promise<ApiResponse<void>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { data: undefined };
    }
    return apiRequest<void>(`/api/v1/business/delete/${businessId}`, {
      method: 'DELETE',
    });
  },
};

// ========================
// Supplier endpoints
// ========================
export const supplierApi = {
  create: async (
    data: SupplierCreateData,
  ): Promise<ApiResponse<{ id: string; category_validity_map: Record<string, boolean> }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { data: { id: 'sup-new-' + Date.now(), category_validity_map: {} } };
    }
    return apiRequest<{ id: string; category_validity_map: Record<string, boolean> }>(
      '/api/v1/supplier/create/profile',
      { method: 'POST', body: JSON.stringify(data) },
    );
  },

  get: async (supplierId: string): Promise<ApiResponse<Supplier>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const supplier = getSupplierById(supplierId);
      if (supplier) return { data: supplier };
      return { error: 'Supplier not found' };
    }
    return apiRequest<Supplier>(`/api/v1/supplier/get/${supplierId}`);
  },

  getCategoryCarousel: async (
    categoryId: string,
  ): Promise<ApiResponse<SupplierCarouselItem[]>> => {
    if (USE_MOCK_DATA) {
      await delay(250);
      return { data: getSupplierCarousel(categoryId) };
    }
    return apiRequest<SupplierCarouselItem[]>(
      `/api/v1/supplier/get/category_carousel/${categoryId}`,
    );
  },

  getItems: async (
    supplierId: string,
    businessId?: string,
  ): Promise<ApiResponse<Item[]>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { data: getSupplierItems(supplierId) };
    }
    return apiRequest<Item[]>(
      `/api/v1/supplier/get/${supplierId}/items${businessId ? `?business_id=${businessId}` : ''}`,
    );
  },

  createItem: async (data: ItemCreateData): Promise<ApiResponse<{ id: string }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const newId = 'item-new-' + Date.now();
      addItem({
        ...data,
        id: newId,
        custom_prices: {},
        stock_quantity: data.stock_quantity ?? 0,
        out_of_stock: data.out_of_stock ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { data: { id: newId } };
    }
    return apiRequest<{ id: string }>('/api/v1/supplier/create/item', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteItem: async (itemId: string): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      deleteItem(itemId);
      return { data: { success: true } };
    }
    return apiRequest<{ success: boolean }>(`/api/v1/supplier/delete/item/${itemId}`, {
      method: 'DELETE',
    });
  },

  update: async (
    supplierId: string,
    data: Partial<SupplierCreateData>,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      updateSupplier(supplierId, data as Partial<Supplier>);
      return { data: { success: true } };
    }
    return apiRequest<{ success: boolean }>(`/api/v1/supplier/update/${supplierId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (supplierId: string): Promise<ApiResponse<void>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { data: undefined };
    }
    return apiRequest<void>(`/api/v1/supplier/delete/${supplierId}`, {
      method: 'DELETE',
    });
  },
};

// ========================
// Items endpoints
// ========================
export const itemsApi = {
  get: async (itemId: string): Promise<ApiResponse<Item>> => {
    if (USE_MOCK_DATA) {
      await delay(150);
      const item = getItemById(itemId);
      if (item) return { data: item };
      return { error: 'Item not found' };
    }
    return apiRequest<Item>(`/api/v1/items/${itemId}`);
  },

  update: async (
    itemId: string,
    data: Partial<ItemCreateData>,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      updateItem(itemId, data as Partial<Item>);
      return { data: { success: true } };
    }
    return apiRequest<{ success: boolean }>(`/api/v1/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  setCustomPrice: async (
    itemId: string,
    businessId: string,
    price: number,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      setCustomPrice(itemId, businessId, price);
      return { data: { success: true } };
    }
    return apiRequest<{ success: boolean }>(
      `/api/v1/items/${itemId}/custom-price/${businessId}?price=${price}`,
      { method: 'PUT' },
    );
  },

  deleteCustomPrice: async (
    itemId: string,
    businessId: string,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      deleteCustomPrice(itemId, businessId);
      return { data: { success: true } };
    }
    return apiRequest<{ success: boolean }>(
      `/api/v1/items/${itemId}/custom-price/${businessId}`,
      { method: 'DELETE' },
    );
  },

  updateInventory: async (
    itemId: string,
    data: { stock_quantity?: number; out_of_stock?: boolean },
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      updateItem(itemId, data as Partial<Item>);
      return { data: { success: true } };
    }
    return apiRequest<{ success: boolean }>(`/api/v1/items/${itemId}/inventory`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// ========================
// Categories endpoints
// ========================
export const categoriesApi = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { data: mockCategories() };
    }
    return apiRequest<Category[]>('/api/v1/categories');
  },

  get: async (categoryId: string): Promise<ApiResponse<Category>> => {
    if (USE_MOCK_DATA) {
      await delay(150);
      const category = mockCategories().find(c => c.oid === categoryId);
      if (category) return { data: category };
      return { error: 'Category not found' };
    }
    return apiRequest<Category>(`/api/v1/categories/${categoryId}`);
  },

  create: async (data: CategoryCreateData): Promise<ApiResponse<{ id: string }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { data: { id: 'cat-new-' + Date.now() } };
    }
    return apiRequest<{ id: string }>('/api/v1/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: async (categoryId: string): Promise<ApiResponse<void>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { data: undefined };
    }
    return apiRequest<void>(`/api/v1/categories/${categoryId}`, {
      method: 'DELETE',
    });
  },
};

// ========================
// Handshake endpoints
// ========================
export const handshakeApi = {
  create: async (
    data: HandshakeCreateData,
  ): Promise<ApiResponse<{ id: string; created: boolean; existed: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const newId = 'hs-new-' + Date.now();
      addHandshake({
        ...data,
        id: newId,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { data: { id: newId, created: true, existed: false } };
    }
    return apiRequest<{ id: string; created: boolean; existed: boolean }>(
      '/api/v1/handshake/create',
      { method: 'POST', body: JSON.stringify(data) },
    );
  },

  get: async (handshakeId: string): Promise<ApiResponse<Handshake>> => {
    if (USE_MOCK_DATA) {
      await delay(150);
      const handshake = mockHandshakes().find(h => h.id === handshakeId);
      if (handshake) return { data: handshake };
      return { error: 'Handshake not found' };
    }
    return apiRequest<Handshake>(`/api/v1/handshake/get/${handshakeId}`);
  },

  getUserHandshakes: async (
    userType: 'business' | 'supplier',
    userId: string,
  ): Promise<ApiResponse<Handshake[]>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const all = mockHandshakes().filter(
        h =>
          (h.sender_type === userType && h.sender_id === userId) ||
          (h.recipient_type === userType && h.recipient_id === userId),
      );
      return { data: all };
    }
    return apiRequest<Handshake[]>(
      `/api/v1/handshake/get/user_handshakes/${userType}/${userId}`,
    );
  },

  respond: async (
    userId: string,
    handshakeId: string,
    response: 'accepted' | 'rejected',
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      updateHandshakeStatus(handshakeId, response);
      return { data: { success: true } };
    }
    return apiRequest<{ success: boolean }>(
      `/api/v1/handshake/respond/${userId}/${handshakeId}/${response}`,
      { method: 'POST' },
    );
  },

  acknowledge: async (
    userId: string,
    handshakeId: string,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      updateHandshakeStatus(handshakeId, 'acknowledged');
      return { data: { success: true } };
    }
    return apiRequest<{ success: boolean }>(
      `/api/v1/handshake/ack/${userId}/${handshakeId}/acknowledged`,
    );
  },

  close: async (handshakeId: string): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { data: { success: true } };
    }
    return apiRequest<{ success: boolean }>(`/api/v1/handshake/close/${handshakeId}`, {
      method: 'DELETE',
    });
  },
};

// ========================
// Order endpoints
// ========================
export const ordersApi = {
  create: async (
    data: OrderCreateData,
  ): Promise<
    ApiResponse<true | { created: Record<string, string>; failed: Record<string, string> }>
  > => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const now = new Date().toISOString();
      const created: Record<string, string> = {};

      for (const [supplierId, itemMap] of Object.entries(data.orders)) {
        const orderedItems = Object.entries(itemMap).map(([itemId, qty]) => {
          const item = getItemById(itemId);
          const priceAtOrder =
            item?.custom_prices[data.business] ?? item?.base_price ?? 0;
          return {
            item_id: itemId,
            quantity: qty,
            base_price: item?.base_price ?? 0,
            price_at_order: priceAtOrder,
            total_price_for_item: priceAtOrder * qty,
          };
        });

        const totalPrice = orderedItems.reduce(
          (sum, oi) => sum + oi.total_price_for_item,
          0,
        );

        const newId = 'ord-new-' + Date.now() + '-' + supplierId;
        addOrder({
          id: newId,
          supplier_id: supplierId,
          business_id: data.business,
          ordered_items: orderedItems,
          total_price: totalPrice,
          status: 'pending',
          created_at: now,
          updated_at: now,
        });
        created[supplierId] = newId;
      }

      return { data: { created, failed: {} } };
    }
    return apiRequest<
      true | { created: Record<string, string>; failed: Record<string, string> }
    >('/api/v1/orders/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getActive: async (orderId: string): Promise<ApiResponse<Order>> => {
    if (USE_MOCK_DATA) {
      await delay(150);
      const order = mockOrders().find(o => o.id === orderId);
      if (order) return { data: order };
      return { error: 'Order not found' };
    }
    return apiRequest<Order>(`/api/v1/orders/active/${orderId}`);
  },

  getHistory: async (orderId: string): Promise<ApiResponse<Order>> => {
    if (USE_MOCK_DATA) {
      await delay(150);
      const order = mockOrderHistory().find(o => o.id === orderId);
      if (order) return { data: order };
      return { error: 'Order not found' };
    }
    return apiRequest<Order>(`/api/v1/orders/history/${orderId}`);
  },

  updateStatus: async (
    orderId: string,
    status: OrderStatus,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      updateOrderStatus(orderId, status);
      return { data: { success: true } };
    }
    return apiRequest<{ success: boolean }>(`/api/v1/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getBusinessOrders: async (businessId: string, opts?: { since?: string }): Promise<ApiResponse<Order[]>> => {
    if (USE_MOCK_DATA) {
      await delay(250);

      const sinceMs = opts?.since ? new Date(opts.since).getTime() : Date.now() - 7 * 24 * 60 * 60 * 1000;
      const active = mockOrders().filter(o => o.business_id === businessId);
      const recentHistory = mockOrderHistory().filter(o => o.business_id === businessId && new Date(o.updated_at).getTime() >= sinceMs);
      
      return { data: [...active, ...recentHistory] };
    }

    const qs = opts?.since ? `?since=${encodeURIComponent(opts.since)}` : '';
    return apiRequest<Order[]>(`/api/v1/orders/business/${businessId}${qs}`);
  },

  getSupplierOrders: async (supplierId: string, opts?: { since?: string }): Promise<ApiResponse<Order[]>> => {
    if (USE_MOCK_DATA) {
      await delay(250);
      
      const sinceMs = opts?.since ? new Date(opts.since).getTime() : Date.now() - 7 * 24 * 60 * 60 * 1000;
      const active = mockOrders().filter(o => o.supplier_id === supplierId);
      const recentHistory = mockOrderHistory().filter(o => o.supplier_id === supplierId && new Date(o.updated_at).getTime() >= sinceMs);
      
      return { data: [...active, ...recentHistory] };
    }
    
    const qs = opts?.since ? `?since=${encodeURIComponent(opts.since)}` : '';
    return apiRequest<Order[]>(`/api/v1/orders/supplier/${supplierId}${qs}`);
  },

  archive: async (orderId: string): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      archiveOrder(orderId);
      return { data: { success: true } };
    }
    return apiRequest<{ success: boolean }>(`/api/v1/orders/${orderId}/archive`, {
      method: 'POST',
    });
  },

  getBusinessHistory: async (businessId: string, { cursor, limit = 20 }: HistoryPageParams = {}): Promise<ApiResponse<PaginatedOrders>> => {
  if (USE_MOCK_DATA) {
    await delay(200);
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    const all = mockOrderHistory()
      .filter(o => o.business_id === businessId)
      .filter(o => new Date(o.updated_at).getTime() < sevenDaysAgo)
      .sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
    
    const total = all.length;

    const beforeMs = cursor ? new Date(cursor).getTime() : Infinity;

    const page = all.filter(o => new Date(o.updated_at).getTime() < beforeMs).slice(0, limit + 1);
    const has_more = page.length > limit;
    const items = page.slice(0, limit);
    const next_cursor = has_more && items.length > 0 ? items[items.length - 1].updated_at : null;
    
    return { data: { items, next_cursor, has_more, total } };
  }
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  params.set('limit', String(limit));
  
  return apiRequest<PaginatedOrders>(`/api/v1/orders/business/${businessId}/history?${params}`);
},

getSupplierHistory: async (supplierId: string, { cursor, limit = 20 }: HistoryPageParams = {}): Promise<ApiResponse<PaginatedOrders>> => {
  if (USE_MOCK_DATA) {
    await delay(200);
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    const all = mockOrderHistory()
      .filter(o => o.supplier_id === supplierId)
      .filter(o => new Date(o.updated_at).getTime() < sevenDaysAgo)
      .sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
    
    const total = all.length;
    const beforeMs = cursor ? new Date(cursor).getTime() : Infinity;
    const page = all.filter(o => new Date(o.updated_at).getTime() < beforeMs).slice(0, limit + 1);
    
    const has_more = page.length > limit;
    const items = page.slice(0, limit);
    
    const next_cursor = has_more && items.length > 0 ? items[items.length - 1].updated_at : null;
    
    return { data: { items, next_cursor, has_more, total } };
  }
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  params.set('limit', String(limit));
  return apiRequest<PaginatedOrders>(`/api/v1/orders/supplier/${supplierId}/history?${params}`);
},

};
