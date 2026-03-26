import { Platform, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Grid3X3, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '@/components/ui/Card';
import { Colors } from '@/constants/theme';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();
  const supplierCount = Object.keys(category.users || {}).length;

  return (
    <Pressable
      onPress={() => router.push(`/(app)/categories/${category.oid}`)}
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
          {category.image ? (
            <Image
              source={{ uri: category.image }}
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
              <Grid3X3 size={40} color={`${Colors.primary}60`} />
            </View>
          )}
        </View>
        <CardContent style={{ paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {category.icon && (
              <Text style={{ fontSize: 24 }}>{category.icon}</Text>
            )}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  color: Colors.foreground,
                }}
                numberOfLines={1}
              >
                {category.title}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.mutedForeground,
                }}
              >
                {supplierCount} supplier{supplierCount !== 1 ? 's' : ''}
              </Text>
            </View>
            <ArrowRight size={18} color={Colors.mutedForeground} />
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
