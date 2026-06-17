import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  Store,
  Building2,
  Mail,
  Phone,
  MapPin,
  Truck,
  Check,
  AlertCircle,
} from 'lucide-react-native';
import { useAuthStore } from '@/stores/auth.store';
import { businessApi, supplierApi, categoriesApi } from '@/services/api';
import type { Business, Category, Supplier, UserRole } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Spinner } from '@/components/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Colors, Spacing, Radius } from '@/constants/theme';

const ONBOARDING_ROLE_KEY = 'vendor_onboarding_role';

const steps = [
  { id: 1, title: 'Company Info', Icon: Building2 },
  { id: 2, title: 'Contact Details', Icon: Mail },
  { id: 3, title: 'Categories', Icon: Truck },
] as const;

interface FormData {
  company_name: string;
  desc: string;
  icon: string;
  banner: string;
  email: string;
  phone: string;
  address: string;
  shipping_address: string;
  categories: string[];
}

function syntheticBusiness(id: string, bid: string, form: FormData): Business {
  const now = new Date().toISOString();
  return {
    id,
    bid,
    company_name: form.company_name,
    desc: form.desc,
    icon: form.icon,
    banner: form.banner,
    email: form.email,
    phone: form.phone,
    address: form.address,
    shipping_address: form.shipping_address.trim() ? form.shipping_address : form.address,
    categories: form.categories,
    my_suppliers: [],
    handshake_requests: [],
    active_orders: [],
    order_history: [],
    created_at: now,
    updated_at: now,
  };
}

function syntheticSupplier(id: string, bid: string, form: FormData): Supplier {
  const now = new Date().toISOString();
  return {
    id,
    bid,
    company_name: form.company_name,
    desc: form.desc,
    icon: form.icon,
    banner: form.banner,
    email: form.email,
    phone: form.phone,
    address: form.address,
    shipping_address: form.shipping_address.trim() ? form.shipping_address : form.address,
    categories: form.categories,
    approved_businesses: [],
    handshake_requests: [],
    items: [],
    active_orders: [],
    order_history: [],
    created_at: now,
    updated_at: now,
  };
}

