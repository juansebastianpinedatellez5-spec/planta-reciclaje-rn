// PANTALLA: FavoritesScreen
// Segunda pestana. Muestra los camiones prioritarios.
// El store da los ids marcados. TanStack Query da los datos de la API.
// Al tocar uno, abre su detalle en la pestana Home.

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../navigation/types';
import { Recepcion } from '../types';
import { RecepcionCard } from '../components/RecepcionCard';
import { useRecepciones } from '../hooks/useRecepciones';
import { usePrioritariasStore } from '../stores/prioritariasStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

type FavoritesScreenProps = BottomTabScreenProps<RootTabParamList, 'Favorites'>;

// Espacio entre tarjetas.
function Separador(): React.JSX.Element {
  return <View style={styles.separador} />;
}

export function FavoritesScreen({
  navigation,
}: FavoritesScreenProps): React.JSX.Element {
  // Selectores: cada uno pide SOLO lo que necesita del store.
  // Esta pantalla se redibuja solo si cambia la lista o la accion.
  const ids = usePrioritariasStore((state) => state.ids);
  // Los camiones salen de la API (misma consulta que la lista: se reutiliza el cache).
  const { data, isLoading, isError, refetch } = useRecepciones();
  const limpiarPrioritarias = usePrioritariasStore(
    (state) => state.limpiarPrioritarias,
  );

  // Del store solo salen los ids. Con ellos busco los camiones completos.
  const recepciones = useMemo(
    () => (data ?? []).filter((r) => ids.includes(r.id)),
    [data, ids],
  );

  // Al tocar una tarjeta: voy a la pestana Home, pantalla HomeDetail, con sus params.
  const handlePress = useCallback(
    (recepcion: Recepcion): void => {
      navigation.navigate('Home', {
        screen: 'HomeDetail',
        params: { id: recepcion.id, name: recepcion.placa },
      });
    },
    [navigation],
  );

  const renderItem: ListRenderItem<Recepcion> = useCallback(
    ({ item }) => <RecepcionCard recepcion={item} onPress={handlePress} />,
    [handlePress],
  );

  // Cargando la primera vez.
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  // Error al pedir los datos.
  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>No se pudieron cargar los camiones</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={recepciones}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={Separador}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      // Arriba de la lista: cuantos hay y el boton para borrar todos.
      ListHeaderComponent={
        recepciones.length > 0 ? (
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {recepciones.length} prioritario
              {recepciones.length !== 1 ? 's' : ''}
            </Text>
            <Pressable onPress={limpiarPrioritarias} style={styles.clearButton}>
              <Text style={styles.clearText}>Limpiar todo</Text>
            </Pressable>
          </View>
        ) : undefined
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No hay camiones prioritarios</Text>
          <Text style={styles.emptySubTitle}>
            Abre un camion en la lista y toca "Marcar como prioritario".
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
  },
  clearButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  clearText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.warning,
  },
  separador: {
    height: SPACING.md,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  retryText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.xxl,
    gap: SPACING.sm,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  emptySubTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});