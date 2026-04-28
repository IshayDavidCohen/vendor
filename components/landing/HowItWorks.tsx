import { View, Text, useWindowDimensions } from 'react-native';
import { UserPlus, Handshake, Truck } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

const BREAKPOINT = 768;

const steps = [
  {
    num: '1',
    icon: UserPlus,
    title: 'Create your account',
    desc: 'Sign up in under a minute. Choose your role — business or supplier.',
  },
  {
    num: '2',
    icon: Handshake,
    title: 'Connect with partners',
    desc: 'Browse categories, discover suppliers, or receive handshake requests.',
  },
  {
    num: '3',
    icon: Truck,
    title: 'Start ordering',
    desc: 'Place orders, track deliveries, and manage everything from your dashboard.',
  },
];

export function HowItWorks() {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAKPOINT;

  return (
    <View
      style={{
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.border,
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
            How Vendor works
          </Text>
          <Text
            style={{
              fontSize: isMobile ? 14 : 16,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
              textAlign: 'center',
            }}
          >
            Up and running in three steps.
          </Text>
        </View>

        {/* Steps */}
        <View
          style={{
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 24 : 20,
            position: 'relative',
          }}
        >
          {/* Connector line (desktop only) */}
          {!isMobile && (
            <View
              style={{
                position: 'absolute',
                top: 48,
                left: '20%',
                right: '20%',
                height: 2,
                borderStyle: 'dashed',
                borderTopWidth: 2,
                borderColor: Colors.border,
                zIndex: 0,
              }}
            />
          )}

          {steps.map((step, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Icon card */}
              <View
                style={{
                  width: isMobile ? 88 : 96,
                  height: isMobile ? 72 : 80,
                  borderRadius: 16,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: Colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <step.icon size={32} color={Colors.primary} strokeWidth={1.5} />
              </View>

              {/* Step label */}
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: Colors.primary,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Step {step.num}
              </Text>

              {/* Title */}
              <Text
                style={{
                  fontSize: isMobile ? 16 : 17,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: Colors.foreground,
                  textAlign: 'center',
                  marginBottom: 6,
                }}
              >
                {step.title}
              </Text>

              {/* Description */}
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.mutedForeground,
                  textAlign: 'center',
                  lineHeight: 20,
                  maxWidth: 260,
                }}
              >
                {step.desc}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
