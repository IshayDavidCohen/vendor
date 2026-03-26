import { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Store } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/auth.store';
import { Colors } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore(s => s.signIn);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(app)/dashboard');
    } catch {
      Toast.show({ type: 'error', text1: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
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
              Welcome back
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'PlusJakartaSans',
                color: Colors.mutedForeground,
              }}
            >
              Sign in to your Vendor account
            </Text>
          </View>
          <CardContent style={{ paddingTop: 20 }}>
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
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
              <Button
                size="lg"
                onPress={handleSubmit}
                loading={loading}
                style={{ marginTop: 8 }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </View>
            <Pressable
              onPress={() => router.push('/(auth)/register')}
              style={{ marginTop: 20, alignItems: 'center' }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.mutedForeground,
                }}
              >
                Don't have an account?{' '}
                <Text
                  style={{
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    color: Colors.primary,
                  }}
                >
                  Create one
                </Text>
              </Text>
            </Pressable>
          </CardContent>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
