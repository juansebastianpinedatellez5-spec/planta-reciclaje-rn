// COMPONENTE: RecepcionCard
// Una tarjeta que muestra un camion que llego a la planta.
// Se usa una vez por cada recepcion en HomeScreen.

import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Recepcion, Material, Estado } from '../types';

// Textos bonitos para mostrar en pantalla.
const NOMBRE_MATERIAL: Record<Material, string> = {
  plastico: 'Plastico',
  carton: 'Carton',
  vidrio: 'Vidrio',
  metal: 'Metal',
};

const NOMBRE_ESTADO: Record<Estado, string> = {
  en_bascula: 'En bascula',
  descargando: 'Descargando',
  finalizado: 'Finalizado',
};

// Props = lo que el componente recibe desde afuera.
interface RecepcionCardProps {
  recepcion: Recepcion;
  onPress: (recepcion: Recepcion) => void;
}

export function RecepcionCard({
  recepcion,
  onPress,
}: RecepcionCardProps): React.JSX.Element {
  return (
    // Pressable: cuando lo tocan, "pressed" es true y la tarjeta cambia de color.
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(recepcion)}
    >
      <Image
        source={{ uri: recepcion.imageUri }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.body}>
        <Text style={styles.placa}>{recepcion.placa}</Text>
        <Text style={styles.conductor}>{recepcion.conductor}</Text>

        {/* Fila: material a la izquierda, peso a la derecha */}
        <View style={styles.row}>
          <Text style={styles.material}>{NOMBRE_MATERIAL[recepcion.material]}</Text>
          <Text style={styles.peso}>{recepcion.pesoKg} kg</Text>
        </View>

        <Text style={styles.estado}>{NOMBRE_ESTADO[recepcion.estado]}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  // Se aplica solo mientras el dedo esta encima.
  cardPressed: {
    backgroundColor: '#21262d',
  },
  image: {
    width: '100%',
    height: 160,
  },
  body: {
    padding: 16,
    gap: 4,
  },
  placa: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  conductor: {
    fontSize: 14,
    color: '#8b949e',
  },
  // flexDirection row = los hijos van uno al lado del otro.
  // justifyContent space-between = uno a cada extremo.
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  material: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3fb950',
  },
  peso: {
    fontSize: 16,
    color: '#ffffff',
  },
  estado: {
    fontSize: 12,
    color: '#d29922',
    marginTop: 4,
  },
});
