// components/ItemCard.tsx
import { Platform, View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
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
  /** Called when the user taps the product image. Typically "add to cart or +1". */
  onImagePress?: () => void;
  /** Optional whole-card tap (e.g., open detail). Preserved for other screens. */
  onPress?: () => void;
}

export function ItemCard({
  item,
  businessId,
  onAddToCart,
  cartQuantity = 0,
  onUpdateQuantity,
  disabled,
  onImagePress,
  onPress,
}: ItemCardProps) {
  const customPrice = businessId ? item.custom_prices?.[businessId] : undefined;
  const displayPrice = customPrice ?? item.base_price;
  const hasCustomPrice = customPrice !== undefined && customPrice !== item.base_price;
  const isOutOfStock = item.out_of_stock;

  // Business can't add out-of-stock items to cart
  const canAddToCart = !!onAddToCart && !disabled && !isOutOfStock;

  // Image-level tap is enabled only when the card is in a "cart-capable" state
  // AND the parent actually wired a handler. This keeps the card inert on
  // surfaces that don't want image-tap behaviour (e.g., supplier's own catalogue).
  const imageInteractive = canAddToCart && !!onImagePress;

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
        {/* Image — now its own Pressable */}
        <Pressable
          onPress={imageInteractive ? onImagePress : undefined}
          disabled={!imageInteractive}
          accessibilityRole={imageInteractive ? 'button' : undefined}
          accessibilityLabel={
            imageInteractive
              ? cartQuantity === 0
                ? `Add ${item.name} to cart`
                : `Add one more ${item.name} to cart`
              : undefined
          }
          style={({ pressed }) => ({
            height: 120,
            backgroundColor: Colors.muted,
            overflow: 'hidden',
            opacity: pressed && imageInteractive ? 0.85 : 1,
            ...(Platform.OS === 'web' && imageInteractive
              ? { cursor: 'pointer' as any }
              : {}),
          })}
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

          {/* In-cart indicator — shows quantity when image is interactive */}
          {imageInteractive && cartQuantity > 0 && (
            <View
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                minWidth: 22,
                height: 22,
                paddingHorizontal: 6,
                borderRadius: 11,
                backgroundColor: Colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: Colors.primaryForeground,
                  fontSize: 11,
                  fontFamily: 'PlusJakartaSans-Bold',
                }}
              >
                {cartQuantity}
              </Text>
            </View>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <BlurView
              intensity={40}
              tint="default"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'PlusJakartaSans-Bold',
                    fontSize: 13,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Out of Stock
                </Text>
              </View>
            </BlurView>
          )}
        </Pressable>

        {/* Content */}
        <View style={{ padding: 10, gap: 4 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'PlusJakartaSans-SemiBold',
              color: isOutOfStock ? Colors.mutedForeground : Colors.foreground,
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
                color: isOutOfStock ? Colors.mutedForeground : Colors.foreground,
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

          {/* Add to cart / quantity controls — hidden when out of stock */}
          {canAddToCart && (
            <View style={{ marginTop: 6 }}>
              {cartQuantity === 0 ? (
                <Pressable
                  onPress={() => onAddToCart!(item)}
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

          {/* Out of stock message for business users trying to order */}
          {onAddToCart && !disabled && isOutOfStock && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'PlusJakartaSans-Medium',
                color: Colors.destructive,
                marginTop: 6,
                textAlign: 'center',
              }}
            >
              Currently unavailable
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}