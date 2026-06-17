// hooks/useCounterparties.ts
import { useEffect, useMemo, useState } from 'react';
import { businessApi, supplierApi } from '@/services/api';
import type { Order } from '@/types';
import type { OrderCardCounterparty } from '@/components/OrderCard';

/**
 * Resolves counterparty info for a set of orders.
 * If viewer is a 'business', counterparty is the supplier (order.supplier_id).
 * If viewer is a 'supplier', counterparty is the business (order.business_id).
 *
 * Returns a stable map keyed by order.id for O(1) lookup at render time.
 */
export function useCounterparties(
  orders: Order[],
  role: 'business' | 'supplier',
): Record<string, OrderCardCounterparty | undefined> {
  const [cache, setCache] = useState<Record<string, OrderCardCounterparty>>({});

  const ids = useMemo(() => {
    const set = new Set<string>();
    for (const o of orders) {
      set.add(role === 'business' ? o.supplier_id : o.business_id);
    }
    return Array.from(set);
  }, [orders, role]);

  useEffect(() => {
    let cancelled = false;
    const missing = ids.filter(id => !cache[id]);
    if (missing.length === 0) return;

    (async () => {
      const fetched: Record<string, OrderCardCounterparty> = {};
      await Promise.all(
        missing.map(async id => {
          const { data } =
            role === 'business'
              ? await supplierApi.get(id)
              : await businessApi.get(id);
          if (data) fetched[id] = { name: data.company_name, icon: data.icon };
        }),
      );
      if (cancelled || Object.keys(fetched).length === 0) return;
      setCache(prev => ({ ...prev, ...fetched }));
    })();

    return () => { cancelled = true; };
    // Only re-run when the set of ids changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|'), role]);

  return useMemo(() => {
    const out: Record<string, OrderCardCounterparty | undefined> = {};
    for (const o of orders) {
      const id = role === 'business' ? o.supplier_id : o.business_id;
      out[o.id] = cache[id];
    }
    return out;
  }, [orders, role, cache]);
}