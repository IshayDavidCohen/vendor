import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';

// export default function Index() {
//   const user = useAuthStore(s => s.user);
//   const isOnboarded = useAuthStore(s => s.isOnboarded);

//   if (!user) {
//     return <Redirect href="/(auth)/login" />;
//   }
//   if (!isOnboarded) {
//     return <Redirect href="/onboarding" />;
//   }
//   return <Redirect href="/(app)/dashboard" />;
// }
export default function Index() {
  const user = useAuthStore(s => s.user);
  const isOnboarded = useAuthStore(s => s.isOnboarded);

  if (!user) {
    return <Redirect href="/(marketing)/landing" />;
  }
  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(app)/dashboard" />;
}
