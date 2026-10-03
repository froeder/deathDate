import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors, fonts } from '@/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          ) : undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Contagem',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'hourglass' : 'hourglass-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="assessment"
        options={{
          title: 'Meus Hábitos',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'heart-circle' : 'heart-circle-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Ciência',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'analytics' : 'analytics-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(10, 12, 22, 0.75)' : '#0A0C16',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 0,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
  },
});
