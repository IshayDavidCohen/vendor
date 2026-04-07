import { View, Text, Pressable } from 'react-native';
import { Clock } from 'lucide-react-native';
import { StatusBadge } from '@/components/StatusBadge';
import { Colors } from '@/constants/theme';
import type { Order } from '@/types';

interface OrderMiniItemProps {
  order: Order;
  supplierLabel?: string;
  onPress?: () => void;
}

export function OrderMiniItem({ order, supplierLabel, onPress }: OrderMiniItemProps) {
  const dateStr = new Date(order.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 9,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: Colors.status[order.status]?.fg ?? Colors.primary,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'DMSans-Bold',
            color: Colors.foreground,
          }}
        >
          #{order.id.slice(-5)}
        </Text>
        {supplierLabel && (
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
            }}
            numberOfLines={1}
          >
            {supplierLabel}
          </Text>
        )}
      </View>
      <Text
        style={{
          fontSize: 13,
          fontFamily: 'DMSans-Bold',
          color: Colors.foreground,
        }}
      >
        ${order.total_price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>
      <StatusBadge status={order.status} />
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}
