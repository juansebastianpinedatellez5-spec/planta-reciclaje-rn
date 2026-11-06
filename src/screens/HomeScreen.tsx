// PANTALLA: HomeScreen
// Buscador + lista de tarjetas con FlatList.
// Los camiones vienen de la API con useQuery.
// Maneja 4 estados: cargando, error, vacio y lista.
// Al tocar una tarjeta, navega al detalle y le manda el id y la placa.

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
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
import { useRecepciones } from '../hooks/useRecepciones';
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

  // Pide los camiones a la API. TanStack Query nos da el estado de la peticion:
  // data = los camiones | isLoading = primera carga | isError = fallo
  // isRefetching = recargando | refetch = volver a pedir
  const { data, isLoading, isError, error, isRefetching, refetch } =
    useRecepciones();

  // Lista filtrada. useMemo = solo se vuelve a calcular cuando cambia "query".
  const recepcionesFiltradas = useMemo(() => {
    const lista = data ?? []; // si todavia no llegan datos, lista vacia
    const texto = query.trim().toLowerCase(); // minusculas = no importa si escribe mayusculas
    if (texto === '') {
      return lista; // sin texto = mostrar todo
    }
    return lista.filter(
      (r) =>
        r.placa.toLowerCase().includes(texto) ||
        r.conductor.toLowerCase().includes(texto) ||
        r.material.includes(texto),
    );
  }, [data, query]);

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

  // Mensaje cuando la lista queda vacia.
  // Dos casos: la API no tiene camiones, o la busqueda no encontro nada.
  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        {query.trim() === '' ? (
          <Text style={styles.emptyText}>Aun no hay recepciones registradas</Text>
        ) : (
          <>
            <Text style={styles.emptyText}>Sin resultados para "{query}"</Text>
            <Text style={styles.emptySubText}>
              Prueba con otra placa, otro conductor o un material: plastico, carton, vidrio o metal.
            </Text>
          </>
        )}
      </View>
    ),
    [query],
  );

  // Borra el texto y esconde el teclado.
  function limpiarBusqueda(): void {
    setQuery('');
    Keyboard.dismiss();
  }

  // Dibuja lo que va debajo del buscador segun el estado de la peticion.
  function renderContenido(): React.JSX.Element {
    // 1. Cargando por primera vez.
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.centeredText}>Cargando recepciones...</Text>
        </View>
      );
    }

    // 2. Fallo la peticion.
    if (isError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>No se pudo cargar la lista</Text>
          <Text style={styles.centeredText}>{error?.message}</Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      );
    }

    // 3. Todo bien: la lista (si esta vacia, sale ListEmptyComponent).
    return (
      <FlatList
        data={recepcionesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Separador}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={
          <Text style={styles.countLabel}>
            {recepcionesFiltradas.length} recepcion
            {recepcionesFiltradas.length !== 1 ? 'es' : ''}
          </Text>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        // Pull to refresh: al jalar hacia abajo vuelve a pedir los datos.
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    );
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

      {/* Debajo del buscador: spinner, error o lista. */}
      {renderContenido()}
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
  countLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  centeredText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.warning,
    textAlign: 'center',
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