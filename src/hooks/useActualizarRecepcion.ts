// HOOK DE ESCRITURA: actualiza un camion que ya existe (PUT).
// Despues de guardar, avisa a TanStack Query que los datos quedaron viejos.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { Recepcion } from '../types';
import { RECEPCIONES_QUERY_KEY } from './useRecepciones';

export function useActualizarRecepcion() {
  const queryClient = useQueryClient();

  // Recibe el camion completo (con id) y devuelve el camion guardado.
  return useMutation<Recepcion, Error, Recepcion>({
    // PUT /recepciones/3 reemplaza los datos de ese camion.
    mutationFn: async (recepcion) => {
      const { data } = await apiClient.put<Recepcion>(
        `/recepciones/${recepcion.id}`,
        recepcion,
      );
      return data;
    },
    // Invalida ['recepciones']: eso incluye la lista Y cada camion individual
    // (['recepciones', '3']), porque todos empiezan con la misma llave.
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: RECEPCIONES_QUERY_KEY });
    },
  });
}