// COMPONENTE: RecepcionCard
// Una tarjeta que muestra un camion que llego a la planta.
// Se usa en la lista y en prioritarias.
// Si el camion es prioritario, muestra una estrella (lee el store).

import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Recepcion } from '../types';
import { usePrioritariasStore } from '../stores/prioritariasStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';
import {
  NOMBRE_MATERIAL,
  NOMBRE_ESTADO,
  IMAGEN_MATERIAL,
} from '../data/materiales';

// Props = lo que el componente recibe desde afuera.
interface RecepcionCardProps {
  recepcion: Recepcion;
  onPress: (recepcion: Recepcion) => void;
}

export function RecepcionCard({
  recepcion,
  onPress,
}: RecepcionCardProps): React.JSX.Element {
  // Selector: pregunta al store solo "este camion es prioritario?" (true o false).
  // Esta tarjeta se redibuja solo si esa respuesta cambia.
  const esPrioritaria = usePrioritariasStore((state) =>
    state.recepciones.some((r) => r.id === recepcion.id),
  );

  return (
    // Pressable: cuando lo tocan, "pressed" es true y la tarjeta cambia de color.
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(recepcion)}
    >
      <Image
        source={IMAGEN_MATERIAL[recepcion.material]}
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

        {/* Fila: estado a la izquierda, estrella a la derecha si es prioritario */}
        <View style={styles.row}>
          <Text style={styles.estado}>{NOMBRE_ESTADO[recepcion.estado]}</Text>
          {esPrioritaria && <Text style={styles.prioritario}>★ Prioritario</Text>}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  // Se aplica solo mientras el dedo esta encima.
  cardPressed: {
    backgroundColor: COLORS.surfaceAlt,
  },
  // aspectRatio 3/2 = misma proporcion de la imagen (600x400), no se corta.
  image: {
    width: '100%',
    aspectRatio: 3 / 2,
  },
  body: {
    padding: SPACING.base,
    gap: SPACING.xs,
  },
  placa: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  conductor: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  // flexDirection row = los hijos van uno al lado del otro.
  // justifyContent space-between = uno a cada extremo.
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  material: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  peso: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
  },
  estado: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.warning,
  },
  prioritario: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.tabActive,
  },
});