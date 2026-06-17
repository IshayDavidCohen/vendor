import { useState, useCallback } from 'react';
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line } from 'react-native-svg';
import { Colors } from '@/constants/theme';

interface DataPoint {
  label: string;
  value: number;
}

interface SpendTrendChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  currency?: string;
}

export function SpendTrendChart({
  data,
  color = '#10B981',
  height = 160,
  currency = '$',
}: SpendTrendChartProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  // Default to showing the last data point's value
  const [selectedIndex, setSelectedIndex] = useState(data.length - 1);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  if (data.length < 2) {
    return (
      <View
        style={{ height, alignItems: 'center', justifyContent: 'center' }}
        onLayout={onLayout}
      >
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'PlusJakartaSans',
            color: Colors.mutedForeground,
          }}
        >
          Not enough data to display trend
        </Text>
      </View>
    );
  }

  const paddingLeft = 8;
  const paddingRight = 8;
  const paddingTop = 34;
  const paddingBottom = 28;
  const chartWidth = containerWidth - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const values = data.map(d => d.value);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => ({
    x: paddingLeft + (chartWidth / (data.length - 1)) * i,
    y: paddingTop + chartHeight - ((d.value - minVal) / range) * chartHeight,
    label: d.label,
    value: d.value,
  }));

  // Smooth cubic bezier curve
  const linePath = points.reduce((acc, pt, i) => {
    if (i === 0) return `M${pt.x},${pt.y}`;
    const prev = points[i - 1];
    const dx = pt.x - prev.x;
    const tension = 0.3;
    return `${acc} C${prev.x + dx * tension},${prev.y} ${pt.x - dx * tension},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  // Closed area path for gradient fill
  const lastPt = points[points.length - 1];
  const firstPt = points[0];
  const areaPath = `${linePath} L${lastPt.x},${paddingTop + chartHeight} L${firstPt.x},${paddingTop + chartHeight} Z`;

  // Selected point for tooltip
  const sel = points[selectedIndex] ?? points[points.length - 1];
  const formatted = `${currency}${sel.value.toLocaleString()}`;
  const approxW = formatted.length * 7 + 16;
  let tooltipLeft = sel.x - approxW / 2;
  if (tooltipLeft < paddingLeft) tooltipLeft = paddingLeft;
  if (tooltipLeft + approxW > containerWidth - paddingRight)
    tooltipLeft = containerWidth - paddingRight - approxW;

  // Tap target size around each dot
  const hitSize = Math.max(36, chartWidth / data.length);

  return (
    <View onLayout={onLayout} style={{ height }}>
      {containerWidth > 0 && (
        <>
          <Svg width={containerWidth} height={height}>
            <Defs>
              <LinearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={color} stopOpacity={0.15} />
                <Stop offset="100%" stopColor={color} stopOpacity={0.01} />
              </LinearGradient>
            </Defs>

            {/* Horizontal grid lines */}
            {[0.25, 0.5, 0.75].map(pct => {
              const gy = paddingTop + chartHeight * (1 - pct);
              return (
                <Line
                  key={String(pct)}
                  x1={paddingLeft}
                  y1={gy}
                  x2={paddingLeft + chartWidth}
                  y2={gy}
                  stroke={Colors.border}
                  strokeWidth={0.5}
                  strokeDasharray="4,4"
                />
              );
            })}

            {/* Gradient area fill */}
            <Path d={areaPath} fill="url(#areaFill)" />

            {/* Curve line */}
            <Path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data dots (visual only — tap targets are RN Pressables below) */}
            {points.map((pt, i) => (
              <Circle
                key={String(i)}
                cx={pt.x}
                cy={pt.y}
                r={i === selectedIndex ? 6 : 3}
                fill={color}
                stroke="#fff"
                strokeWidth={i === selectedIndex ? 3 : 2}
              />
            ))}
          </Svg>

          {/* Invisible tap targets over each data point */}
          {points.map((pt, i) => (
            <Pressable
              key={`tap-${String(i)}`}
              onPress={() => setSelectedIndex(i)}
              style={{
                position: 'absolute',
                top: pt.y - hitSize / 2,
                left: pt.x - hitSize / 2,
                width: hitSize,
                height: hitSize,
              }}
            />
          ))}

          {/* X-axis labels */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: paddingLeft,
              right: paddingRight,
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 20,
            }}
          >
            {data.map((d, i) => (
              <Text
                key={String(i)}
                style={{
                  fontSize: 11,
                  fontFamily:
                    i === selectedIndex
                      ? 'PlusJakartaSans-SemiBold'
                      : 'PlusJakartaSans',
                  color:
                    i === selectedIndex
                      ? Colors.foreground
                      : Colors.mutedForeground,
                  textAlign: 'center',
                }}
              >
                {d.label}
              </Text>
            ))}
          </View>

          {/* Single tooltip on selected point */}
          <View
            style={{
              position: 'absolute',
              top: sel.y - 28,
              left: tooltipLeft,
              backgroundColor: Colors.foreground,
              borderRadius: 5,
              paddingHorizontal: 6,
              paddingVertical: 2,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 1.5,
                backgroundColor: color,
              }}
            />
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'DMSans-Bold',
                color: '#fff',
              }}
            >
              {formatted}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}