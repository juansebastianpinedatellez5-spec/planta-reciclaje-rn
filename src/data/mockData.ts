// DATOS DE PRUEBA: camiones que llegan a la planta.
// Ahora son 12 para que la lista sea larga y la busqueda tenga sentido.
// Cada dato sigue el tipo Recepcion. El id es unico.

import { Recepcion } from '../types';

export const RECEPCIONES: Recepcion[] = [
  { id: '1', placa: 'SXK-421', conductor: 'Carlos Ramirez', material: 'plastico', pesoKg: 3200, estado: 'en_bascula' },
  { id: '2', placa: 'TBN-918', conductor: 'Luz Marina Gomez', material: 'carton', pesoKg: 5400, estado: 'descargando' },
  { id: '3', placa: 'WQR-205', conductor: 'Andres Pineda', material: 'vidrio', pesoKg: 4100, estado: 'finalizado' },
  { id: '4', placa: 'UDF-677', conductor: 'Marta Rojas', material: 'metal', pesoKg: 2750, estado: 'finalizado' },
  { id: '5', placa: 'KLM-310', conductor: 'Jorge Castillo', material: 'plastico', pesoKg: 1980, estado: 'descargando' },
  { id: '6', placa: 'PRT-842', conductor: 'Diana Suarez', material: 'carton', pesoKg: 6100, estado: 'en_bascula' },
  { id: '7', placa: 'GHJ-559', conductor: 'Felipe Mora', material: 'metal', pesoKg: 3600, estado: 'finalizado' },
  { id: '8', placa: 'XCV-127', conductor: 'Paola Herrera', material: 'vidrio', pesoKg: 2900, estado: 'descargando' },
  { id: '9', placa: 'BNM-733', conductor: 'Ricardo Duarte', material: 'plastico', pesoKg: 4450, estado: 'finalizado' },
  { id: '10', placa: 'ZAQ-064', conductor: 'Sandra Vargas', material: 'carton', pesoKg: 5200, estado: 'en_bascula' },
  { id: '11', placa: 'LKJ-481', conductor: 'Mauricio Leon', material: 'metal', pesoKg: 3050, estado: 'descargando' },
  { id: '12', placa: 'MNB-296', conductor: 'Camila Ortiz', material: 'vidrio', pesoKg: 3750, estado: 'finalizado' },
];


