// COMPONENTE: FormField
// Un campo de texto reutilizable para formularios.
// Junta tres cosas: Controller + TextInput + mensaje de error.
// Se usa en Crear y en Editar (no se copia el codigo en cada pantalla).

import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

// T = la forma del formulario (por ejemplo RecepcionFormData).
// Con T, "name" solo acepta nombres de campos que existen.
interface FormFieldProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  errorMessage?: string;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  errorMessage,
  ...textInputProps
}: FormFieldProps<T>): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Controller conecta este TextInput con el formulario (useForm). */}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, !!errorMessage && styles.inputError]}
            // El TextInput solo acepta texto. Si el valor es numero, se pasa a texto.
            value={value == null ? '' : String(value)}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={COLORS.textSecondary}
            {...textInputProps}
          />
        )}
      />

      {/* Mensaje de error. Siempre ocupa espacio para que el formulario no salte. */}
      <Text style={styles.error} numberOfLines={1}>
        {errorMessage ?? ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  inputError: {
    borderColor: COLORS.warning,
  },
  error: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.warning,
    minHeight: 16,
  },
});