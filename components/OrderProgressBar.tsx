import { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, type ViewStyle, type LayoutChangeEvent } from 'react-native';
import { Colors } from '@/constants/theme';
import type { OrderStatus } from '@/types';

// ─── Constants ───────────────────────────────────────────────────
const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'delivering', label: 'Delivering' },
  { key: 'arrived', label: 'Arrived' },
];

const STEP_INDEX: Record<string, number> = {
  pending: 0,
  accepted: 1,
  delivering: 2,
  arrived: 3,
};

const DOT_SIZE = 10;
const TRACK_HEIGHT = 4;

function getBarColor(status: OrderStatus): string {
  if (status === 'rejected') return Colors.status.rejected;
  if (status === 'arrived') return Colors.status.arrived;
  if (status === 'delivering') return Colors.status.delivering;
  if (status === 'accepted') return Colors.status.accepted;
  return Colors.status.pending;
}

// ─── Component ───────────────────────────────────────────────────
interface OrderProgressBarProps {
  status: OrderStatus;
  style?: ViewStyle;
}

export function OrderProgressBar({ status, style }: OrderProgressBarProps) {
  const isRejected = status === 'rejected';
  const currentIdx = isRejected ? 1 : STEP_INDEX[status] ?? 0;
  const color = getBarColor(status);

  // ── Layout measurement ──────────────────────────────────────────
  const [containerWidth, setContainerWidth] = useState(0);

  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const N = STEPS.length;
  const segmentWidth = containerWidth / N;

  function dotCenterX(idx: number): number {
    if (idx === 0) return DOT_SIZE / 2;
    if (idx === N - 1) return containerWidth - DOT_SIZE / 2;
    return segmentWidth * idx + segmentWidth / 2;
  }

  const firstCenter = dotCenterX(0);
  const lastCenter = dotCenterX(N - 1);
  const currentCenter = dotCenterX(currentIdx);

  const trackLeft = firstCenter;
  const trackTotalWidth = lastCenter - firstCenter;
  const fillPct =
    trackTotalWidth > 0
      ? ((currentCenter - firstCenter) / trackTotalWidth) * 100
      : 0;

  // ── Animated fill (slides from 0 → target once, then holds) ────
  const fillAnim = useRef(new Animated.Value(0)).current;
  const hasAnimated = useRef(false);
  const prevStatus = useRef(status);
  const lastFillTarget = useRef(0);

  useEffect(() => {
    if (containerWidth <= 0) return;

    // Animate on first layout, or when the status actually changes
    const statusChanged = prevStatus.current !== status;
    prevStatus.current = status;

    if (!hasAnimated.current || statusChanged) {
      hasAnimated.current = true;
      // On status change, start from where we left off; on first mount, start from 0
      fillAnim.setValue(statusChanged ? lastFillTarget.current : 0);
      lastFillTarget.current = fillPct;
      Animated.timing(fillAnim, {
        toValue: fillPct,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else {
      // Layout re-fired (e.g. from LayoutAnimation) but status didn't change
      // — just snap to current value, no animation
      lastFillTarget.current = fillPct;
      fillAnim.setValue(fillPct);
    }
  }, [containerWidth, fillPct, status]);

  // ── Pulse animation on the current dot ──────────────────────────
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Only pulse on in-progress statuses (not arrived/rejected)
    if (status === 'arrived' || status === 'rejected') {
      pulseAnim.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();

    return () => loop.stop();
  }, [status]);

  // Interpolate pulse → shadow radius and opacity for the glow
  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.55],
  });
  const pulseShadowRadius = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 7],
  });

  // The fill bar's animated width as a percentage string
  const animatedFillWidth = fillAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[{ gap: 0 }, style]} onLayout={onContainerLayout}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {/* ── Track (absolute, FIRST in JSX → paints behind everything) ── */}
        {containerWidth > 0 && (
          <View
            style={{
              position: 'absolute',
              top: (DOT_SIZE - TRACK_HEIGHT) / 2,
              left: trackLeft,
              width: trackTotalWidth,
              height: TRACK_HEIGHT,
              backgroundColor: Colors.border,
              borderRadius: TRACK_HEIGHT / 2,
              zIndex: 0,
              overflow: 'hidden',
            }}
          >
            <Animated.View
              style={{
                width: animatedFillWidth,
                height: '100%',
                backgroundColor: color,
                borderRadius: TRACK_HEIGHT / 2,
              }}
            />
          </View>
        )}

        {/* ── Dots + labels (AFTER track in JSX → paint on top) ────────── */}
        {STEPS.map((step, idx) => {
          const isPast = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isActive = isPast || isCurrent;
          const ghosted = isRejected && idx > 1;

          const label = isRejected && idx === 1 ? 'Rejected' : step.label;
          const labelColor =
            isRejected && idx === 1
              ? Colors.status.rejected
              : isActive
                ? Colors.foreground
                : Colors.mutedForeground;

          // Animated.View works for all dots; only the current one gets animated props
          const dotAnimStyle: Animated.WithAnimatedObject<ViewStyle> =
            isCurrent && !isRejected
              ? {
                  shadowColor: color,
                  shadowOpacity: pulseScale as unknown as number,
                  shadowRadius: pulseShadowRadius as unknown as number,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 3,
                }
              : {};

          return (
            <View
              key={step.key}
              style={{
                alignItems:
                  idx === 0
                    ? 'flex-start'
                    : idx === N - 1
                      ? 'flex-end'
                      : 'center',
                flex: 1,
                opacity: ghosted ? 0.3 : 1,
                zIndex: 2,
              }}
            >
              {/* Dot */}
              <Animated.View
                style={[
                  {
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    borderRadius: DOT_SIZE / 2,
                    borderWidth: 2,
                    borderColor: isActive ? color : Colors.border,
                    backgroundColor: isPast ? color : Colors.background,
                  },
                  dotAnimStyle,
                ]}
              >
                {isCurrent && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 1,
                      left: 1,
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: color,
                    }}
                  />
                )}
              </Animated.View>

              {/* Label */}
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: isActive
                    ? 'PlusJakartaSans-Medium'
                    : 'PlusJakartaSans',
                  color: labelColor,
                  marginTop: 3,
                }}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
