// NAVEGACION: aqui armo toda la estructura de pantallas.
//
//   Tab (pestanas de abajo)
//     Home      -> Stack: HomeList (lista) -> HomeDetail (detalle)
//     Favorites -> FavoritesScreen (prioritarios)

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { COLORS, TYPOGRAPHY } from '../theme';
import type { HomeStackParamList, RootTabParamList } from './types';

// Colores del header (la barra de arriba). Se usa en las dos pestanas.
const HEADER_OPTIONS = {
  headerStyle: { backgroundColor: COLORS.surface },
  headerTintColor: COLORS.textPrimary,
  headerTitleStyle: { fontWeight: TYPOGRAPHY.weight.bold },
};

// ---------- STACK de la pestana Home ----------

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator(): React.JSX.Element {
  return (
    <HomeStack.Navigator screenOptions={HEADER_OPTIONS}>
      {/* Primera pantalla del stack: la lista */}
      <HomeStack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ title: 'Recepciones de la planta' }}
      />
      {/* Segunda pantalla: el detalle. El titulo sale de los params. */}
      <HomeStack.Screen
        name="HomeDetail"
        component={DetailScreen}
        options={({ route }) => ({ title: `Recepcion ${route.params.name}` })}
      />
    </HomeStack.Navigator>
  );
}

// ---------- TABS (raiz) ----------

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Home ya tiene el header del Stack. Se apaga el del Tab para no tener dos.
        headerShown: false,
        // Icono de cada pestana. "focused" = esta pestana esta activa.
        tabBarIcon: ({ focused, color, size }) => {
          let nombreIcono: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Home') {
            nombreIcono = focused ? 'car' : 'car-outline';
          } else {
            nombreIcono = focused ? 'star' : 'star-outline';
          }
          return <Ionicons name={nombreIcono} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.tabActive,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Recepciones' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Prioritarias',
          // Esta pestana no tiene Stack, asi que aqui si se enciende el header.
          headerShown: true,
          title: 'Camiones prioritarios',
          ...HEADER_OPTIONS,
        }}
      />
    </Tab.Navigator>
  );
}