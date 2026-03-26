import { useState } from 'react';
import { View, Text } from 'react-native';
import { Clock, Check, X, Building2, Truck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/StatusBadge';
import { handshakeApi } from '@/services/api';
import { Colors } from '@/constants/theme';
import type { Handshake } from '@/types';

interface HandshakeCardProps {
  handshake: Handshake;
  role: 'business' | 'supplier';
  platformId: string;
  onUpdate: () => void;
}

export function HandshakeCard({
  handshake,
  role,
  platformId,
  onUpdate,
}: HandshakeCardProps) {
  const [loading, setLoading] = useState(false);

  const isIncoming = handshake.recipient_id === platformId;
  const isOutgoing = handshake.sender_id === platformId;
  const partnerType = isIncoming ? handshake.sender_type : handshake.recipient_type;
  const partnerId = isIncoming ? handshake.sender_id : handshake.recipient_id;

  const handleRespond = async (response: 'accepted' | 'rejected') => {
    setLoading(true);
    try {
      const { error } = await handshakeApi.respond(platformId, handshake.id, response);
      if (error) {
        Toast.show({ type: 'error', text1: 'Failed to respond', text2: error });
        return;
      }
      Toast.show({ type: 'success', text1: `Request ${response}` });
      onUpdate();
    } catch {
      Toast.show({ type: 'error', text1: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async () => {
    setLoading(true);
    try {
      const { error } = await handshakeApi.acknowledge(platformId, handshake.id);
      if (error) {
        Toast.show({ type: 'error', text1: 'Failed to acknowledge', text2: error });
        return;
      }
      Toast.show({ type: 'success', text1: 'Acknowledged' });
      onUpdate();
    } catch {
      Toast.show({ type: 'error', text1: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const dateStr = new Date(handshake.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const PartnerIcon = partnerType === 'business' ? Building2 : Truck;

  return (
    <Card>
      <CardContent style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: `${Colors.primary}18`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PartnerIcon size={24} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: Colors.foreground,
                  textTransform: 'capitalize',
                }}
              >
                {partnerType}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.mutedForeground,
                }}
              >
                ID: {partnerId.slice(-8)}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Clock size={11} color={Colors.mutedForeground} />
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: 'PlusJakartaSans',
                    color: Colors.mutedForeground,
                  }}
                >
                  {dateStr}
                </Text>
              </View>
            </View>
          </View>
          <StatusBadge status={handshake.status} />
        </View>

        {/* Direction indicator */}
        <View
          style={{
            marginTop: 12,
            backgroundColor: Colors.muted,
            borderRadius: 8,
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
            }}
          >
            {isIncoming
              ? `This ${partnerType} wants to connect with you`
              : `You sent a request to this ${partnerType}`}
          </Text>
        </View>

        {/* Actions */}
        {isIncoming && handshake.status === 'pending' && (
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <Button
              size="sm"
              onPress={() => handleRespond('accepted')}
              disabled={loading}
              style={{ backgroundColor: '#059669', flex: 1 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Check size={14} color="#fff" />
                <Text style={{ color: '#fff', fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 13 }}>
                  Accept
                </Text>
              </View>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onPress={() => handleRespond('rejected')}
              disabled={loading}
              style={{ flex: 1 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <X size={14} color="#fff" />
                <Text style={{ color: '#fff', fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 13 }}>
                  Reject
                </Text>
              </View>
            </Button>
          </View>
        )}

        {isOutgoing &&
          (handshake.status === 'accepted' || handshake.status === 'rejected') && (
            <View style={{ marginTop: 12 }}>
              <Button
                variant="outline"
                size="sm"
                onPress={handleAcknowledge}
                disabled={loading}
                loading={loading}
              >
                Acknowledge
              </Button>
            </View>
          )}
      </CardContent>
    </Card>
  );
}
