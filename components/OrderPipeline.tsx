import { View, Text } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import type { Order, OrderStatus } from '@/types';

interface PipelineStage {
  key: OrderStatus;
  label: string;
  bg: string;
  text: string;
}

const BUSINESS_STAGES: PipelineStage[] = [
  { key: 'pending', label: 'Pending', bg: '#F3E8FF', text: '#7C3AED' },
  { key: 'accepted', label: 'Accepted', bg: '#DBEAFE', text: '#1E40AF' },
  { key: 'delivering', label: 'Delivering', bg: '#FEF3C7', text: '#92400E' },
  { key: 'arrived', label: 'Arrived', bg: '#D1FAE5', text: '#065F46' },
];

const SUPPLIER_STAGES: PipelineStage[] = [
  { key: 'pending', label: 'To accept', bg: '#FEF3C7', text: '#92400E' },
  { key: 'accepted', label: 'Accepted', bg: '#DBEAFE', text: '#1E40AF' },
  { key: 'delivering', label: 'In transit', bg: '#F3E8FF', text: '#7C3AED' },
  { key: 'arrived', label: 'Delivered', bg: '#D1FAE5', text: '#065F46' },
];

interface OrderPipelineProps {
  orders: Order[];
  role: 'business' | 'supplier';
}

export function OrderPipeline({ orders, role }: OrderPipelineProps) {
  const stages = role === 'supplier' ? SUPPLIER_STAGES : BUSINESS_STAGES;

  const counts: Record<string, number> = {};
  for (const order of orders) {
    counts[order.status] = (counts[order.status] ?? 0) + 1;
  }

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {stages.map(stage => (
        <View
          key={stage.key}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 4,
            borderRadius: 10,
            backgroundColor: stage.bg,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'DMSans-Bold',
              color: stage.text,
            }}
          >
            {counts[stage.key] ?? 0}
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: 'PlusJakartaSans-SemiBold',
              color: stage.text,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginTop: 2,
            }}
            numberOfLines={1}
          >
            {stage.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
