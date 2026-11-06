// App.tsx: punto de entrada.
// QueryClientProvider: da TanStack Query a toda la app.
// NavigationContainer: envuelve TODA la navegacion de la app.

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { COLORS } from './src/theme';

// El QueryClient se crea AFUERA del componente.
// Asi hay uno solo y no se vuelve a crear en cada render.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Por 2 minutos los datos se consideran "frescos" y no se vuelven a pedir.
      staleTime: 1000 * 60 * 2,
      // Si falla, reintenta 1 vez antes de mostrar el error.
      retry: 1,
      // En el celular no existe "volver a la ventana". Se apaga.
      refetchOnWindowFocus: false,
    },
  },
});

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
    // QueryClientProvider va por fuera: todo lo de adentro puede usar useQuery.
    <QueryClientProvider client={queryClient}>
      {/* SafeAreaProvider: calcula los bordes seguros del celular (camara, barra). */}
      <SafeAreaProvider>
        <NavigationContainer theme={TEMA_NAVEGACION}>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}