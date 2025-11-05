import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { AppNavigator } from './src/navigation';
import { LoadingScreen } from './src/components';

function AppContent() {
  const { isLoading, theme } = useApp();

  if (isLoading) {
    return <LoadingScreen color={theme.colors.primary} />;
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
