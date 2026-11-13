# Semana 02 — Explicacion paso a paso (para sustentar)

Tema: Listas, Inputs y Estilos. Dominio: planta de reciclaje.
Cada paso = un commit. Ver con `git log --oneline`.

## Paso 1 — feat(theme)
- `src/theme/index.ts`: constantes `COLORS`, `TYPOGRAPHY`, `SPACING`, `RADIUS`.
- Por que? Si cambio un color aqui, cambia en toda la app. Nada de colores "pegados" en cada archivo.
- `as const` = los valores no se pueden modificar.

## Paso 2 — feat(data) y refactor(types)
- 12 recepciones en `mockData.ts` (minimo pedido: 10). Cada una con `id` unico.
- Se quita `imageUri` del tipo `Recepcion`: la imagen ahora se elige segun el material.

## Paso 3 — feat(assets)
- 4 imagenes propias en `assets/images/`: `plastico.png`, `carton.png`, `vidrio.png`, `metal.png` (camion de reciclaje, una por material).
- Son locales: no dependen de internet.

## Paso 4 — feat(components)
- `RecepcionCard` ahora usa `COLORS`, `SPACING`, `TYPOGRAPHY`, `RADIUS` en vez de valores sueltos.
- `IMAGEN_MATERIAL`: objeto que dice que imagen usar para cada material. `require(...)` carga la imagen local.
- `aspectRatio: 3 / 2`: la imagen mantiene su proporcion y no se corta.
- La tarjeta muestra 5 campos: placa, conductor, material, peso, estado (minimo pedido: 3).

## Paso 5 — feat(screens): FlatList
- `ScrollView` dibuja TODAS las filas. `FlatList` dibuja solo las que se ven (virtualizacion). Mejor para listas largas.
- `keyExtractor={(item) => item.id}`: React usa el id para saber cual fila es cual. Nunca el indice.
- `renderItem` con `useCallback`: la funcion no se recrea en cada render.
- `ItemSeparatorComponent`: espacio entre tarjetas.
- `Separador` y `handlePress` estan afuera del componente porque no dependen de nada.

## Paso 6 — feat(screens): busqueda
- `useState` guarda lo que escribe el usuario en `query`.
- `TextInput` con `value` y `onChangeText={setQuery}`: cada letra actualiza `query`.
- `useMemo` filtra la lista y solo recalcula cuando cambia `query`.
- `toLowerCase()` = no importa mayusculas o minusculas.
- Busca por placa, conductor o material.

## Paso 7 — feat(screens): estado vacio
- `ListEmptyComponent` se muestra cuando la lista queda sin elementos.
- `renderEmpty` con `useCallback` y `[query]`: se recrea solo si cambia el texto buscado.

## Paso 8 — feat(screens): teclado
- `KeyboardAvoidingView`: sube el contenido cuando sale el teclado. iOS `padding`, Android `height`.
- Boton "Limpiar": borra el texto y cierra el teclado con `Keyboard.dismiss()`. Solo aparece si hay texto.
- `keyboardShouldPersistTaps="handled"`: tocar una tarjeta funciona aunque el teclado este abierto.
- `keyboardDismissMode="on-drag"`: el teclado se cierra al arrastrar la lista.

## Preguntas que pueden hacer
- FlatList vs ScrollView? Virtualizacion: FlatList solo renderiza lo visible. Usar ScrollView con pocos items fijos; FlatList desde unos 20 items o datos dinamicos.
- Por que keyExtractor? React usa la key para reconocer cada fila al actualizar. Sin key hay warning y bugs.
- Por que useMemo? Para no filtrar de nuevo si `query` no cambio.
- Que resuelve KeyboardAvoidingView? El teclado tapa el input. En iOS `padding`, en Android `height`.

## Como correr
```bash
pnpm install
pnpm start
pnpm typecheck
```