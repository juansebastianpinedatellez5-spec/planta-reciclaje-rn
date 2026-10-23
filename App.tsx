// App.tsx: punto de entrada.
// NavigationContainer envuelve TODA la navegacion de la app.

import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { COLORS } from './src/theme';

// Tema oscuro de la navegacion con los colores de la planta.
// Sin esto, los fondos entre pantallas salen blancos.
const TEMA_NAVEGACION = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.textPrimary,
    border: COLORS.border,
    primary: COLORS.tabActive,
  },
};

export default function App(): React.JSX.Element {
  return (
    // SafeAreaProvider: calcula los bordes seguros del celular (camara, barra).
    <SafeAreaProvider>
      <NavigationContainer theme={TEMA_NAVEGACION}>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}