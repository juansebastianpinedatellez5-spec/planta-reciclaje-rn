// TIPOS DE NAVEGACION: aqui digo que pantallas existen y que datos recibe cada una.
// Asi TypeScript avisa si navego mal o me olvido un dato.

import type { NavigatorScreenParams } from '@react-navigation/native';

// Pantallas del Stack que vive dentro de la pestana Home.
export type HomeStackParamList = {
  // La lista no recibe datos.
  HomeList: undefined;
  // El detalle recibe el id y el nombre (la placa) del camion.
  HomeDetail: {
    id: string;
    name: string;
  };
};

// Pestanas de abajo.
export type RootTabParamList = {
  // Home guarda un Stack adentro. Por eso su tipo es NavigatorScreenParams.
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Favorites: undefined;
};