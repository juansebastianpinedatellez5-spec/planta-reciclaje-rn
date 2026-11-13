# Semana 04 — Explicacion paso a paso (para sustentar)

Tema: Estado global con Zustand. Dominio: planta de reciclaje.
Cada paso = un commit. Ver con `git log --oneline`.

## Que se hizo
Un store global con los camiones prioritarios. Lo usan 4 partes de la app sin pasarse props:
- Detalle: boton "Marcar como prioritario" / "Quitar de prioritarios".
- Pestana Prioritarias: lista lo que hay en el store.
- Tarjeta: muestra "★ Prioritario" si el camion esta en el store.
- Barra de pestanas: badge con la cantidad.

```
            usePrioritariasStore
   (recepciones, agregar, quitar, limpiar)
      /        |          |         \
 Detalle   Prioritarias  Tarjeta   Badge del tab
```

## Paso 1 — chore(deps)
- `npx expo install zustand`: libreria de estado global.

## Paso 2 — feat(stores)
- `src/stores/prioritariasStore.ts`.
- `create<PrioritariasStore>()`: crea el store con la interface tipada (sin `any`).
- Estado: `recepciones` (lista de camiones prioritarios).
- Acciones:
  - `agregarPrioritaria`: agrega el camion. Si ya esta, no hace nada (sin repetidos).
  - `quitarPrioritaria`: quita un camion por id con `filter`.
  - `limpiarPrioritarias`: deja la lista vacia.
- `set` cambia el estado. Siempre se crea una lista nueva (`[...state.recepciones, nuevo]`), nunca se modifica la vieja. Asi Zustand detecta el cambio.
- El nombre del hook empieza con `use`: `usePrioritariasStore`.

## Paso 3 — feat(screens): FavoritesScreen
- Antes leia una lista fija (`PRIORITARIAS`). Ahora lee del store y esa lista fija se borro de `mockData.ts`.
- Selectores: `usePrioritariasStore((state) => state.recepciones)`. Cada uno pide solo lo que necesita.
- `ListHeaderComponent`: muestra cuantos hay y el boton "Limpiar todo" (`limpiarPrioritarias`).
- `ListEmptyComponent`: mensaje cuando no hay ninguno.

## Paso 4 — feat(screens): DetailScreen
- Boton que lee y escribe el store.
- `esPrioritaria`: selector que devuelve `true` o `false` (`state.recepciones.some(...)`).
- Si es prioritaria, el boton dice "Quitar de prioritarios" y llama `quitarPrioritaria`. Si no, dice "Marcar como prioritario" y llama `agregarPrioritaria`.
- Los hooks van antes de cualquier `return` (regla de React).

## Paso 5 — feat(components): RecepcionCard
- La tarjeta tiene su propio selector: "este camion es prioritario?".
- Solo se redibuja si esa respuesta cambia, no cuando cambia cualquier otra cosa del store.

## Paso 6 — feat(navigation): badge
- `RootNavigator` lee `state.recepciones.length` con un selector.
- `tabBarBadge: cantidad > 0 ? cantidad : undefined`. Con `undefined` el badge no se muestra.
- Se actualiza en tiempo real y sin prop drilling.

## Preguntas que pueden hacer (de la rubrica)

**1. useState vs Zustand, cuando usar cada uno**
- `useState` es local: solo lo ve el componente donde se crea. Ejemplo: lo que escribo en el buscador.
- Zustand es global: cualquier componente lo lee o lo cambia sin pasar props (sin prop drilling). Ejemplo: los camiones prioritarios, que usan 4 partes de la app.

**2. Codigo minimo de un store con contador**
```ts
import { create } from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

**3. Que es un selector y por que mejora el rendimiento**
- Es la funcion que se pasa al hook: `usePrioritariasStore((state) => state.recepciones.length)`.
- Zustand compara el valor que devuelve el selector con el anterior.
- El componente solo se redibuja si ese valor cambio, no cuando cambia cualquier parte del store.
- Ejemplo del proyecto: el badge solo mira la cantidad, la tarjeta solo mira un true o false.

## Otras preguntas posibles
- **Por que no se modifica la lista directo (`push`)?** Zustand detecta cambios por referencia. Si modifico la misma lista, no se entera. Por eso se crea una nueva.
- **Por que no `useStore()` sin selector?** El componente se redibujaria con cualquier cambio del store.
- **Que pasa con los datos al cerrar la app?** Se pierden, porque el store vive en memoria. Para guardarlos se usa el middleware `persist` con AsyncStorage (se ve en el ejercicio 02).

## Como correr
```bash
pnpm install
pnpm start
pnpm typecheck
```