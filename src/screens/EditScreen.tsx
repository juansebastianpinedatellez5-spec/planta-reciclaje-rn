// PANTALLA: EditScreen
// Formulario para editar un camion que ya existe.
// Usa los MISMOS FormField, SelectField y schema que CreateScreen.
// Pide el camion a la API y rellena el formulario con reset() cuando llega.

import React, { useEffect } from 'react';
import {
  View,
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
import { useRecepcion } from '../hooks/useRecepciones';
import { useActualizarRecepcion } from '../hooks/useActualizarRecepcion';
import { OPCIONES_MATERIAL, OPCIONES_ESTADO } from '../data/materiales';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

type EditScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeEdit'>;

export function EditScreen({ navigation, route }: EditScreenProps): React.JSX.Element {
  const { id, name } = route.params;

  // Pide el camion actual a la API.
  const { data: recepcion, isLoading, isError, refetch } = useRecepcion(id);

  // isDirty = el usuario cambio algo respecto a los valores originales.
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RecepcionFormData>({
    resolver: zodResolver(recepcionSchema),
    // Valores vacios. Los de verdad se cargan con reset() cuando llega el camion.
    defaultValues: {
      placa: '',
      conductor: '',
      material: 'plastico',
      estado: 'en_bascula',
    },
  });

  const { mutateAsync: actualizarRecepcion, isError: errorAlGuardar, error } =
    useActualizarRecepcion();

  // Cuando el camion llega de la API, rellena el formulario con sus datos.
  // reset() cambia los valores del formulario y los toma como los "originales".
  useEffect(() => {
    if (recepcion) {
      reset({
        placa: recepcion.placa,
        conductor: recepcion.conductor,
        material: recepcion.material,
        pesoKg: recepcion.pesoKg,
        estado: recepcion.estado,
      });
    }
  }, [recepcion, reset]);

  // Se ejecuta SOLO si Zod dice que todo esta bien.
  async function onSubmit(data: RecepcionFormData): Promise<void> {
    try {
      await actualizarRecepcion({ id, ...data, placa: data.placa.toUpperCase() });
      navigation.goBack();
    } catch {
      // Si falla, el mensaje sale abajo con errorAlGuardar.
    }
  }

  // Solo se puede guardar si cambio algo y no esta enviando.
  const puedeGuardar = isDirty && !isSubmitting;

  // 1. Cargando los datos del camion.
  if (isLoading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  // 2. Error al cargar: boton para reintentar.
  if (isError || recepcion === undefined) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.errorTitulo}>No se pudo cargar {name}</Text>
        <Pressable style={styles.reintentar} onPress={() => refetch()}>
          <Text style={styles.botonTexto}>Reintentar</Text>
        </Pressable>
      </View>
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

        {errorAlGuardar && (
          <Text style={styles.apiError}>No se pudo guardar: {error.message}</Text>
        )}

        <Pressable
          style={[styles.boton, !puedeGuardar && styles.botonApagado]}
          onPress={() => handleSubmit(onSubmit)()}
          disabled={!puedeGuardar}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Text style={styles.botonTexto}>Guardar cambios</Text>
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
  centrado: {
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