import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

interface PickImageOptions {
  aspect?: [number, number];
  quality?: number;
}

export async function pickImage(options?: PickImageOptions): Promise<string | null> {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({
        type: 'error',
        text1: 'Permission required',
        text2: 'Please allow access to your photo library',
      });
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: options?.aspect,
      quality: options?.quality ?? 0.8,
    });

    if (result.canceled) return null;

    const asset = result.assets?.[0];
    return asset?.uri ?? null;
  } catch {
    Toast.show({ type: 'error', text1: 'Failed to pick image' });
    return null;
  }
}