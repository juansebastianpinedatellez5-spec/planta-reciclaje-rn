// HOOK DE ESCRITURA: crea un camion nuevo con useMutation.
// Despues de crear, avisa a TanStack Query que la lista quedo vieja.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { CrearRecepcionPayload, Recepcion } from '../types';
import { RECEPCIONES_QUERY_KEY } from './useRecepciones';

export function useCrearRecepcion() {
  // queryClient = el administrador del cache.
  const queryClient = useQueryClient();

  // Tipos: <lo que devuelve, tipo de error, lo que recibe>
  return useMutation<Recepcion, Error, CrearRecepcionPayload>({
    // Envia el POST a la API.
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<Recepcion>('/recepciones', payload);
      return data;
    },
    // Si salio bien: marca la lista como vieja y la vuelve a pedir sola.
    // "return" hace que la mutacion espere a que la lista termine de actualizarse.
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: RECEPCIONES_QUERY_KEY });
    },
  });
}