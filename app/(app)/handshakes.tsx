import { useCallback, useEffect, useState, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

import { useAuthStore } from '@/stores/auth.store';
import { handshakeApi } from '@/services/api';
import type { Handshake } from '@/types';
import { HandshakeCard } from '@/components/HandshakeCard';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent } from '@/components/ui/Card';
import { Colors } from '@/constants/theme';

function HandshakeSkeleton() {
  return (
    <Card>
      <CardContent style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Skeleton width={48} height={48} borderRadius={24} />
            <View>
              <Skeleton width={96} height={18} borderRadius={6} />
              <Skeleton
                width={120}
                height={14}
                borderRadius={6}
                style={{ marginTop: 6 }}
              />
            </View>
          </View>
          <Skeleton width={80} height={24} borderRadius={12} />
        </View>
      </CardContent>
    </Card>
  );
}

export default function HandshakesScreen() {
  const role = useAuthStore(s => s.role);
  const platformId = useAuthStore(s => s.platformId);
  const VALID_HS_TABS = ['all', 'incoming', 'outgoing', 'connected'];
  const [handshakes, setHandshakes] = useState<Handshake[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHandshakes = useCallback(async () => {
    if (!platformId || !role) {
      setHandshakes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await handshakeApi.getUserHandshakes(role, platformId);
      if (error) {
        Toast.show({ type: 'error', text1: 'Failed to load handshakes', text2: error });
        return;
      }
      if (data) setHandshakes(data);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to load handshakes' });
    } finally {
      setLoading(false);
    }
  }, [platformId, role]);

  useEffect(() => {
    fetchHandshakes();
  }, [fetchHandshakes]);

  const incoming = handshakes.filter(h => h.recipient_id === platformId);
  const outgoing = handshakes.filter(h => h.sender_id === platformId);
  const connected = handshakes.filter(
    h => h.status === 'accepted' || h.status === 'acknowledged',
  );

  if (!platformId || !role) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.background }}
        edges={['bottom']}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <PageHeader
            title="Handshakes"
            description="Manage your connection requests with partners"
          />
          <EmptyState
            icon={<Users size={40} color={Colors.mutedForeground} />}
            title="Sign in required"
            description="Unable to load handshakes without an active account."
          />
        </View>
      </SafeAreaView>
    );
  }

  // ── Tab selection: param-driven + user-clickable, no useEffect ──────────
  const params = useLocalSearchParams<{ tab?: string }>();
  const lastParamRef = useRef<string | undefined>(undefined);
  const [userHsTab, setUserHsTab] = useState<string>('all');

  let activeHsTab = userHsTab;
  if (params.tab !== lastParamRef.current) {
    lastParamRef.current = params.tab;
    const fromParam = params.tab && VALID_HS_TABS.includes(params.tab) ? params.tab : 'all';
    activeHsTab = fromParam;
    if (userHsTab !== fromParam) setUserHsTab(fromParam);
  }

  const handleHsTabChange = (tab: string) => {
    setUserHsTab(tab);
  };

  const renderHandshakeList = (list: Handshake[], emptyTitle: string, emptyDescription: string) => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
      keyboardShouldPersistTaps="handled"
    >
      {list.length === 0 ? (
        <EmptyState
          icon={<Users size={40} color={Colors.mutedForeground} />}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        list.map(h => (
          <HandshakeCard
            key={h.id}
            handshake={h}
            role={role}
            platformId={platformId}
            onUpdate={fetchHandshakes}
          />
        ))
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.background }}
      edges={['bottom']}
    >
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
        <PageHeader
          title="Handshakes"
          description="Manage your connection requests with partners"
        />

        <Tabs defaultValue="all" value={activeHsTab} onValueChange={handleHsTabChange} style={{ flex: 1 }}>
          <TabsList scrollable style={{ marginBottom: 8 }}>
            <TabsTrigger value="all" style={{ flexGrow: 0, minWidth: 72 }}>
              {`All (${handshakes.length})`}
            </TabsTrigger>
            <TabsTrigger value="incoming" style={{ flexGrow: 0, minWidth: 96 }}>
              {`Incoming (${incoming.length})`}
            </TabsTrigger>
            <TabsTrigger value="outgoing" style={{ flexGrow: 0, minWidth: 96 }}>
              {`Outgoing (${outgoing.length})`}
            </TabsTrigger>
            <TabsTrigger value="connected" style={{ flexGrow: 0, minWidth: 104 }}>
              {`Connected (${connected.length})`}
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <View style={{ gap: 12 }}>
              {[0, 1, 2].map(i => (
                <HandshakeSkeleton key={i} />
              ))}
            </View>
          ) : (
            <>
              <TabsContent value="all" style={{ flex: 1 }}>
                {renderHandshakeList(
                  handshakes,
                  'No handshakes yet',
                  'Connection requests will appear here',
                )}
              </TabsContent>
              <TabsContent value="incoming" style={{ flex: 1 }}>
                {renderHandshakeList(
                  incoming,
                  'No incoming requests',
                  'When someone reaches out to you, it will show up here',
                )}
              </TabsContent>
              <TabsContent value="outgoing" style={{ flex: 1 }}>
                {renderHandshakeList(
                  outgoing,
                  'No outgoing requests',
                  'Requests you send to partners will appear here',
                )}
              </TabsContent>
              <TabsContent value="connected" style={{ flex: 1 }}>
                {renderHandshakeList(
                  connected,
                  'No active connections',
                  'Accepted or acknowledged handshakes are listed here',
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
