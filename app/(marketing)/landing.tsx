import { useRef, useCallback, useMemo } from 'react';
import { ScrollView, View, Platform } from 'react-native';

import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { SocialProof } from '@/components/landing/SocialProof';
import { ValueProps } from '@/components/landing/ValueProps';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Features } from '@/components/landing/Features';
import { BottomCTA } from '@/components/landing/BottomCTA';
import { Footer } from '@/components/landing/Footer';

/**
 * Landing page at vendor.io (the `/` route for unauthenticated users).
 *
 * Composable section architecture — each section is a standalone component
 * with no required props. Scroll-to-section is coordinated via refs and
 * the onScrollTo callback passed to Navbar and HeroSection.
 */
export default function LandingScreen() {
  const scrollRef = useRef<ScrollView>(null);

  // Track section Y positions for scroll-to
  const sectionPositions = useRef<Record<string, number>>({});

  const handleLayout = useCallback((section: string, y: number) => {
    sectionPositions.current[section] = y;
  }, []);

  const handleScrollTo = useCallback((section: string) => {
    const y = sectionPositions.current[section];
    if (y != null && scrollRef.current) {
      scrollRef.current.scrollTo({ y: y - 60, animated: true });
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Navbar onScrollTo={handleScrollTo} />

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        {...(Platform.OS === 'web' ? { overScrollMode: 'never' as const } : {})}
      >
        {/* Hero */}
        <View
          onLayout={e => handleLayout('hero', e.nativeEvent.layout.y)}
        >
          <HeroSection onScrollTo={handleScrollTo} />
        </View>

        {/* Social Proof */}
        <SocialProof />

        {/* Value Propositions: For Businesses / For Suppliers */}
        <View
          onLayout={e => handleLayout('businesses', e.nativeEvent.layout.y)}
          nativeID="businesses"
        >
          <ValueProps />
        </View>

        {/* How Vendor Works */}
        <View
          onLayout={e => handleLayout('how-it-works', e.nativeEvent.layout.y)}
          nativeID="how-it-works"
        >
          <HowItWorks />
        </View>

        {/* Features */}
        <View
          onLayout={e => handleLayout('features', e.nativeEvent.layout.y)}
          nativeID="features"
        >
          <Features />
        </View>

        {/* Bottom CTA */}
        <BottomCTA />

        {/* Footer */}
        <Footer />
      </ScrollView>
    </View>
  );
}
