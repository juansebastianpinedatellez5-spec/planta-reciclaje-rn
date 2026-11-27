// PANTALLA: SettingsScreen
// Dos secciones:
//  1. Preferencias (MMKV): cambian al instante, sin boton "Guardar".
//  2. Seguridad (SecureStore): codigo de acceso de la bascula, guardado cifrado.
// La pantalla no habla con MMKV ni SecureStore directo: usa los hooks.

import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { usePreferences, OrdenLista } from '../hooks/usePreferences';
import { useCodigoAcceso } from '../hooks/useCodigoAcceso';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

// Opciones para ordenar la lista.
const OPCIONES_ORDEN: { value: OrdenLista; label: string }[] = [
  { value: 'placa', label: 'Placa' },
  { value: 'peso', label: 'Peso' },
  { value: 'estado', label: 'Estado' },
];

export function SettingsScreen(): React.JSX.Element {
  // Preferencias de MMKV. Cada cambio se guarda solo.
  const {
    orden,
    setOrden,
    compacto,
    setCompacto,
    ocultarFinalizados,
    setOcultarFinalizados,
  } = usePreferences();

  // Codigo de acceso (SecureStore).
  const { hayCodigo, enmascarado, guardar, leer, borrar } = useCodigoAcceso();

  // Lo que el usuario escribe en el campo del codigo.
  const [codigo, setCodigo] = useState<string>('');

  // El codigo debe tener de 4 a 8 numeros.
  const codigoValido = /^\d{4,8}$/.test(codigo);

  async function handleGuardar(): Promise<void> {
    await guardar(codigo);
    setCodigo(''); // se borra el campo: el codigo ya no queda en pantalla
    Alert.alert('Guardado', 'El codigo se guardo cifrado en el telefono.');
  }

  async function handleBorrar(): Promise<void> {
    await borrar();
    Alert.alert('Eliminado', 'El codigo fue borrado del telefono.');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ---------- SECCION 1: preferencias (MMKV) ---------- */}
      <Text style={styles.sectionTitle}>Preferencias de la lista</Text>
      <Text style={styles.sectionHint}>
        Se guardan solas en el telefono con MMKV. No hay boton de guardar.
      </Text>

      {/* Orden de la lista */}
      <View style={[styles.row, styles.rowColumn]}>
        <Text style={styles.rowLabel}>Ordenar por</Text>
        <View style={styles.segmented}>
          {OPCIONES_ORDEN.map((opcion) => (
            <Pressable
              key={opcion.value}
              style={[styles.segment, orden === opcion.value && styles.segmentActive]}
              onPress={() => setOrden(opcion.value)}
            >
              <Text
                style={[
                  styles.segmentText,
                  orden === opcion.value && styles.segmentTextActive,
                ]}
              >
                {opcion.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Modo compacto */}
      <View style={styles.row}>
        <View style={styles.rowInfo}>
          <Text style={styles.rowLabel}>Modo compacto</Text>
          <Text style={styles.rowDesc}>Sin imagen ni conductor en cada tarjeta</Text>
        </View>
        <Switch
          value={compacto}
          onValueChange={setCompacto}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
          thumbColor={COLORS.background}
        />
      </View>

      {/* Ocultar finalizados */}
      <View style={styles.row}>
        <View style={styles.rowInfo}>
          <Text style={styles.rowLabel}>Ocultar finalizados</Text>
          <Text style={styles.rowDesc}>No muestra los camiones ya terminados</Text>
        </View>
        <Switch
          value={ocultarFinalizados}
          onValueChange={setOcultarFinalizados}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
          thumbColor={COLORS.background}
        />
      </View>

      {/* ---------- SECCION 2: seguridad (SecureStore) ---------- */}
      <Text style={[styles.sectionTitle, styles.sectionSpaced]}>Seguridad</Text>
      <Text style={styles.sectionHint}>
        El codigo de acceso de la bascula se guarda cifrado con SecureStore.
        Nunca se muestra completo.
      </Text>

      <Text style={styles.estado}>
        {hayCodigo ? '🔒 Hay un codigo guardado' : 'No hay codigo guardado'}
      </Text>

      <TextInput
        style={styles.input}
        value={codigo}
        onChangeText={setCodigo}
        placeholder="Codigo de 4 a 8 numeros"
        placeholderTextColor={COLORS.textSecondary}
        keyboardType="numeric"
        secureTextEntry
        maxLength={8}
      />

      {/* Valor leido, solo con puntos */}
      {enmascarado !== null && (
        <View style={styles.masked}>
          <Text style={styles.rowLabel}>Codigo guardado:</Text>
          <Text style={styles.maskedValue}>{enmascarado}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable
          style={[styles.btn, !codigoValido && styles.btnOff]}
          onPress={handleGuardar}
          disabled={!codigoValido}
        >
          <Text style={styles.btnText}>Guardar</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnOutline, !hayCodigo && styles.btnOff]}
          onPress={leer}
          disabled={!hayCodigo}
        >
          <Text style={[styles.btnText, styles.btnTextOutline]}>Ver</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnDanger, !hayCodigo && styles.btnOff]}
          onPress={handleBorrar}
          disabled={!hayCodigo}
        >
          <Text style={[styles.btnText, styles.btnTextDanger]}>Borrar</Text>
        </Pressable>
      </View>
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
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  sectionSpaced: {
    marginTop: SPACING.lg,
  },
  sectionHint: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
  },
  rowColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  rowInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  rowLabel: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  rowDesc: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  segmented: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  segment: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
  },
  segmentActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  segmentText: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.background,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  estado: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.base,
  },
  masked: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    gap: SPACING.xs,
  },
  maskedValue: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
  },
  btnOutline: {
    backgroundColor: COLORS.surface,
  },
  btnDanger: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.warning,
  },
  btnOff: {
    opacity: 0.4,
  },
  btnText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  btnTextOutline: {
    color: COLORS.accent,
  },
  btnTextDanger: {
    color: COLORS.warning,
  },
});