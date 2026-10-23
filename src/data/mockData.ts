// DATOS DE PRUEBA: camiones que llegan a la planta.
// Todavia no hay base de datos. Por ahora son datos fijos.
// Cada dato sigue el tipo Recepcion.

import { Recepcion } from '../types';

export const RECEPCIONES: Recepcion[] = [
  {
    id: '1',
    placa: 'SXK-421',
    conductor: 'Carlos Ramirez',
    material: 'plastico',
    pesoKg: 3200,
    estado: 'en_bascula',
    imageUri: 'https://picsum.photos/seed/plastico/300/200',
  },
  {
    id: '2',
    placa: 'TBN-918',
    conductor: 'Luz Marina Gomez',
    material: 'carton',
    pesoKg: 5400,
    estado: 'descargando',
    imageUri: 'https://picsum.photos/seed/carton/300/200',
  },
  {
    id: '3',
    placa: 'WQR-205',
    conductor: 'Andres Pineda',
    material: 'vidrio',
    pesoKg: 4100,
    estado: 'finalizado',
    imageUri: 'https://picsum.photos/seed/vidrio/300/200',
  },
  {
    id: '4',
    placa: 'UDF-677',
    conductor: 'Marta Rojas',
    material: 'metal',
    pesoKg: 2750,
    estado: 'finalizado',
    imageUri: 'https://picsum.photos/seed/metal/300/200',
  },
];
