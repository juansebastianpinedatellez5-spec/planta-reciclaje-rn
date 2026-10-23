// PANTALLA: FavoritesScreen
// Segunda pestana. Muestra los camiones prioritarios.
// Al tocar uno, abre su detalle en la pestana Home.

import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../navigation/types';
import { Recepcion } from '../types';
import { RecepcionCard } from '../components/RecepcionCard';
import { PRIORITARIAS } from '../data/mockData';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';

type FavoritesScreenProps = BottomTabScreenProps<RootTabParamList, 'Favorites'>;

// Espacio entre tarjetas.
function Separador(): React.JSX.Element {
  return <View style={styles.separador} />;
}

export function FavoritesScreen({
  navigation,
}: FavoritesScreenProps): React.JSX.Element {
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
      data={PRIORITARIAS}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={Separador}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay camiones prioritarios</Text>
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
  separador: {
    height: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
  },
});