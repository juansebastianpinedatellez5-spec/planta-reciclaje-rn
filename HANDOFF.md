# HANDOFF — Planta de Reciclaje (React Native)

> Leer esto primero si eres otro Claude continuando el trabajo.

## Contexto
Sebastian (estudiante SENA, Colombia, habla espanol) debe construir cada semana una parte de un sistema para una **planta de reciclaje**: pesaje de vehiculos en bascula, clasificacion y seguimiento de material (plastico, carton, vidrio, metal), stock de fardos terminados y metricas de impacto ambiental y rendimiento de maquinaria. Guia: https://github.com/ergrato-dev/bc-reactnative (bootcamp de 18 semanas, una carpeta `bootcamp/week-XX-*` por semana; leer su README, rubrica y `3-proyecto/README.md`).

## Reglas del usuario (obligatorias)
1. React Native + Expo + TypeScript estricto (sin `any`).
2. Codigo estilo "caveman": simple, comentarios cortos en espanol, sin abstracciones raras. Sebastian debe poder explicar cada linea.
3. Trabajo paso a paso, un commit por paso, y un doc `docs/week-XX-explicacion.md` explicando cada paso.
4. `main` queda VACIA (solo commit inicial vacio).
5. Cada semana = rama `week-XX`. Cada rama sale de la anterior (week-02 sale de week-01, etc.).
6. Commits con Conventional Commits (`feat(scope): ...`, `chore:`, `docs:`).
7. Al terminar cada semana: actualizar este HANDOFF.md.
8. Restricciones del bootcamp por semana (ver rubrica): ej. semana 1 sin `position: absolute`, sin estilos inline, sin librerias de UI.

## Estado
| Semana | Rama | Tema bootcamp | Estado |
| ------ | ---- | ------------- | ------ |
| 01 | `week-01` | Core Components y Flexbox | HECHA: app de tarjetas de recepciones de camiones |
| 02 | `week-02` | Listas, inputs y estilos | PENDIENTE |

## Que hay en week-01
- `index.js`, `App.tsx`, `app.json`, `tsconfig.json`, `package.json`
- `src/types/index.ts` — `Material`, `Estado`, `Recepcion`
- `src/data/mockData.ts` — 4 recepciones de ejemplo
- `src/components/RecepcionCard.tsx` — tarjeta (Image, Text, Pressable, Flexbox)
- `src/screens/HomeScreen.tsx` — header + ScrollView
- `docs/week-01-explicacion.md` — explicacion para sustentar

Verificado: `pnpm typecheck` OK y `npx expo export --platform android` OK. No se probo en simulador/Expo Go.

## Notas tecnicas
- Se aplicaron arreglos de la rama `fix/starter-entrypoints-and-config` del repo guia: `index.js` con `registerRootComponent`, `main: index.js`, `app.json` sin assets inexistentes.
- `SafeAreaView` de RN esta deprecado; se usa `paddingTop` manual.
- Gestor de paquetes: pnpm 10. Node 22.

## Siguiente gran cambio: week-02
1. `git checkout week-01 && git checkout -b week-02`
2. Leer `bootcamp/week-02-listas_inputs_y_estilos/` (README, rubrica, 3-proyecto) del repo guia.
3. Cambiar `ScrollView` por `FlatList` en la lista de recepciones.
4. Agregar formulario con `TextInput` para registrar un camion nuevo (placa, conductor, material, peso) con estado local (`useState`).
5. Agregar filtro por material y estados vacios.
6. Un commit por paso, crear `docs/week-02-explicacion.md`, actualizar este archivo.
