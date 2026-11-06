// STORE: camiones prioritarios (estado global con Zustand).
// Cualquier pantalla puede leerlo o cambiarlo, sin pasar props.
//
// IMPORTANTE: aqui solo se guardan los IDS que el usuario marco.
// Los datos de los camiones viven en TanStack Query (vienen de la API).
// Regla: datos del servidor -> TanStack Query. Marcas del usuario -> Zustand.

import { create } from 'zustand';

// Que tiene el store: los datos y las acciones para cambiarlos.
interface PrioritariasStore {
  // Ids de los camiones marcados como prioritarios.
  ids: string[];

  // Agrega un id. Si ya esta, no hace nada (sin repetidos).
  agregarPrioritaria: (id: string) => void;

  // Quita un id.
  quitarPrioritaria: (id: string) => void;

  // Borra todos.
  limpiarPrioritarias: () => void;
}

// "set" cambia el estado. Siempre se crea una lista nueva, no se modifica la vieja.
export const usePrioritariasStore = create<PrioritariasStore>((set) => ({
  ids: [],

  agregarPrioritaria: (id) =>
    set((state) => {
      if (state.ids.includes(id)) {
        return state; // no cambia nada
      }
      return { ids: [...state.ids, id] };
    }),

  quitarPrioritaria: (id) =>
    set((state) => ({
      ids: state.ids.filter((x) => x !== id),
    })),

  limpiarPrioritarias: () => set({ ids: [] }),
}));