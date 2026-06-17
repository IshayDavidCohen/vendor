import { View, Text, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import type { Order, OrderStatus } from '@/types';

interface PipelineStage {
  key: OrderStatus;
  label: string;
  bg: string;
  text: string;
  /** The tab value in orders.tsx to navigate to */
  ordersTab: string;
}

const BUSINESS_STAGES: PipelineStage[] = [
  { key: 'pending', label: 'Pending', bg: '#F3E8FF', text: '#7C3AED', ordersTab: 'pending' },
  { key: 'accepted', label: 'Accepted', bg: '#DBEAFE', text: '#1E40AF', ordersTab: 'in-progress' },
  { key: 'delivering', label: 'Delivering', bg: '#FEF3C7', text: '#92400E', ordersTab: 'in-progress' },
  { key: 'arrived', label: 'Arrived', bg: '#D1FAE5', text: '#065F46', ordersTab: 'completed' },
];

const SUPPLIER_STAGES: PipelineStage[] = [
  { key: 'pending', label: 'To accept', bg: '#FEF3C7', text: '#92400E', ordersTab: 'pending' },
  { key: 'accepted', label: 'Accepted', bg: '#DBEAFE', text: '#1E40AF', ordersTab: 'in-progress' },
  { key: 'delivering', label: 'In transit', bg: '#F3E8FF', text: '#7C3AED', ordersTab: 'in-progress' },
  { key: 'arrived', label: 'Delivered', bg: '#D1FAE5', text: '#065F46', ordersTab: 'completed' },
];

interface OrderPipelineProps {
  orders: Order[];
  role: 'business' | 'supplier';
}

function PipelineCell({
  stage,
  count,
  onPress,
}: {
  stage: PipelineStage;
  count: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4,
        borderRadius: 10,
        backgroundColor: stage.bg,
        opacity: pressed ? 0.7 : 1,
        ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
      })}
    >
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'DMSans-Bold',
          color: stage.text,
        }}
      >
        {count}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          fontSize: 11,
          fontFamily: 'PlusJakartaSans-SemiBold',
          color: stage.text,
          marginTop: 2,
          textAlign: 'center',
        }}
      >
        {stage.label}
      </Text>
    </Pressable>
  );
}

export function OrderPipeline({ orders, role }: OrderPipelineProps) {
  const router = useRouter();
  const stages = role === 'supplier' ? SUPPLIER_STAGES : BUSINESS_STAGES;

  const counts: Record<string, number> = {};
  for (const order of orders) {
    counts[order.status] = (counts[order.status] ?? 0) + 1;
  }

  const navigateToTab = (tab: string) => {
    // _t forces expo-router to treat each navigation as unique,
    // even when tapping the same pipeline cell twice in a row.
    router.push({ pathname: '/(app)/orders', params: { tab, _t: String(Date.now()) } });
  };

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <PipelineCell stage={stages[0]} count={counts[stages[0].key] ?? 0} onPress={() => navigateToTab(stages[0].ordersTab)} />
        <PipelineCell stage={stages[1]} count={counts[stages[1].key] ?? 0} onPress={() => navigateToTab(stages[1].ordersTab)} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <PipelineCell stage={stages[2]} count={counts[stages[2].key] ?? 0} onPress={() => navigateToTab(stages[2].ordersTab)} />
        <PipelineCell stage={stages[3]} count={counts[stages[3].key] ?? 0} onPress={() => navigateToTab(stages[3].ordersTab)} />
      </View>
    </View>
  );
}