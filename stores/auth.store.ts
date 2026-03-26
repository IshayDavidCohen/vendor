import { create } from 'zustand';
import type { Business, Supplier, UserRole } from '@/types';
import { mockBusinesses, mockSuppliers } from '@/mocks/data';

const BYPASS_AUTH = true;

interface MockUser {
  uid: string;
  email: string;
}

interface AuthState {
  user: MockUser | null;
  profile: Business | Supplier | null;
  role: UserRole;
  platformId: string | null;
  loading: boolean;
  isOnboarded: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<string>;
  signOut: () => Promise<void>;
  setProfile: (profile: Business | Supplier, role: UserRole) => void;
  setOnboarded: (value: boolean) => void;
  refreshProfile: () => Promise<void>;
  toggleMockRole: () => void;
}

function getMockBusiness(): Business {
  return mockBusinesses().find(b => b.id === 'bus-demo')!;
}

function getMockSupplier(): Supplier {
  return mockSuppliers().find(s => s.id === 'sup-premium-wines')!;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: BYPASS_AUTH ? { uid: 'mock-firebase-uid', email: 'demo@vendor.com' } : null,
  profile: BYPASS_AUTH ? getMockBusiness() : null,
  role: BYPASS_AUTH ? 'business' : null,
  platformId: BYPASS_AUTH ? 'bus-demo' : null,
  loading: false,
  isOnboarded: BYPASS_AUTH,

  signIn: async (_email: string, _password: string) => {
    set({ loading: true });
    await new Promise(r => setTimeout(r, 300));
    const profile = getMockBusiness();
    set({
      user: { uid: 'mock-firebase-uid', email: _email },
      profile,
      role: 'business',
      platformId: profile.id,
      loading: false,
      isOnboarded: true,
    });
  },

  signUp: async (_email: string, _password: string) => {
    set({ loading: true });
    await new Promise(r => setTimeout(r, 300));
    set({
      user: { uid: 'mock-firebase-uid', email: _email },
      profile: null,
      role: null,
      platformId: null,
      loading: false,
      isOnboarded: false,
    });
    return 'mock-firebase-uid';
  },

  signOut: async () => {
    set({
      user: null,
      profile: null,
      role: null,
      platformId: null,
      isOnboarded: false,
    });
  },

  setProfile: (profile: Business | Supplier, role: UserRole) => {
    set({
      profile,
      role,
      platformId: profile.id,
      isOnboarded: true,
    });
  },

  setOnboarded: (value: boolean) => {
    set({ isOnboarded: value });
  },

  refreshProfile: async () => {
    const { role, platformId } = get();
    if (!platformId) return;
    if (role === 'business') {
      set({ profile: getMockBusiness() });
    } else if (role === 'supplier') {
      set({ profile: getMockSupplier() });
    }
  },

  toggleMockRole: () => {
    const { role } = get();
    if (role === 'business') {
      const supplier = getMockSupplier();
      set({
        profile: supplier,
        role: 'supplier',
        platformId: supplier.id,
      });
    } else {
      const business = getMockBusiness();
      set({
        profile: business,
        role: 'business',
        platformId: business.id,
      });
    }
  },
}));
