import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Save,
  Mail,
  Phone,
  MapPin,
  Building2,
  ArrowLeftRight,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { useAuthStore } from '@/stores/auth.store';
import { businessApi, supplierApi } from '@/services/api';
import type { Business, Supplier } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/theme';

export default function ProfileScreen() {
  const profile = useAuthStore(s => s.profile);
  const role = useAuthStore(s => s.role);
  const platformId = useAuthStore(s => s.platformId);
  const refreshProfile = useAuthStore(s => s.refreshProfile);
  const toggleMockRole = useAuthStore(s => s.toggleMockRole);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    desc: '',
    icon: '',
    banner: '',
    email: '',
    phone: '',
    address: '',
    shipping_address: '',
  });

  useEffect(() => {
    if (!profile) return;
    setFormData({
      company_name: profile.company_name,
      desc: profile.desc,
      icon: profile.icon,
      banner: profile.banner,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      shipping_address: profile.shipping_address,
    });
  }, [profile]);

  const updateField = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    if (!profile || !role) return;

    setLoading(true);
    try {
      const updateData = {
        company_name: formData.company_name,
        desc: formData.desc,
        icon: formData.icon,
        banner: formData.banner,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        shipping_address: formData.shipping_address,
      };

      if (role === 'business') {
        const { error } = await businessApi.update(profile.id, updateData);
        if (error) {
          Toast.show({ type: 'error', text1: 'Failed to update profile', text2: error });
          return;
        }
      } else {
        const { error } = await supplierApi.update(profile.id, updateData);
        if (error) {
          Toast.show({ type: 'error', text1: 'Failed to update profile', text2: error });
          return;
        }
      }

      await refreshProfile();
      Toast.show({ type: 'success', text1: 'Profile updated successfully' });
    } catch {
      Toast.show({ type: 'error', text1: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  if (!profile || !role) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.background }}
        edges={['bottom']}
      >
        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
          <Text
            style={{
              fontFamily: 'PlusJakartaSans',
              color: Colors.mutedForeground,
              textAlign: 'center',
            }}
          >
            No profile loaded.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const typedProfile = profile as Business | Supplier;
  const initialsSource = typedProfile.company_name || 'Co';

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.background }}
      edges={['bottom']}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          title="Profile & Settings"
          description="Manage your account and company information"
        >
          <Button onPress={handleSave} disabled={loading} loading={loading}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Save size={18} color={Colors.primaryForeground} />
              <Text
                style={{
                  color: Colors.primaryForeground,
                  fontFamily: 'PlusJakartaSans-SemiBold',
                  fontSize: 14,
                }}
              >
                Save Changes
              </Text>
            </View>
          </Button>
        </PageHeader>

        <Card style={{ marginBottom: 16 }}>
          <CardContent style={{ padding: 16 }}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <Avatar src={typedProfile.icon} fallback={initialsSource} size={96} />
              <View style={{ alignItems: 'center', width: '100%' }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: 'DMSans-Bold',
                    color: Colors.foreground,
                    textAlign: 'center',
                  }}
                >
                  {typedProfile.company_name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSans',
                    color: Colors.mutedForeground,
                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  {typedProfile.desc || 'No description'}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <Badge variant="secondary">
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'PlusJakartaSans-Medium',
                        color: Colors.secondaryForeground,
                        textTransform: 'capitalize',
                      }}
                    >
                      {role}
                    </Text>
                  </Badge>
                  {typedProfile.categories?.map(cat => (
                    <Badge key={cat} variant="outline">
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'PlusJakartaSans-Medium',
                          color: Colors.foreground,
                        }}
                      >
                        {cat}
                      </Text>
                    </Badge>
                  ))}
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <CardHeader>
            <CardTitle>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Building2 size={20} color={Colors.primary} />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    color: Colors.cardForeground,
                  }}
                >
                  Company Information
                </Text>
              </View>
            </CardTitle>
            <CardDescription>Basic information about your company</CardDescription>
          </CardHeader>
          <CardContent style={{ gap: 14 }}>
            <Input
              label="Company Name"
              value={formData.company_name}
              onChangeText={v => updateField('company_name', v)}
            />
            <TextArea
              label="Description"
              value={formData.desc}
              onChangeText={v => updateField('desc', v)}
            />
            <Input
              label="Logo URL"
              placeholder="https://example.com/logo.png"
              value={formData.icon}
              onChangeText={v => updateField('icon', v)}
            />
            <Input
              label="Banner URL"
              placeholder="https://example.com/banner.png"
              value={formData.banner}
              onChangeText={v => updateField('banner', v)}
            />
          </CardContent>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <CardHeader>
            <CardTitle>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Mail size={20} color={Colors.primary} />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    color: Colors.cardForeground,
                  }}
                >
                  Contact Information
                </Text>
              </View>
            </CardTitle>
            <CardDescription>How others can reach you</CardDescription>
          </CardHeader>
          <CardContent style={{ gap: 14 }}>
            <Input
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={v => updateField('email', v)}
              style={{ paddingLeft: 12 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: -6 }}>
              <Phone size={16} color={Colors.mutedForeground} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans-Medium',
                  color: Colors.foreground,
                }}
              >
                Phone
              </Text>
            </View>
            <Input
              value={formData.phone}
              onChangeText={v => updateField('phone', v)}
              keyboardType="phone-pad"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: -6 }}>
              <MapPin size={16} color={Colors.mutedForeground} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans-Medium',
                  color: Colors.foreground,
                }}
              >
                Business Address
              </Text>
            </View>
            <TextArea
              value={formData.address}
              onChangeText={v => updateField('address', v)}
            />
            <TextArea
              label="Shipping Address"
              value={formData.shipping_address}
              onChangeText={v => updateField('shipping_address', v)}
            />
          </CardContent>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details (read-only)</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <View
                style={{
                  flexGrow: 1,
                  minWidth: '45%',
                  backgroundColor: Colors.muted,
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'PlusJakartaSans',
                    color: Colors.mutedForeground,
                  }}
                >
                  Account ID
                </Text>
                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    fontFamily: 'PlusJakartaSans-Medium',
                    color: Colors.foreground,
                  }}
                  selectable
                >
                  {typedProfile.id}
                </Text>
              </View>
              <View
                style={{
                  flexGrow: 1,
                  minWidth: '45%',
                  backgroundColor: Colors.muted,
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'PlusJakartaSans',
                    color: Colors.mutedForeground,
                  }}
                >
                  Account Type
                </Text>
                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    color: Colors.foreground,
                    textTransform: 'capitalize',
                  }}
                >
                  {role}
                </Text>
              </View>
              <View
                style={{
                  flexGrow: 1,
                  minWidth: '45%',
                  backgroundColor: Colors.muted,
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'PlusJakartaSans',
                    color: Colors.mutedForeground,
                  }}
                >
                  Created
                </Text>
                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSans-Medium',
                    color: Colors.foreground,
                  }}
                >
                  {new Date(typedProfile.created_at).toLocaleDateString()}
                </Text>
              </View>
              <View
                style={{
                  flexGrow: 1,
                  minWidth: '45%',
                  backgroundColor: Colors.muted,
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'PlusJakartaSans',
                    color: Colors.mutedForeground,
                  }}
                >
                  Last Updated
                </Text>
                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSans-Medium',
                    color: Colors.foreground,
                  }}
                >
                  {new Date(typedProfile.updated_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer tools</CardTitle>
            <CardDescription>Mock role switcher for testing</CardDescription>
          </CardHeader>
          <CardContent style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'PlusJakartaSans',
                color: Colors.mutedForeground,
              }}
            >
              Current role:{' '}
              <Text style={{ color: Colors.foreground, fontFamily: 'PlusJakartaSans-SemiBold' }}>
                {role ?? '—'}
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'PlusJakartaSans',
                color: Colors.mutedForeground,
              }}
              selectable
            >
              platformId:{' '}
              <Text style={{ color: Colors.foreground, fontFamily: 'PlusJakartaSans-Medium' }}>
                {platformId ?? '—'}
              </Text>
            </Text>
            <Button variant="outline" onPress={() => toggleMockRole()}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ArrowLeftRight size={18} color={Colors.foreground} />
                <Text
                  style={{
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    color: Colors.foreground,
                    fontSize: 14,
                  }}
                >
                  {role === 'business' ? 'Switch to Supplier' : 'Switch to Business'}
                </Text>
              </View>
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
