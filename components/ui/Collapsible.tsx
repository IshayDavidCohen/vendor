import { useState, useCallback } from 'react';
import {
  View,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
  type ViewStyle,
} from 'react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Collapsible({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  children,
  style,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen ?? internalOpen;

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = !isOpen;
    setInternalOpen(next);
    onOpenChange?.(next);
  }, [isOpen, onOpenChange]);

  return (
    <View style={style}>
      {typeof children === 'function'
        ? (children as (props: { isOpen: boolean; toggle: () => void }) => React.ReactNode)({ isOpen, toggle })
        : children}
    </View>
  );
}

interface CollapsibleTriggerProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CollapsibleTrigger({ onPress, children, style }: CollapsibleTriggerProps) {
  return (
    <Pressable onPress={onPress} style={style}>
      {children}
    </Pressable>
  );
}

interface CollapsibleContentProps {
  isOpen: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CollapsibleContent({ isOpen, children, style }: CollapsibleContentProps) {
  if (!isOpen) return null;
  return <View style={style}>{children}</View>;
}
