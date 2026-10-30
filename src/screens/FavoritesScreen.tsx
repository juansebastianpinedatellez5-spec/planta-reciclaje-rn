// PANTALLA: FavoritesScreen
// Segunda pestana. Muestra los camiones prioritarios que estan en el store.
// Al tocar uno, abre su detalle en la pestana Home.

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../navigation/types';
import { Recepcion } from '../types';
import { RecepcionCard } from '../components/RecepcionCard';
import { usePrioritariasStore } from '../stores/prioritariasStore';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';

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
  const recepciones = usePrioritariasStore((state) => state.recepciones);
  const limpiarPrioritarias = usePrioritariasStore(
    (state) => state.limpiarPrioritarias,
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