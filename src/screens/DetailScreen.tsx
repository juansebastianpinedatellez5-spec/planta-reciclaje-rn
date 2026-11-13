// PANTALLA: DetailScreen
// Muestra todos los datos de un camion.
// Recibe "id" y "name" desde la lista (params de navegacion).
// Los datos frescos vienen de la API con useQuery (useRecepcion).
// Tiene un boton para marcar o quitar el camion de prioritarios (store Zustand).

import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../navigation/types';
import { useRecepcion } from '../hooks/useRecepciones';
import { usePrioritariasStore } from '../stores/prioritariasStore';
import {
  NOMBRE_MATERIAL,
  NOMBRE_ESTADO,
  IMAGEN_MATERIAL,
} from '../data/materiales';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

// Tipo de "route" para esta pantalla. Asi TypeScript sabe que params hay.
type DetailRouteProp = RouteProp<HomeStackParamList, 'HomeDetail'>;

// Una fila del detalle: titulo chico arriba, valor abajo.
interface CampoProps {
  etiqueta: string;
  valor: string;
}

function Campo({ etiqueta, valor }: CampoProps): React.JSX.Element {
  return (
    <View style={styles.campo}>
      <Text style={styles.campoEtiqueta}>{etiqueta}</Text>
      <Text style={styles.campoValor}>{valor}</Text>
    </View>
  );
}

export function DetailScreen(): React.JSX.Element {
  // useRoute = leer los params que mandaron al navegar.
  const route = useRoute<DetailRouteProp>();
  const { id, name } = route.params;

  // Selectores del store. Los hooks van ANTES de cualquier return.
  // esPrioritaria = true si este camion ya esta en la lista de prioritarios.
  const esPrioritaria = usePrioritariasStore((state) => state.ids.includes(id));
  const agregarPrioritaria = usePrioritariasStore(
    (state) => state.agregarPrioritaria,
  );
  const quitarPrioritaria = usePrioritariasStore(
    (state) => state.quitarPrioritaria,
  );

  // Pide este camion a la API.
  const { data: recepcion, isLoading, isError, refetch } = useRecepcion(id);

  // 1. Cargando.
  if (isLoading) {
    return (
      <View style={styles.vacio}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  // 2. Error, o el camion no existe: aviso con boton para reintentar.
  if (isError || recepcion === undefined) {
    return (
      <View style={styles.vacio}>
        <Text style={styles.errorTitulo}>No se pudo cargar {name}</Text>
        <Pressable style={styles.reintentar} onPress={() => refetch()}>
          <Text style={styles.reintentarTexto}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  // Si ya es prioritario lo quita. Si no, lo agrega.
  function cambiarPrioritaria(): void {
    if (esPrioritaria) {
      quitarPrioritaria(id);
    } else {
      agregarPrioritaria(id);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={IMAGEN_MATERIAL[recepcion.material]}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.placa}>{name}</Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>ID: {id}</Text>
      </View>

      <Campo etiqueta="Conductor" valor={recepcion.conductor} />
      <Campo etiqueta="Material" valor={NOMBRE_MATERIAL[recepcion.material]} />
      <Campo etiqueta="Peso neto" valor={`${recepcion.pesoKg} kg`} />
      <Campo etiqueta="Estado" valor={NOMBRE_ESTADO[recepcion.estado]} />

      {/* Boton: cambia de texto y de color segun el estado del store */}
      <Pressable
        style={({ pressed }) => [
          styles.boton,
          esPrioritaria ? styles.botonQuitar : styles.botonAgregar,
          pressed && styles.botonPressed,
        ]}
        onPress={cambiarPrioritaria}
      >
        <Text
          style={[
            styles.botonTexto,
            esPrioritaria ? styles.botonTextoQuitar : styles.botonTextoAgregar,
          ]}
        >
          {esPrioritaria ? 'Quitar de prioritarios' : 'Marcar como prioritario'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.base,
    gap: SPACING.md,
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 2,
    borderRadius: RADIUS.lg,
  },
  placa: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  campo: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  campoEtiqueta: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  campoValor: {
    fontSize: TYPOGRAPHY.size.md,
    color: COLORS.textPrimary,
  },
  boton: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.base,
    alignItems: 'center',
    borderWidth: 1,
  },
  botonAgregar: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  botonQuitar: {
    backgroundColor: 'transparent',
    borderColor: COLORS.warning,
  },
  botonPressed: {
    opacity: 0.7,
  },
  botonTexto: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  botonTextoAgregar: {
    color: COLORS.background,
  },
  botonTextoQuitar: {
    color: COLORS.warning,
  },
  vacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.background,
  },
  errorTitulo: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.warning,
    textAlign: 'center',
  },
  reintentar: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  reintentarTexto: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
});