import { View, Text, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Lock } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/theme';

// ─── Dev toggle ────────────────────────────────────────────
export const ENABLE_LOCKED_OVERLAY = true;
// ───────────────────────────────────────────────────────────

interface LockedOverlayProps {
  /** White overlay opacity (web + native). Default 0.6 */
  intensity?: number;
  /** Blur: web = CSS px, native = BlurView intensity (0–100). Default 20 */
  blurAmount?: number;
  onRequestHandshake?: () => void;
  handshakeLoading?: boolean;
  handshakeSent?: boolean;
}

export function LockedOverlay({
  intensity = 0.6,
  blurAmount = 20,
  onRequestHandshake,
  handshakeLoading,
  handshakeSent,
}: LockedOverlayProps) {
  if (!ENABLE_LOCKED_OVERLAY) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      {/* Layer 1: Blur */}
      {Platform.OS === 'web' ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
          } as any}
        />
      ) : (
        <BlurView
          intensity={blurAmount}
          tint="light"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}

      {/* Layer 2: White wash */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(255, 255, 255, ${intensity})`,
        }}
      />

      {/* Lock content */}
      <View style={{ alignItems: 'center', gap: 12, padding: 24 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: Colors.muted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lock size={28} color={Colors.mutedForeground} />
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'PlusJakartaSans-SemiBold',
            color: Colors.foreground,
            textAlign: 'center',
          }}
        >
          Connect to view catalogue
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'PlusJakartaSans',
            color: Colors.mutedForeground,
            textAlign: 'center',
            maxWidth: 260,
          }}
        >
          Send a handshake request to this supplier to browse items and place orders.
        </Text>
        {onRequestHandshake && !handshakeSent && (
          <Button onPress={onRequestHandshake} loading={handshakeLoading}>
            Request Handshake
          </Button>
        )}
        {handshakeSent && (
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans-Medium',
              color: Colors.primary,
              textAlign: 'center',
            }}
          >
            Handshake request sent
          </Text>
        )}
      </View>
    </View>
  );
}