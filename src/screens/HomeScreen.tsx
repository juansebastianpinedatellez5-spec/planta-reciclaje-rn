// PANTALLA: HomeScreen
// Header + buscador + lista de tarjetas con FlatList.

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  ListRenderItem,
} from 'react-native';
import { Recepcion } from '../types';
import { RecepcionCard } from '../components/RecepcionCard';
import { RECEPCIONES } from '../data/mockData';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

const TITULO = 'Planta de Reciclaje';
const SUBTITULO = 'Recepciones del dia';

// Espacio entre tarjetas. Esta afuera del componente para que no se cree cada vez.
function Separador(): React.JSX.Element {
  return <View style={styles.separador} />;
}

// Se ejecuta cuando tocan una tarjeta. Esta afuera del componente: no depende de nada.
function handlePress(recepcion: Recepcion): void {
  Alert.alert(recepcion.placa, `Conductor: ${recepcion.conductor}`);
}

export function HomeScreen(): React.JSX.Element {
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

  // renderItem: le dice a FlatList como dibujar cada fila.
  // useCallback = la funcion no se vuelve a crear en cada render.
  const renderItem: ListRenderItem<Recepcion> = useCallback(
    ({ item }) => <RecepcionCard recepcion={item} onPress={handlePress} />,
    [],
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{TITULO}</Text>
        <Text style={styles.headerSubtitle}>{SUBTITULO}</Text>
      </View>

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
      </View>

      {/* FlatList solo dibuja las filas que se ven en pantalla. ScrollView dibuja todas. */}
      <FlatList
        data={recepcionesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Separador}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Espacio de arriba para que el header no quede debajo de la barra del telefono.
const TOP_SPACE = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 50;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: TOP_SPACE,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  searchContainer: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.base,
  },
  listContent: {
    padding: SPACING.base,
  },
  separador: {
    height: SPACING.md,
  },
});