import { useState, useMemo } from 'react';
import {
  Platform,
  View,
  Text,
  Pressable,
  FlatList,
  type ViewStyle,
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Modal } from './Modal';
import { Colors } from '@/constants/theme';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectGroup {
  heading: string;
  options: SelectOption[];
}

type ListItem =
  | { type: 'heading'; heading: string }
  | { type: 'option'; label: string; value: string };

interface SelectProps {
  options?: SelectOption[];
  groups?: SelectGroup[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  style?: ViewStyle;
}

export function Select({
  options,
  groups,
  value,
  onValueChange,
  placeholder = 'Select...',
  label,
  style,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  // ── Build unified list from either groups or flat options ──
  const listData: ListItem[] = useMemo(() => {
    if (groups) {
      return groups.flatMap(g => [
        { type: 'heading' as const, heading: g.heading },
        ...g.options.map(o => ({ type: 'option' as const, ...o })),
      ]);
    }
    return (options ?? []).map(o => ({ type: 'option' as const, ...o }));
  }, [groups, options]);

  // ── Derive selected label from whichever source is active ──
  const allOptions = useMemo(() => {
    if (groups) return groups.flatMap(g => g.options);
    return options ?? [];
  }, [groups, options]);

  const selected = allOptions.find(o => o.value === value);

  return (
    <View style={style}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'PlusJakartaSans-Medium',
            color: Colors.foreground,
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      )}
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          height: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: Colors.input,
          borderRadius: 8,
          paddingHorizontal: 12,
          backgroundColor: Colors.background,
          ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'PlusJakartaSans',
            color: selected ? Colors.foreground : Colors.mutedForeground,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {selected?.label ?? placeholder}
        </Text>
        <ChevronDown size={16} color={Colors.mutedForeground} />
      </Pressable>

      <Modal visible={open} onClose={() => setOpen(false)} animationType="slide">
        <View style={{ padding: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'PlusJakartaSans-SemiBold',
              color: Colors.foreground,
              marginBottom: 12,
            }}
          >
            {label || 'Select an option'}
          </Text>
          <FlatList
            data={listData}
            keyExtractor={(item, index) =>
              item.type === 'heading' ? `heading-${index}` : item.value
            }
            style={{ maxHeight: 300 }}
            renderItem={({ item }) => {
              if (item.type === 'heading') {
                return (
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      color: Colors.mutedForeground,
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                      paddingTop: 14,
                      paddingBottom: 6,
                      paddingHorizontal: 8,
                    }}
                  >
                    {item.heading}
                  </Text>
                );
              }

              const isSelected = item.value === value;
              return (
                <Pressable
                  onPress={() => {
                    onValueChange(item.value);
                    setOpen(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                    backgroundColor: isSelected ? Colors.accent : 'transparent',
                    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: isSelected
                        ? 'PlusJakartaSans-SemiBold'
                        : 'PlusJakartaSans',
                      color: isSelected
                        ? Colors.accentForeground
                        : Colors.foreground,
                    }}
                  >
                    {item.label}
                  </Text>
                  {isSelected && <Check size={16} color={Colors.primary} />}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}