import { useState, createContext, useContext } from 'react';
import {
  Platform,
  View,
  Text,
  Pressable,
  ScrollView,
  type ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/theme';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType>({
  value: '',
  onValueChange: () => {},
});

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnChange,
  children,
  style,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const onValueChange = controlledOnChange ?? setInternalValue;

  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
}

export function TabsList({ children, style, scrollable }: TabsListProps) {
  const content = (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: Colors.muted,
          borderRadius: 8,
          padding: 3,
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 4, flexGrow: 0}} style={{ flexGrow: 0, flexShrink: 0 }}>
        {content}
      </ScrollView>
    );
  }
  return content;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function TabsTrigger({ value, children, style }: TabsTriggerProps) {
  const { value: currentValue, onValueChange } = useContext(TabsContext);
  const isActive = currentValue === value;

  return (
    <Pressable
      onPress={() => onValueChange(value)}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 6,
          ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
          ...(isActive
            ? Platform.select({
                web: {
                  backgroundColor: Colors.background,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                } as any,
                default: {
                  backgroundColor: Colors.background,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 1,
                  elevation: 1,
                },
              })
            : {}),
        },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          style={{
            fontSize: 13,
            fontFamily: isActive ? 'PlusJakartaSans-SemiBold' : 'PlusJakartaSans-Medium',
            color: isActive ? Colors.foreground : Colors.mutedForeground,
          }}
          numberOfLines={1}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function TabsContent({ value, children, style }: TabsContentProps) {
  const { value: currentValue } = useContext(TabsContext);
  if (currentValue !== value) return null;

  return <View style={[{ flex: 1 }, style]}>{children}</View>;
}
