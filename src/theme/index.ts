// TEMA: aqui guardo los colores, tamanos y espacios.
// Si cambio un color aqui, cambia en toda la app.

export const COLORS = {
  // fondos
  background: '#0d1117',
  surface: '#161b22',
  surfaceAlt: '#21262d',

  // bordes
  border: '#30363d',
  borderLight: '#21262d',

  // texto
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',

  // color principal (verde reciclaje)
  accent: '#3fb950',

  // aviso
  warning: '#d29922',
  
  // color de la pestana activa (lo pide el bootcamp)
  tabActive: '#61DAFB',
} as const;

// Tamanos y grosor de letra
export const TYPOGRAPHY = {
  size: {
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xxl: 28,
  },
  weight: {
    regular: '400' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

// Espacios entre cosas
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xxl: 32,
} as const;

// Esquinas redondeadas
export const RADIUS = {
  md: 8,
  lg: 12,
} as const;