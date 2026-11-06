// HOOKS DE LECTURA: piden los camiones a la API con useQuery.
// Las pantallas usan estos hooks. Nunca llaman a Axios directo.

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { Recepcion } from '../types';

// Nombre del "cajon" donde TanStack Query guarda la lista.
// Esta afuera para usar el mismo nombre al invalidar (sin errores de escritura).
export const RECEPCIONES_QUERY_KEY = ['recepciones'] as const;

// Pide la lista completa de camiones.
export function useRecepciones() {
  return useQuery<Recepcion[]>({
    queryKey: RECEPCIONES_QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<Recepcion[]>('/recepciones');
      return data;
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