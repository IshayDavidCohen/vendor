import { useCallback, useEffect, useRef, useState } from 'react';
import { ordersApi } from '@/services/api';
import type { PaginatedOrders } from '@/services/api';
import type { Order } from '@/types';

const PAGE_SIZE = 20;

type Role = 'business' | 'supplier';

export function usePaginatedOrderHistory(role: Role | null, partyId: string | null) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState<number>(0);

    const cursorRef = useRef<string | null>(null);
    const inflightRef = useRef(false);

    const fetcher = useCallback((cursor: string | null) => {
        if (!role || !partyId) {
            return Promise.resolve<{ data?: PaginatedOrders; error?: string }>({});
        }
        return role === 'business'
            ? ordersApi.getBusinessHistory(partyId, { cursor, limit: PAGE_SIZE })
            : ordersApi.getSupplierHistory(partyId, { cursor, limit: PAGE_SIZE });
        },
        [role, partyId],
    );

    const loadInitial = useCallback(async () => {
        if (inflightRef.current) return;
        inflightRef.current = true;

        setLoading(true);
        setError(null);

        cursorRef.current = null;
        const { data, error: err } = await fetcher(null);
        
        if (err) setError(err);
        
        if (data) {
            setOrders(data.items);
            cursorRef.current = data.next_cursor;
            setHasMore(data.has_more);
        if (data.total != null && data.total >= 0) setTotal(data.total);
        } else {
            setOrders([]);
            setHasMore(false);
        }
            setLoading(false);
            inflightRef.current = false;
    }, [fetcher]);

    const loadMore = useCallback(async () => {
        if (inflightRef.current || !hasMore) return;
        inflightRef.current = true;
        const { data, error: err } = await fetcher(cursorRef.current);
        if (err) setError(err);
        
        if (data) {
            setOrders(prev => [...prev, ...data.items]);
            cursorRef.current = data.next_cursor;
            setHasMore(data.has_more);
        }
        inflightRef.current = false;

    }, [fetcher, hasMore]);

    const refresh = useCallback(async () => {
        if (inflightRef.current) return;
        setRefreshing(true);
        await loadInitial();
        setRefreshing(false);
    }, [loadInitial]);

    useEffect(() => {
        loadInitial();
    }, [loadInitial]);

    return { orders, loading, refreshing, error, hasMore, total, loadMore, refresh };
}