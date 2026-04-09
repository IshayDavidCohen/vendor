import { Platform, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Package, Minus, Plus } from 'lucide-react-native';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/theme';
import type { Item } from '@/types';

interface ItemCardProps {
  item: Item;
  businessId?: string;
  onAddToCart?: (item: Item) => void;
  cartQuantity?: number;
  onUpdateQuantity?: (quantity: number) => void;
  disabled?: boolean;
  onPress?: () => void;
}

export function ItemCard({
  item,
  businessId,
  onAddToCart,
  cartQuantity = 0,
  onUpdateQuantity,
  disabled,
  onPress,
}: ItemCardProps) {
  const customPrice = businessId ? item.custom_prices?.[businessId] : undefined;
  const displayPrice = customPrice ?? item.base_price;
  const hasCustomPrice = customPrice !== undefined && customPrice !== item.base_price;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed && onPress ? 0.9 : 1,
        flex: 1,
        ...(Platform.OS === 'web' && onPress ? { cursor: 'pointer' as any } : {}),
      })}
      disabled={!onPress}
    >
      <View
        style={{
          backgroundColor: Colors.card,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: Colors.border,
          overflow: 'hidden',
          ...Platform.select({
            web: {
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
            } as any,
            default: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            },
          }),
        }}
      >
        <View
          style={{
            height: 120,
            backgroundColor: Colors.muted,
            overflow: 'hidden',
          }}
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
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
              <Package size={32} color={Colors.mutedForeground} />
            </View>
          )}
          {hasCustomPrice && (
            <View style={{ position: 'absolute', top: 8, right: 8 }}>
              <Badge
                variant="default"
                style={{ backgroundColor: '#059669' }}
                textStyle={{ color: '#fff' }}
              >
                Your Price
              </Badge>
            </View>
          )}
        </View>

        <View style={{ padding: 10, gap: 4 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'PlusJakartaSans-SemiBold',
              color: Colors.foreground,
            }}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'PlusJakartaSans-Bold',
                color: Colors.foreground,
              }}
            >
              {item.currency} {displayPrice.toFixed(2)}
            </Text>
            {hasCustomPrice && (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.mutedForeground,
                  textDecorationLine: 'line-through',
                }}
              >
                {item.currency} {item.base_price.toFixed(2)}
              </Text>
            )}
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'PlusJakartaSans',
                color: Colors.mutedForeground,
              }}
            >
              /{item.unit}
            </Text>
          </View>

          {onAddToCart && !disabled && (
            <View style={{ marginTop: 6 }}>
              {cartQuantity === 0 ? (
                <Pressable
                  onPress={() => onAddToCart(item)}
                  style={{
                    backgroundColor: Colors.primary,
                    borderRadius: 8,
                    paddingVertical: 8,
                    alignItems: 'center',
                    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      color: Colors.primaryForeground,
                    }}
                  >
                    Add to Cart
                  </Text>
                </Pressable>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                  }}
                >
                  <Pressable
                    onPress={() => onUpdateQuantity?.(cartQuantity - 1)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: Colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Minus size={14} color={Colors.foreground} />
                  </Pressable>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      color: Colors.foreground,
                      width: 28,
                      textAlign: 'center',
                    }}
                  >
                    {cartQuantity}
                  </Text>
                  <Pressable
                    onPress={() => onUpdateQuantity?.(cartQuantity + 1)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: Colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Plus size={14} color={Colors.foreground} />
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
