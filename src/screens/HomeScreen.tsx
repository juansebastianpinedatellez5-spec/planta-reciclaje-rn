// PANTALLA: HomeScreen
// Buscador + lista de tarjetas con FlatList.
// Al tocar una tarjeta, navega al detalle y le manda el id y la placa.

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  ListRenderItem,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';
import { Recepcion } from '../types';
import { RecepcionCard } from '../components/RecepcionCard';
import { RECEPCIONES } from '../data/mockData';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

// Props de esta pantalla: el Stack le da "navigation".
type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeList'>;

// Espacio entre tarjetas. Esta afuera del componente para que no se cree cada vez.
function Separador(): React.JSX.Element {
  return <View style={styles.separador} />;
}

export function HomeScreen({ navigation }: HomeScreenProps): React.JSX.Element {
  // query = lo que el usuario escribe en el buscador.
  const [query, setQuery] = useState<string>('');

  // Lista filtrada. useMemo = solo se vuelve a calcular cuando cambia "query".
  const recepcionesFiltradas = useMemo(() => {
    const texto = query.trim().toLowerCase(); // minusculas = no importa si escribe mayusculas
    if (texto === '') {
      return RECEPCIONES; // sin texto = mostrar todo
    }
    return RECEPCIONES.filter(
      (r) =>
        r.placa.toLowerCase().includes(texto) ||
        r.conductor.toLowerCase().includes(texto) ||
        r.material.includes(texto),
    );
  }, [query]);

  // Al tocar una tarjeta: voy al detalle y mando el id y la placa como params.
  const handlePress = useCallback(
    (recepcion: Recepcion): void => {
      navigation.navigate('HomeDetail', {
        id: recepcion.id,
        name: recepcion.placa,
      });
    },
    [navigation],
  );

  // renderItem: le dice a FlatList como dibujar cada fila.
  // useCallback = la funcion no se vuelve a crear en cada render.
  const renderItem: ListRenderItem<Recepcion> = useCallback(
    ({ item }) => <RecepcionCard recepcion={item} onPress={handlePress} />,
    [handlePress],
  );

  // Mensaje cuando la busqueda no encuentra nada.
  // useCallback con [query] = se vuelve a crear solo si cambia el texto.
  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sin resultados para "{query}"</Text>
        <Text style={styles.emptySubText}>
          Prueba con otra placa, otro conductor o un material: plastico, carton, vidrio o metal.
        </Text>
      </View>
    ),
    [query],
  );

  // Borra el texto y esconde el teclado.
  function limpiarBusqueda(): void {
    setQuery('');
    Keyboard.dismiss();
  }

  return (
    // KeyboardAvoidingView: cuando sale el teclado, sube el contenido para que no lo tape.
    // iOS usa "padding", Android usa "height".
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Buscador: cada letra que escribe actualiza "query" */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por placa, conductor o material"
          placeholderTextColor={COLORS.textSecondary}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {/* El boton Limpiar solo sale si hay texto */}
        {query !== '' && (
          <Pressable style={styles.clearButton} onPress={limpiarBusqueda}>
            <Text style={styles.clearText}>Limpiar</Text>
          </Pressable>
        )}
      </View>

      {/* FlatList solo dibuja las filas que se ven en pantalla. ScrollView dibuja todas. */}
      <FlatList
        data={recepcionesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Separador}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.base,
  },
  clearButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  clearText: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  listContent: {
    padding: SPACING.base,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.xxl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  separador: {
    height: SPACING.md,
  },
});