import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  type ViewStyle,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: 'slide' | 'fade' | 'none';
}

export function Modal({
  visible,
  onClose,
  children,
  animationType = 'fade',
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      onRequestClose={onClose}
      transparent
      animationType={animationType}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
          }}
        >
          {/* Invisible backdrop — tapping here closes the modal */}
          <Pressable
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              ...(Platform.OS === 'web' ? { cursor: 'default' as any } : {}),
            }}
          />

          {/* Content container — plain View, no responder interference */}
          <View
            style={{
              backgroundColor: Colors.background,
              borderRadius: 12,
              width: '100%',
              maxWidth: 480,
              maxHeight: '90%',
              overflow: 'hidden',
              ...(Platform.OS === 'web'
                ? ({
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    cursor: 'auto',
                  } as any)
                : {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.25,
                    shadowRadius: 20,
                    elevation: 10,
                  }),
            }}
          >
            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

interface ModalHeaderProps {
  title: string;
  description?: string;
  onClose?: () => void;
  style?: ViewStyle;
}

export function ModalHeader({ title, description, onClose, style }: ModalHeaderProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: 16,
          paddingBottom: 8,
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'PlusJakartaSans-SemiBold',
            color: Colors.foreground,
          }}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
              marginTop: 4,
            }}
          >
            {description}
          </Text>
        )}
      </View>
      {onClose && (
        <Pressable
          onPress={onClose}
          hitSlop={8}
          style={{
            padding: 4,
            borderRadius: 4,
            ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
          }}
        >
          <X size={20} color={Colors.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
}

export function ModalContent({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ padding: 16, paddingTop: 8 }, style]}>{children}</View>;
}

export function ModalFooter({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 8,
          padding: 16,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
