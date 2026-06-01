import React from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../../components/shared/Badge';
import { useNotificationsStore } from '../../store/notificationsStore';
import { useMessagesStore } from '../../store/messagesStore';
import { BOTTOM_TAB_HEIGHT } from '../../constants';

type TabIconName =
  | 'home'
  | 'search'
  | 'add-circle'
  | 'play'
  | 'person';

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: 'home', inactive: 'home-outline' },
  explore: { active: 'search', inactive: 'search-outline' },
  create: { active: 'add-circle', inactive: 'add-circle-outline' },
  reels: { active: 'play-circle', inactive: 'play-circle-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { unreadCount: notifCount } = useNotificationsStore();
  const { chats } = useMessagesStore();
  const messageCount = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 0.5,
          height: BOTTOM_TAB_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
          elevation: 0,
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          if (!icons) return null;
          return (
            <View style={{ position: 'relative' }}>
              <Ionicons
                name={focused ? icons.active : icons.inactive}
                size={route.name === 'create' ? 30 : 26}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="create" />
      <Tabs.Screen name="reels" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
