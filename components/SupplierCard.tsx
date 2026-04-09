import { Platform, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Store, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/theme';
import type { SupplierCarouselItem } from '@/types';

interface SupplierCardProps {
  supplier: SupplierCarouselItem;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const router = useRouter();
  const supplierId = supplier.link.replace('/supplier/', '');

  return (
    <Pressable
      onPress={() => router.push(`/(app)/categories/supplier/${supplierId}`)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
      })}
    >
      <Card style={{ overflow: 'hidden' }}>
        <View
          style={{
            height: 100,
            backgroundColor: `${Colors.primary}12`,
            overflow: 'hidden',
          }}
        >
          {supplier.banner ? (
            <Image
              source={{ uri: supplier.banner }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Store size={40} color={`${Colors.primary}60`} />
            </View>
          )}
        </View>
        <CardContent style={{ paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <View style={{ marginTop: -28 }}>
              <Avatar
                src={supplier.icon}
                fallback={supplier.title}
                size={48}
                style={{
                  borderWidth: 2,
                  borderColor: Colors.background,
                  ...Platform.select({
                    web: { boxShadow: '0 2px 6px rgba(0,0,0,0.15)' } as any,
                    default: {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 3,
                      elevation: 3,
                    },
                  }),
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: Colors.foreground,
                }}
                numberOfLines={1}
              >
                {supplier.title}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.mutedForeground,
                  marginTop: 2,
                }}
                numberOfLines={2}
              >
                {supplier.desc || 'No description available'}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push(`/(app)/categories/supplier/${supplierId}`)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: `${Colors.primary}10`,
              ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'PlusJakartaSans-Medium',
                color: Colors.primary,
              }}
            >
              View Catalogue
            </Text>
            <ArrowRight size={14} color={Colors.primary} style={{ marginLeft: 4 }} />
          </Pressable>
        </CardContent>
      </Card>
    </Pressable>
  );
}
