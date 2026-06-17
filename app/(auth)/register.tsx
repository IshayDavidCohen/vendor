import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Store, Building2, Truck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/auth.store';
import { Colors } from '@/constants/theme';
import type { UserRole } from '@/types';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(false);
  const signUp = useAuthStore(s => s.signUp);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }
    if (!role) {
      Toast.show({ type: 'error', text1: 'Please select your account type' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      if (role) {
        await AsyncStorage.setItem('vendor_onboarding_role', role);
      }
      router.replace('/onboarding');
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to create account' });
    } finally {
      setLoading(false);
    }
  };

  const RoleCard = ({
    type,
    icon: Icon,
    label,
    desc,
  }: {
    type: UserRole;
    icon: typeof Building2;
    label: string;
    desc: string;
  }) => {
    const selected = role === type;
    return (
      <Pressable
        onPress={() => setRole(type)}
        style={{
          flex: 1,
          alignItems: 'center',
          gap: 10,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: selected ? Colors.primary : Colors.border,
          backgroundColor: selected ? `${Colors.primary}08` : 'transparent',
          padding: 14,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: selected ? Colors.primary : Colors.muted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            size={24}
            color={selected ? Colors.primaryForeground : Colors.mutedForeground}
          />
        </View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'PlusJakartaSans-SemiBold',
            color: selected ? Colors.primary : Colors.foreground,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'PlusJakartaSans',
            color: Colors.mutedForeground,
            textAlign: 'center',
          }}
        >
          {desc}
        </Text>
      </Pressable>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: Colors.background }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={{ maxWidth: 400, width: '100%', alignSelf: 'center' }}>
          <View style={{ alignItems: 'center', paddingTop: 24, gap: 12 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: Colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Store size={28} color={Colors.primaryForeground} />
            </View>
            <Text
              style={{
                fontSize: 22,
                fontFamily: 'DMSans-Bold',
                color: Colors.foreground,
              }}
            >
              Create an account
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'PlusJakartaSans',
                color: Colors.mutedForeground,
              }}
            >
              Join Vendor to connect with local suppliers
            </Text>
          </View>
          <CardContent style={{ paddingTop: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'PlusJakartaSans-Medium',
                color: Colors.foreground,
                marginBottom: 10,
              }}
            >
              I am a...
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
              <RoleCard
                type="business"
                icon={Building2}
                label="Business"
                desc="Order from suppliers"
              />
              <RoleCard
                type="supplier"
                icon={Truck}
                label="Supplier"
                desc="Sell to businesses"
              />
            </View>
            <View style={{ gap: 14 }}>
              <Input
                label="Email"
                placeholder="you@company.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
              <Button
                size="lg"
                onPress={handleSubmit}
                loading={loading}
                style={{ marginTop: 8 }}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </View>
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              style={{ marginTop: 20, alignItems: 'center' }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.mutedForeground,
                }}
              >
                Already have an account?{' '}
                <Text
                  style={{
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    color: Colors.primary,
                  }}
                >
                  Sign in
                </Text>
              </Text>
            </Pressable>
          </CardContent>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
