// PANTALLA: CreateScreen
// Formulario para registrar un camion nuevo.
// React Hook Form maneja el formulario. Zod valida. useMutation envia a la API.
// Si sale bien, la lista se actualiza sola y vuelve a la pantalla anterior.

import React from 'react';
import {
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';
import { recepcionSchema, RecepcionFormData } from '../schemas/recepcionSchema';
import { FormField } from '../components/FormField';
import { SelectField } from '../components/SelectField';
import { useCrearRecepcion } from '../hooks/useCrearRecepcion';
import { OPCIONES_MATERIAL, OPCIONES_ESTADO } from '../data/materiales';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

type CreateScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeCreate'>;

export function CreateScreen({ navigation }: CreateScreenProps): React.JSX.Element {
  // useForm maneja el formulario:
  // control = conecta los campos | handleSubmit = valida y envia
  // errors = errores de Zod por campo | isSubmitting = esta enviando
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecepcionFormData>({
    // zodResolver: usa el schema de Zod para validar.
    resolver: zodResolver(recepcionSchema),
    // Valores con que empieza el formulario. El peso empieza vacio.
    defaultValues: {
      placa: '',
      conductor: '',
      material: 'plastico',
      estado: 'en_bascula',
    },
  });

  // mutateAsync envia el POST y se puede esperar con await.
  const { mutateAsync: crearRecepcion, isError, error } = useCrearRecepcion();

  // Se ejecuta SOLO si Zod dice que todo esta bien. "data" ya viene validado.
  async function onSubmit(data: RecepcionFormData): Promise<void> {
    try {
      await crearRecepcion({ ...data, placa: data.placa.toUpperCase() });
      navigation.goBack();
    } catch {
      // Si falla, el mensaje sale abajo con isError (lo maneja la mutacion).
    }
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
        <FormField
          control={control}
          name="placa"
          label="Placa"
          placeholder="Ej: SXK-421"
          autoCapitalize="characters"
          autoCorrect={false}
          errorMessage={errors.placa?.message}
        />

        <FormField
          control={control}
          name="conductor"
          label="Conductor"
          placeholder="Nombre del conductor"
          errorMessage={errors.conductor?.message}
        />

        <SelectField
          control={control}
          name="material"
          label="Material"
          options={OPCIONES_MATERIAL}
          errorMessage={errors.material?.message}
        />

        <FormField
          control={control}
          name="pesoKg"
          label="Peso neto (kg)"
          placeholder="Ej: 3200"
          keyboardType="numeric"
          errorMessage={errors.pesoKg?.message}
        />

        <SelectField
          control={control}
          name="estado"
          label="Estado"
          options={OPCIONES_ESTADO}
          errorMessage={errors.estado?.message}
        />

        {/* Si la API fallo, se muestra el mensaje */}
        {isError && (
          <Text style={styles.apiError}>No se pudo crear: {error.message}</Text>
        )}

        {/* handleSubmit(onSubmit)(): primero valida con Zod, despues llama onSubmit */}
        <Pressable
          style={[styles.boton, isSubmitting && styles.botonApagado]}
          onPress={() => handleSubmit(onSubmit)()}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
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
    gap: SPACING.sm,
  },
  apiError: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.warning,
  },
  boton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.base,
    alignItems: 'center',
    marginTop: SPACING.sm,
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