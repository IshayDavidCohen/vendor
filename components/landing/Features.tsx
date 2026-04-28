import { View, Text, useWindowDimensions } from 'react-native';
import {
  Monitor,
  Activity,
  HeartHandshake,
  Grid3X3,
  Users,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react-native';
import { Colors } from '@/constants/theme';

const BREAKPOINT = 768;
const BREAKPOINT_LG = 1024;

interface Feature {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: Monitor,
    iconBg: '#F5F3FF',
    iconColor: Colors.primary,
    title: 'Catalogue management',
    desc: 'Suppliers list products with pricing, units, and categories. Businesses browse with ease.',
  },
  {
    icon: Activity,
    iconBg: '#E1F5EE',
    iconColor: '#0F6E56',
    title: 'Order pipeline',
    desc: 'Track every order from pending to delivered with real-time status updates.',
  },
  {
    icon: HeartHandshake,
    iconBg: '#FEF3C7',
    iconColor: '#92400E',
    title: 'Handshake system',
    desc: 'Request and approve business-supplier connections before placing orders.',
  },
  {
    icon: Grid3X3,
    iconBg: '#F5F3FF',
    iconColor: Colors.primary,
    title: 'Category browsing',
    desc: 'Organised by industry — alcohol, seafood, produce, dairy, and more.',
  },
  {
    icon: Users,
    iconBg: '#E1F5EE',
    iconColor: '#0F6E56',
    title: 'Role-based dashboards',
    desc: 'Each user sees exactly what they need. No clutter, no confusion.',
  },
  {
    icon: TrendingUp,
    iconBg: '#FEF3C7',
    iconColor: '#92400E',
    title: 'Built for scale',
    desc: 'From your first order to your thousandth — Vendor grows with you.',
  },
];

export function Features() {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAKPOINT;
  const isTablet = width >= BREAKPOINT && width < BREAKPOINT_LG;

  const columns = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <View
      style={{
        paddingVertical: isMobile ? 48 : 80,
        paddingHorizontal: isMobile ? 20 : 32,
      }}
    >
      <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center' }}>
        {/* Section heading */}
        <View style={{ alignItems: 'center', marginBottom: isMobile ? 36 : 56 }}>
          <Text
            style={{
              fontSize: isMobile ? 24 : 32,
              fontFamily: 'DMSans-Bold',
              color: Colors.foreground,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Everything you need
          </Text>
          <Text
            style={{
              fontSize: isMobile ? 14 : 16,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
              textAlign: 'center',
            }}
          >
            Built for B2B procurement, from day one.
          </Text>
        </View>

        {/* Grid */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: isMobile ? 12 : 16,
          }}
        >
          {features.map((feature, i) => (
            <View
              key={i}
              style={{
                width:
                  columns === 1
                    ? '100%'
                    : columns === 2
                      ? '48.5%'
                      : '31.5%',
                flexGrow: 1,
                borderWidth: 1,
                borderColor: Colors.border,
                borderRadius: 14,
                padding: isMobile ? 18 : 24,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: feature.iconBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}
              >
                <feature.icon size={22} color={feature.iconColor} strokeWidth={1.5} />
              </View>
              <Text
                style={{
                  fontSize: isMobile ? 15 : 16,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: Colors.foreground,
                  marginBottom: 6,
                }}
              >
                {feature.title}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.mutedForeground,
                  lineHeight: 20,
                }}
              >
                {feature.desc}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
