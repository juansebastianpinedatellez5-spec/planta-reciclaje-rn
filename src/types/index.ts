// TIPOS: aqui defino la forma de los datos de la planta.
// Todo el proyecto usa estos tipos. Asi TypeScript avisa si me equivoco.

// Los 4 materiales que clasifica la planta.
export type Material = 'plastico' | 'carton' | 'vidrio' | 'metal';

// Estados de una recepcion (camion que llega a la bascula).
export type Estado = 'en_bascula' | 'descargando' | 'finalizado';

// Una recepcion = un camion que llega con material.
// Es el "elemento" del dominio (como Libro en biblioteca).
export interface Recepcion {
  id: string;
  placa: string; // placa del camion
  conductor: string;
  material: Material;
  pesoKg: number; // peso neto en kilos
  estado: Estado;
}