import { Platform, useWindowDimensions } from 'react-native';

const WEB_SIDEBAR_BREAKPOINT = 768;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWideWeb = isWeb && width >= WEB_SIDEBAR_BREAKPOINT;
  const isMobile = !isWeb;

  const numColumns = isWideWeb
    ? width >= 1280
      ? 4
      : width >= 1024
        ? 3
        : 2
    : 2;

  return { width, height, isWeb, isWideWeb, isMobile, numColumns };
}
