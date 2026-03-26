import { useState } from 'react';
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

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  style?: ViewStyle;
}

export function Select({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  label,
  style,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

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
            data={options}
            keyExtractor={item => item.value}
            style={{ maxHeight: 300 }}
            renderItem={({ item }) => {
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
                  {isSelected && (
                    <Check size={16} color={Colors.primary} />
                  )}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}
