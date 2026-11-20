// SCHEMA: reglas de validacion del formulario de camiones (Zod).
// Zod revisa que lo escrito sea correcto ANTES de enviar a la API.
// Se usa en Crear y en Editar: una sola fuente de reglas.

import { z } from 'zod';

export const recepcionSchema = z.object({
  // Placa: 3 letras, guion y 3 numeros. Ejemplo: SXK-421
  placa: z
    .string()
    .trim()
    .min(1, 'La placa es obligatoria')
    .regex(/^[A-Za-z]{3}-\d{3}$/, 'Formato de placa: ABC-123'),

  conductor: z
    .string()
    .trim()
    .min(3, 'Minimo 3 caracteres')
    .max(60, 'Maximo 60 caracteres'),

  // Solo acepta uno de estos 4 materiales.
  material: z.enum(['plastico', 'carton', 'vidrio', 'metal'], {
    error: 'Elige un material',
  }),

  // El peso lo escribe el usuario como texto. z.coerce lo convierte a numero.
  // <number> le dice a TypeScript que el campo es numero (para useForm).
  pesoKg: z.coerce
    .number<number>({ error: 'El peso debe ser un numero' })
    .positive('El peso debe ser mayor que 0')
    .max(50000, 'Maximo 50000 kg'),

  estado: z.enum(['en_bascula', 'descargando', 'finalizado'], {
    error: 'Elige un estado',
  }),
});

// El tipo del formulario sale del schema. No se escribe a mano (sin duplicar).
export type RecepcionFormData = z.infer<typeof recepcionSchema>;