export default function OnboardingScreen() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const setProfile = useAuthStore(s => s.setProfile);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const [hydrated, setHydrated] = useState(false);
  const [categoryValidityMap, setCategoryValidityMap] = useState<Record<
    string,
    boolean
  > | null>(null);

  const [formData, setFormData] = useState<FormData>({
    company_name: '',
    desc: '',
    icon: '',
    banner: '',
    email: '',
    phone: '',
    address: '',
    shipping_address: '',
    categories: [],
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(ONBOARDING_ROLE_KEY);
        if (!cancelled && (saved === 'business' || saved === 'supplier')) {
          setRole(saved);
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await categoriesApi.getAll();
      if (data) setCategories(data);
      setLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace('/(auth)/login');
    }
  }, [hydrated, user, router]);

  const persistRole = useCallback(async (r: UserRole) => {
    setRole(r);
    if (r) await AsyncStorage.setItem(ONBOARDING_ROLE_KEY, r);
  }, []);

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (categoryOid: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryOid)
        ? prev.categories.filter(c => c !== categoryOid)
        : [...prev.categories, categoryOid],
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.company_name.trim()) {
          Toast.show({ type: 'error', text1: 'Please enter your company name' });
          return false;
        }
        return true;
      case 2:
        if (!formData.email.trim()) {
          Toast.show({ type: 'error', text1: 'Please enter your email' });
          return false;
        }
        if (!formData.phone.trim()) {
          Toast.show({ type: 'error', text1: 'Please enter your phone number' });
          return false;
        }
        if (!formData.address.trim()) {
          Toast.show({ type: 'error', text1: 'Please enter your address' });
          return false;
        }
        return true;
      case 3:
        if (formData.categories.length === 0) {
          Toast.show({ type: 'error', text1: 'Please select at least one category' });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3) || !user || !role) return;

    setLoading(true);
    try {
      const profileData = {
        bid: user.uid,
        company_name: formData.company_name,
        desc: formData.desc,
        icon: formData.icon,
        banner: formData.banner,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        shipping_address: formData.shipping_address.trim()
          ? formData.shipping_address
          : formData.address,
        categories: formData.categories,
      };

      if (role === 'business') {
        const { data, error } = await businessApi.create(profileData);
        if (error) {
          Toast.show({ type: 'error', text1: 'Failed to create profile', text2: error });
          return;
        }
        if (data) {
          const { data: fetched } = await businessApi.get(data.id);
          const profile = fetched ?? syntheticBusiness(data.id, user.uid, formData);
          setProfile(profile, 'business');
          await AsyncStorage.removeItem(ONBOARDING_ROLE_KEY);
          router.replace('/(app)/dashboard');
        }
      } else {
        const { data, error } = await supplierApi.create(profileData);
        if (error) {
          Toast.show({ type: 'error', text1: 'Failed to create profile', text2: error });
          return;
        }
        if (data) {
          setCategoryValidityMap(data.category_validity_map);
          const { data: fetched } = await supplierApi.get(data.id);
          const profile = fetched ?? syntheticSupplier(data.id, user.uid, formData);
          setProfile(profile, 'supplier');
          await AsyncStorage.removeItem(ONBOARDING_ROLE_KEY);
          setStep(4);
        }
      }
    } catch {
      Toast.show({ type: 'error', text1: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated || !user) {
    return <Spinner fullScreen />;
  }

  const validityEntries: [string, boolean][] =
    categoryValidityMap && Object.keys(categoryValidityMap).length > 0
      ? Object.entries(categoryValidityMap)
      : formData.categories.map(oid => {
          const c = categories.find(x => x.oid === oid);
          return [c?.title ?? oid, false] as [string, boolean];
        });

  if (step === 4 && role === 'supplier' && categoryValidityMap !== null) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          justifyContent: 'center',
          padding: Spacing.lg,
        }}
      >
        <Card style={{ maxWidth: 440, width: '100%', alignSelf: 'center' }}>
          <CardHeader style={{ alignItems: 'center', gap: Spacing.md }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: Radius.xl,
                backgroundColor: '#22C55E',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={28} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <CardTitle style={{ fontSize: 22, fontFamily: 'DMSans-Bold', textAlign: 'center' }}>
                Profile Created!
              </CardTitle>
              <CardDescription style={{ textAlign: 'center', marginTop: 6 }}>
                Your supplier profile has been set up successfully
              </CardDescription>
            </View>
          </CardHeader>
          <CardContent style={{ gap: Spacing.lg }}>
            <View>
              <Text
                style={{
                  fontFamily: 'PlusJakartaSans-Medium',
                  fontSize: 13,
                  color: Colors.mutedForeground,
                  marginBottom: Spacing.sm,
                }}
              >
                Category Status:
              </Text>
              <View style={{ gap: Spacing.sm }}>
                {validityEntries.map(([label, isValid]) => (
                  <View
                    key={label}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderWidth: 1,
                      borderColor: Colors.border,
                      borderRadius: Radius.md,
                      padding: Spacing.md,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'PlusJakartaSans-Medium',
                        fontSize: 14,
                        color: Colors.foreground,
                        flex: 1,
                        marginRight: Spacing.sm,
                      }}
                    >
                      {label}
                    </Text>
                    {isValid ? (
                      <Badge
                        style={{ backgroundColor: '#DCFCE7', borderColor: '#BBF7D0' }}
                        textStyle={{ color: '#15803D' }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Check size={12} color="#15803D" />
                          <Text style={{ fontFamily: 'PlusJakartaSans-Medium', fontSize: 12, color: '#15803D' }}>
                            Active
                          </Text>
                        </View>
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: '#FEF9C3', borderColor: '#FDE047' }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <AlertCircle size={12} color="#A16207" />
                          <Text style={{ fontFamily: 'PlusJakartaSans-Medium', fontSize: 12, color: '#A16207' }}>
                            Pending
                          </Text>
                        </View>
                      </Badge>
                    )}
                  </View>
                ))}
              </View>
            </View>
            <Button size="lg" onPress={() => router.replace('/(app)/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: Spacing.lg,
          paddingVertical: Spacing['2xl'],
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card style={{ maxWidth: 520, width: '100%', alignSelf: 'center' }}>
          <CardHeader style={{ alignItems: 'center', gap: Spacing.md }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: Radius.xl,
                backgroundColor: Colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Store size={28} color={Colors.primaryForeground} strokeWidth={2} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <CardTitle style={{ fontSize: 22, fontFamily: 'DMSans-Bold', textAlign: 'center' }}>
                {role === null
                  ? 'Set up your profile'
                  : `Set up your ${role === 'supplier' ? 'Supplier' : 'Business'} profile`}
              </CardTitle>
              <CardDescription style={{ textAlign: 'center', marginTop: 6 }}>
                Complete the following steps to get started
              </CardDescription>
            </View>
          </CardHeader>

          {role === null && (
            <CardContent style={{ paddingBottom: Spacing.md }}>
              <Text
                style={{
                  fontFamily: 'PlusJakartaSans-Medium',
                  fontSize: 14,
                  color: Colors.foreground,
                  marginBottom: Spacing.md,
                  textAlign: 'center',
                }}
              >
                Select your account type to continue
              </Text>
              <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                <Pressable
                  onPress={() => persistRole('business')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    padding: Spacing.lg,
                    borderRadius: Radius.lg,
                    borderWidth: 2,
                    borderColor: Colors.border,
                    backgroundColor: Colors.background,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: Colors.muted,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: Spacing.sm,
                    }}
                  >
                    <Building2 size={24} color={Colors.primary} />
                  </View>
                  <Text style={{ fontFamily: 'PlusJakartaSans-SemiBold', color: Colors.foreground }}>
                    Business
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => persistRole('supplier')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    padding: Spacing.lg,
                    borderRadius: Radius.lg,
                    borderWidth: 2,
                    borderColor: Colors.border,
                    backgroundColor: Colors.background,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: Colors.muted,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: Spacing.sm,
                    }}
                  >
                    <Truck size={24} color={Colors.primary} />
                  </View>
                  <Text style={{ fontFamily: 'PlusJakartaSans-SemiBold', color: Colors.foreground }}>
                    Supplier
                  </Text>
                </Pressable>
              </View>
            </CardContent>
          )}

          {role !== null && (
            <>
              <View style={{ paddingHorizontal: Spacing.lg }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {steps.map((s, index) => (
                    <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: step >= s.id ? Colors.primary : Colors.muted,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {step > s.id ? (
                          <Check size={20} color={Colors.primaryForeground} strokeWidth={2.5} />
                        ) : (
                          <s.Icon
                            size={20}
                            color={step >= s.id ? Colors.primaryForeground : Colors.mutedForeground}
                          />
                        )}
                      </View>
                      {index < steps.length - 1 && (
                        <View
                          style={{
                            width: 36,
                            height: 3,
                            marginHorizontal: 4,
                            borderRadius: 2,
                            backgroundColor: step > s.id ? Colors.primary : Colors.border,
                          }}
                        />
                      )}
                    </View>
                  ))}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: Spacing.sm,
                    paddingHorizontal: 4,
                  }}
                >
                  {steps.map(s => (
                    <Text
                      key={s.id}
                      style={{
                        width: 72,
                        textAlign: 'center',
                        fontSize: 11,
                        fontFamily: 'PlusJakartaSans',
                        color: Colors.mutedForeground,
                      }}
                      numberOfLines={2}
                    >
                      {s.title}
                    </Text>
                  ))}
                </View>
              </View>

              <CardContent style={{ marginTop: Spacing.lg, gap: Spacing.lg }}>
                {step === 1 && (
                  <View style={{ gap: Spacing.md }}>
                    <Input
                      label="Company Name *"
                      placeholder="Enter your company name"
                      value={formData.company_name}
                      onChangeText={v => updateFormData('company_name', v)}
                    />
                    <TextArea
                      label="Description"
                      placeholder="Tell us about your company"
                      value={formData.desc}
                      onChangeText={v => updateFormData('desc', v)}
                    />
                    <Input
                      label="Logo URL"
                      placeholder="https://example.com/logo.png"
                      value={formData.icon}
                      onChangeText={v => updateFormData('icon', v)}
                    />
                    <Input
                      label="Banner URL"
                      placeholder="https://example.com/banner.png"
                      value={formData.banner}
                      onChangeText={v => updateFormData('banner', v)}
                    />
                  </View>
                )}

                {step === 2 && (
                  <View style={{ gap: Spacing.md }}>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Mail size={16} color={Colors.foreground} style={{ marginRight: 6 }} />
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'PlusJakartaSans-Medium',
                            color: Colors.foreground,
                          }}
                        >
                          Business Email *
                        </Text>
                      </View>
                      <Input
                        placeholder="contact@company.com"
                        value={formData.email}
                        onChangeText={v => updateFormData('email', v)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Phone size={16} color={Colors.foreground} style={{ marginRight: 6 }} />
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'PlusJakartaSans-Medium',
                            color: Colors.foreground,
                          }}
                        >
                          Phone Number *
                        </Text>
                      </View>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChangeText={v => updateFormData('phone', v)}
                        keyboardType="phone-pad"
                      />
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <MapPin size={16} color={Colors.foreground} style={{ marginRight: 6 }} />
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'PlusJakartaSans-Medium',
                            color: Colors.foreground,
                          }}
                        >
                          Business Address *
                        </Text>
                      </View>
                      <TextArea
                        placeholder="123 Business St, City, State 12345"
                        value={formData.address}
                        onChangeText={v => updateFormData('address', v)}
                      />
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Truck size={16} color={Colors.foreground} style={{ marginRight: 6 }} />
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'PlusJakartaSans-Medium',
                            color: Colors.foreground,
                          }}
                        >
                          Shipping Address
                        </Text>
                      </View>
                      <TextArea
                        placeholder="Leave empty if same as business address"
                        value={formData.shipping_address}
                        onChangeText={v => updateFormData('shipping_address', v)}
                      />
                    </View>
                  </View>
                )}

                {step === 3 && (
                  <View>
                    <Text
                      style={{
                        fontFamily: 'PlusJakartaSans',
                        fontSize: 14,
                        color: Colors.mutedForeground,
                        marginBottom: Spacing.md,
                      }}
                    >
                      Select the categories that best describe your{' '}
                      {role === 'supplier' ? 'products' : 'needs'}:
                    </Text>
                    {loadingCategories ? (
                      <View style={{ paddingVertical: Spacing['2xl'], alignItems: 'center' }}>
                        <Spinner size="large" />
                      </View>
                    ) : categories.length === 0 ? (
                      <View
                        style={{
                          borderWidth: 1,
                          borderStyle: 'dashed',
                          borderColor: Colors.border,
                          borderRadius: Radius.md,
                          padding: Spacing['2xl'],
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'PlusJakartaSans',
                            color: Colors.mutedForeground,
                            textAlign: 'center',
                          }}
                        >
                          No categories available yet. You can add them later.
                        </Text>
                      </View>
                    ) : (
                      <ScrollView
                        style={{ maxHeight: 320 }}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator
                      >
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md }}>
                          {categories.map(category => {
                            const selected = formData.categories.includes(category.oid);
                            return (
                              <Pressable
                                key={category.oid}
                                onPress={() => toggleCategory(category.oid)}
                                style={{
                                  width: '47%',
                                  minWidth: 140,
                                  flexGrow: 1,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: Spacing.sm,
                                  padding: Spacing.md,
                                  borderRadius: Radius.lg,
                                  borderWidth: 2,
                                  borderColor: selected ? Colors.primary : Colors.border,
                                  backgroundColor: selected ? `${Colors.primary}0D` : Colors.background,
                                }}
                              >
                                <View pointerEvents="none">
                                  <Checkbox checked={selected} onCheckedChange={() => {}} />
                                </View>
                                {category.icon ? (
                                  <Text style={{ fontSize: 18 }}>{category.icon}</Text>
                                ) : null}
                                <Text
                                  style={{
                                    flex: 1,
                                    fontFamily: 'PlusJakartaSans-Medium',
                                    fontSize: 13,
                                    color: Colors.foreground,
                                  }}
                                  numberOfLines={2}
                                >
                                  {category.title}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      </ScrollView>
                    )}
                  </View>
                )}

                <View style={{ flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm }}>
                  {step > 1 && (
                    <Button variant="outline" onPress={handleBack} disabled={loading} style={{ flex: 1 }}>
                      Back
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button onPress={handleNext} style={{ flex: 1 }}>
                      Continue
                    </Button>
                  ) : (
                    <Button onPress={handleSubmit} loading={loading} disabled={loading} style={{ flex: 1 }}>
                      Complete Setup
                    </Button>
                  )}
                </View>
              </CardContent>
            </>
          )}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
