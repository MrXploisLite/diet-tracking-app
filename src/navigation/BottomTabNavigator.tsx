import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, MealsScreen, ProgressScreen, ProfileScreen } from '../screens';
import { useApp } from '../context/AppContext';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator: React.FC = () => {
  const { theme } = useApp();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Meals"
        component={MealsScreen}
        options={{
          tabBarLabel: 'Meals',
          tabBarIcon: ({ color }) => <MealsIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({ color }) => <ProgressIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const HomeIcon: React.FC<{ color: string }> = () => (
  <Text style={{ fontSize: 24 }}>🏠</Text>
);

const MealsIcon: React.FC<{ color: string }> = () => (
  <Text style={{ fontSize: 24 }}>🍽️</Text>
);

const ProgressIcon: React.FC<{ color: string }> = () => (
  <Text style={{ fontSize: 24 }}>📊</Text>
);

const ProfileIcon: React.FC<{ color: string }> = () => (
  <Text style={{ fontSize: 24 }}>👤</Text>
);
