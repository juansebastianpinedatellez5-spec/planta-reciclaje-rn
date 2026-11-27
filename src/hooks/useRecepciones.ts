// HOOKS DE LECTURA: piden los camiones a la API con useQuery.
// Las pantallas usan estos hooks. Nunca llaman a Axios directo.
// La lista guarda una copia en AsyncStorage para verla sin internet.

import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';
import { Recepcion, RecepcionesConOrigen } from '../types';

// Nombre del "cajon" donde TanStack Query guarda la lista.
// Esta afuera para usar el mismo nombre al invalidar (sin errores de escritura).
export const RECEPCIONES_QUERY_KEY = ['recepciones'] as const;

// Nombre con que se guarda la copia en el telefono (AsyncStorage).
const CACHE_KEY = '@recepciones_cache';

// Pide la lista completa de camiones.
export function useRecepciones() {
  return useQuery<RecepcionesConOrigen>({
    queryKey: RECEPCIONES_QUERY_KEY,
    queryFn: async (): Promise<RecepcionesConOrigen> => {
      let recepciones: Recepcion[];

      try {
        // 1. Intenta pedir la lista a la API.
        const { data } = await apiClient.get<Recepcion[]>('/recepciones');
        recepciones = data;
      } catch (errorRed) {
        // 2. Sin internet: busca la copia guardada.
        const guardado = await AsyncStorage.getItem(CACHE_KEY);
        if (guardado !== null) {
          // AsyncStorage solo guarda texto, por eso se convierte con JSON.parse.
          return {
            recepciones: JSON.parse(guardado) as Recepcion[],
            origen: 'cache',
          };
        }
        // 3. Sin internet y sin copia: ahora si es un error.
        throw errorRed;
      }

      // Con internet: guarda una copia nueva para la proxima vez.
      // AsyncStorage solo guarda texto, por eso se convierte con JSON.stringify.
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(recepciones));
      return { recepciones, origen: 'red' };
    },
  });
}

// Pide UN camion por su id (para el detalle).
export function useRecepcion(id: string) {
  return useQuery<Recepcion>({
    // ['recepciones', '3'] = un cajon por cada camion.
    queryKey: [...RECEPCIONES_QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await apiClient.get<Recepcion>(`/recepciones/${id}`);
      return data;
    },
    // Solo pide si hay un id.
    enabled: id !== '',
  });
}