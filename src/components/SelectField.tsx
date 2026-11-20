// COMPONENTE: SelectField
// Un campo para elegir UNA opcion entre varias (botones).
// Sirve para material y estado. Tambien usa Controller.
// Se usa en Crear y en Editar.

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

// Una opcion: "value" es lo que se guarda, "label" es lo que se ve.
export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  errorMessage?: string;
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  errorMessage,
}: SelectFieldProps<T>): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View style={styles.chips}>
            {options.map((opcion) => {
              // La opcion elegida es la que coincide con el valor del formulario.
              const activa = value === opcion.value;
              return (
                <Pressable
                  key={opcion.value}
                  style={[styles.chip, activa && styles.chipActivo]}
                  onPress={() => onChange(opcion.value)}
                >
                  <Text style={[styles.chipTexto, activa && styles.chipTextoActivo]}>
                    {opcion.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      />

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
    minHeight: 16,
  },
});