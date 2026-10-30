// STORE: camiones prioritarios (estado global con Zustand).
// Cualquier pantalla puede leerlo o cambiarlo, sin pasar props.

import { create } from 'zustand';
import { Recepcion } from '../types';

// Que tiene el store: los datos y las acciones para cambiarlos.
interface PrioritariasStore {
  // Lista de camiones prioritarios.
  recepciones: Recepcion[];

  // Agrega un camion. Si ya esta, no hace nada (sin repetidos).
  agregarPrioritaria: (recepcion: Recepcion) => void;

  // Quita un camion por su id.
  quitarPrioritaria: (id: string) => void;

  // Borra todos.
  limpiarPrioritarias: () => void;
}

// "set" cambia el estado. Siempre se crea una lista nueva, no se modifica la vieja.
export const usePrioritariasStore = create<PrioritariasStore>((set) => ({
  recepciones: [],

  agregarPrioritaria: (recepcion) =>
    set((state) => {
      const yaEsta = state.recepciones.some((r) => r.id === recepcion.id);
      if (yaEsta) {
        return state; // no cambia nada
      }
      return { recepciones: [...state.recepciones, recepcion] };
    }),

  quitarPrioritaria: (id) =>
    set((state) => ({
      recepciones: state.recepciones.filter((r) => r.id !== id),
    })),

  limpiarPrioritarias: () => set({ recepciones: [] }),
}));