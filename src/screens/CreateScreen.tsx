// PANTALLA: CreateScreen
// Formulario para registrar un camion nuevo.
// Envia un POST a la API con useMutation (hook useCrearRecepcion).
// Si sale bien, la lista se actualiza sola y vuelve a la pantalla anterior.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';
import { Material } from '../types';
import { useCrearRecepcion } from '../hooks/useCrearRecepcion';
import { NOMBRE_MATERIAL } from '../data/materiales';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

type CreateScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeCreate'>;

// Los 4 materiales entre los que se puede elegir.
const MATERIALES: Material[] = ['plastico', 'carton', 'vidrio', 'metal'];

export function CreateScreen({ navigation }: CreateScreenProps): React.JSX.Element {
  // Un useState por cada campo del formulario.
  const [placa, setPlaca] = useState<string>('');
  const [conductor, setConductor] = useState<string>('');
  const [material, setMaterial] = useState<Material>('plastico');
  // El peso se guarda como texto (asi lo da el teclado) y despues se pasa a numero.
  const [peso, setPeso] = useState<string>('');

  // useMutation: crearRecepcion envia el POST.
  // isPending = esta enviando | isError = fallo | error = el mensaje del fallo
  const { mutate: crearRecepcion, isPending, isError, error } =
    useCrearRecepcion();

  // Number('') es 0 y Number('abc') es NaN. En los dos casos no es mayor que 0.
  const pesoKg = Number(peso);
  const formularioValido =
    placa.trim() !== '' && conductor.trim() !== '' && pesoKg > 0;
  // El boton solo funciona si el formulario esta bien y no esta enviando.
  const puedeEnviar = formularioValido && !isPending;

  function handleSubmit(): void {
    if (!puedeEnviar) {
      return;
    }
    crearRecepcion(
      {
        placa: placa.trim().toUpperCase(),
        conductor: conductor.trim(),
        material,
        pesoKg,
        // Un camion nuevo siempre empieza en la bascula.
        estado: 'en_bascula',
      },
      {
        // Se ejecuta cuando la API respondio y la lista ya se actualizo.
        onSuccess: () => navigation.goBack(),
      },
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Campo: placa */}
        <View style={styles.field}>
          <Text style={styles.label}>Placa</Text>
          <TextInput
            style={styles.input}
            value={placa}
            onChangeText={setPlaca}
            placeholder="Ej: SXK-421"
            placeholderTextColor={COLORS.textSecondary}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>

        {/* Campo: conductor */}
        <View style={styles.field}>
          <Text style={styles.label}>Conductor</Text>
          <TextInput
            style={styles.input}
            value={conductor}
            onChangeText={setConductor}
            placeholder="Nombre del conductor"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* Campo: material (4 botones, uno queda marcado) */}
        <View style={styles.field}>
          <Text style={styles.label}>Material</Text>
          <View style={styles.chips}>
            {MATERIALES.map((m) => (
              <Pressable
                key={m}
                style={[styles.chip, material === m && styles.chipActivo]}
                onPress={() => setMaterial(m)}
              >
                <Text
                  style={[
                    styles.chipTexto,
                    material === m && styles.chipTextoActivo,
                  ]}
                >
                  {NOMBRE_MATERIAL[m]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Campo: peso */}
        <View style={styles.field}>
          <Text style={styles.label}>Peso neto (kg)</Text>
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            placeholder="Ej: 3200"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
          />
        </View>

        {/* Si la API fallo, se muestra el mensaje */}
        {isError && (
          <Text style={styles.error}>No se pudo crear: {error.message}</Text>
        )}

        {/* Boton enviar: se apaga si falta algo o si esta enviando */}
        <Pressable
          style={[styles.boton, !puedeEnviar && styles.botonApagado]}
          onPress={handleSubmit}
          disabled={!puedeEnviar}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Text style={styles.botonTexto}>Registrar camion</Text>
          )}
        </Pressable>

        <Pressable style={styles.cancelar} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelarTexto}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.base,
    gap: SPACING.base,
  },
  field: {
    gap: SPACING.xs,
  },
  label: {
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
  },
  chipActivo: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  chipTexto: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
  },
  chipTextoActivo: {
    color: COLORS.background,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  error: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.warning,
  },
  boton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.base,
    alignItems: 'center',
  },
  botonApagado: {
    opacity: 0.4,
  },
  botonTexto: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  cancelar: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  cancelarTexto: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
  },
});