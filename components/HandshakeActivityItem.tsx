import { View, Text } from 'react-native';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { StatusBadge } from '@/components/StatusBadge';
import { Colors } from '@/constants/theme';
import type { Handshake } from '@/types';

interface HandshakeActivityItemProps {
  handshake: Handshake;
  platformId: string;
}

export function HandshakeActivityItem({
  handshake,
  platformId,
}: HandshakeActivityItemProps) {
  const isOutgoing = handshake.sender_id === platformId;
  const partnerId = isOutgoing ? handshake.recipient_id : handshake.sender_id;

  const dateStr = new Date(handshake.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: isOutgoing ? `${Colors.primary}18` : '#D1FAE510',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isOutgoing ? (
          <ArrowUpRight size={14} color={Colors.primary} />
        ) : (
          <ArrowDownLeft size={14} color={Colors.status.accepted} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'PlusJakartaSans-SemiBold',
            color: Colors.foreground,
          }}
          numberOfLines={1}
        >
          {partnerId}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'PlusJakartaSans',
            color: Colors.mutedForeground,
          }}
        >
          {isOutgoing ? 'You sent a request' : 'Wants to connect'}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 2 }}>
        <StatusBadge status={handshake.status} />
        <Text
          style={{
            fontSize: 10,
            fontFamily: 'PlusJakartaSans',
            color: Colors.mutedForeground,
          }}
        >
          {dateStr}
        </Text>
      </View>
    </View>
  );
}
