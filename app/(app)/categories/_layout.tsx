import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function CategoriesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[categoryId]" />
      <Stack.Screen name="supplier/[supplierId]" />
    </Stack>
  );
}