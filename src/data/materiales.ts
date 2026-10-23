// TEXTOS E IMAGENES: nombres bonitos e imagen de cada material y estado.
// Antes estaban en RecepcionCard. Ahora las usan la tarjeta y el detalle.

import { ImageSourcePropType } from 'react-native';
import { Material, Estado } from '../types';

// Nombre que se ve en pantalla.
export const NOMBRE_MATERIAL: Record<Material, string> = {
  plastico: 'Plastico',
  carton: 'Carton',
  vidrio: 'Vidrio',
  metal: 'Metal',
};

// Una imagen local por cada material.
export const IMAGEN_MATERIAL: Record<Material, ImageSourcePropType> = {
  plastico: require('../../assets/images/plastico.png'),
  carton: require('../../assets/images/carton.png'),
  vidrio: require('../../assets/images/vidrio.png'),
  metal: require('../../assets/images/metal.png'),
};

// Nombre del estado que se ve en pantalla.
export const NOMBRE_ESTADO: Record<Estado, string> = {
  en_bascula: 'En bascula',
  descargando: 'Descargando',
  finalizado: 'Finalizado',
};