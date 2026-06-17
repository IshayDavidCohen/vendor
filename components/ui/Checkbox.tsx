import { Platform, Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: number;
}

export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  size = 20,
}: CheckboxProps) {
  return (
    <Pressable
      onPress={() => !disabled && onCheckedChange(!checked)}
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: checked ? Colors.primary : Colors.input,
        backgroundColor: checked ? Colors.primary : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        ...(Platform.OS === 'web' ? { cursor: disabled ? 'not-allowed' : 'pointer' } as any : {}),
      }}
    >
      {checked && <Check size={size - 6} color={Colors.primaryForeground} strokeWidth={3} />}
    </Pressable>
  );
}
