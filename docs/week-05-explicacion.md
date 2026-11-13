# Semana 05 — Explicacion paso a paso (para sustentar)

Tema: Consumo de APIs con Axios y TanStack Query. Dominio: planta de reciclaje.
Cada paso = un commit. Ver con `git log --oneline`.

## Que se hizo
Los camiones ya no son datos de ejemplo. Vienen de una API real (mockapi.io) y la app puede crear camiones nuevos.

```
Pantallas  ->  hooks (useRecepciones, useRecepcion, useCrearRecepcion)
                  ->  TanStack Query (cache, cargando, error)
                        ->  Axios (apiClient)  ->  API en mockapi.io
```

Regla de la semana:
- **Datos del servidor** (los camiones) -> TanStack Query.
- **Lo que marca el usuario** (cuales son prioritarios) -> Zustand, y solo los ids.

## API usada
- Servicio: mockapi.io. Recurso: `recepciones`.
- Campos: `placa`, `conductor`, `material`, `pesoKg` (numero), `estado`. El `id` lo pone el servidor.
- Endpoints que usa la app:
  - `GET /recepciones` -> lista de camiones.
  - `GET /recepciones/:id` -> un camion.
  - `POST /recepciones` -> crear un camion.
- Se cargaron los 12 camiones de ejemplo con un script de `curl`.

## Paso 1 — chore(deps)
- `npx expo install @tanstack/react-query axios`.
- Axios hace las llamadas HTTP. TanStack Query guarda los datos y maneja cargando, error y cache.

## Paso 2 — feat(types)
- `CrearRecepcionPayload = Omit<Recepcion, 'id'>`: lo que se manda al crear un camion. Es `Recepcion` sin `id`, porque el id lo pone el servidor.

## Paso 3 — feat(services)
- `src/services/api.ts`: UNA sola instancia de Axios para toda la app.
- `baseURL`: la direccion de la API se escribe una sola vez.
- `timeout: 10_000`: si el servidor no responde en 10 segundos, falla.
- Interceptor de respuesta: se ejecuta con cada respuesta. Si hay error, lo muestra en consola (solo en desarrollo) y lo deja pasar con `Promise.reject`.

## Paso 4 — feat(hooks): lectura
- `src/hooks/useRecepciones.ts`.
- `RECEPCIONES_QUERY_KEY = ['recepciones']`: el nombre del "cajon" del cache. Esta afuera para usar el mismo nombre al invalidar.
- `useRecepciones()`: `useQuery` con `queryKey` y `queryFn` (llama a Axios y devuelve `data`).
- `useRecepcion(id)`: pide un solo camion. Su queryKey es `['recepciones', id]` (un cajon por camion). `enabled: id !== ''` evita pedir sin id.
- Las pantallas usan estos hooks. Nunca llaman a Axios directo.

## Paso 5 — feat(hooks): escritura
- `src/hooks/useCrearRecepcion.ts`.
- `useMutation<Recepcion, Error, CrearRecepcionPayload>`: lo que devuelve, tipo de error, lo que recibe.
- `mutationFn`: hace el `POST /recepciones`.
- `onSuccess`: llama `queryClient.invalidateQueries({ queryKey: RECEPCIONES_QUERY_KEY })`. Marca la lista como vieja y TanStack Query la vuelve a pedir sola.
- Lleva `return` para que la mutacion espere a que la lista termine de actualizarse.

## Paso 6 — feat(app)
- `QueryClientProvider` en `App.tsx`, por fuera de todo: sin el, ningun `useQuery` funciona.
- El `QueryClient` se crea afuera del componente: asi hay uno solo.
- `staleTime` de 2 minutos: por ese tiempo los datos se consideran frescos y no se vuelven a pedir.
- `retry: 1`: si falla, reintenta una vez antes de mostrar el error.
- `refetchOnWindowFocus: false`: en el celular no existe "volver a la ventana".

## Paso 7 — refactor(stores)
- Antes el store guardaba camiones completos. Eso es copiar datos del servidor: si cambian, el store queda viejo.
- Ahora guarda solo `ids: string[]`. Las acciones reciben un id.
- Tarjeta, detalle, badge y pantalla Prioritarias se adaptaron: `state.ids.includes(id)`, `state.ids.length`.
- Prioritarias junta las dos fuentes: ids del store + camiones de TanStack Query (`filter`).

## Paso 8 — feat(screens): lista
- `HomeScreen` usa `useRecepciones()`. Variables que da TanStack Query: `data`, `isLoading`, `isError`, `error`, `isRefetching`, `refetch`.
- 4 estados:
  1. Cargando: `ActivityIndicator`.
  2. Error: mensaje y boton "Reintentar" (`refetch`).
  3. Vacio: `ListEmptyComponent` (dos casos: la API no tiene camiones, o la busqueda no encontro nada).
  4. Lista: `FlatList` con los camiones.
- Pull to refresh: `onRefresh={refetch}` y `refreshing={isRefetching}`.
- Cuenta de camiones arriba de la lista (`ListHeaderComponent`).
- `data ?? []`: mientras no llegan datos se usa una lista vacia.

## Paso 9 — feat(screens): detalle
- `DetailScreen` usa `useRecepcion(id)`. Maneja cargando y error con boton "Reintentar".
- Los hooks del store van antes de cualquier `return`.

## Paso 10 — feat(screens): prioritarias
- Usa `useRecepciones()` (la misma consulta de la lista: se reutiliza el cache, no hace otra peticion).
- Tiene sus propios estados de cargando y error.

## Paso 11 — feat(navigation): ruta
- `HomeCreate: undefined` en `HomeStackParamList`: pantalla nueva que no recibe datos.

## Paso 12 — feat(screens): formulario
- `CreateScreen`: campos placa, conductor, material (4 botones) y peso.
- Un `useState` por campo. El peso se guarda como texto y se convierte con `Number(peso)`.
- Validacion: placa y conductor no vacios y `pesoKg > 0`. `Number('')` es 0 y `Number('abc')` es NaN, y los dos fallan.
- `useCrearRecepcion()` da `mutate`, `isPending`, `isError` y `error`.
- El boton se apaga si el formulario no es valido o si `isPending` es true. Mientras envia muestra un `ActivityIndicator`.
- `onSuccess: () => navigation.goBack()`: vuelve cuando la API respondio y la lista ya se actualizo.
- Un camion nuevo siempre empieza con `estado: 'en_bascula'`.

## Paso 13 — feat(navigation): boton +
- En el Stack: pantalla `HomeCreate` con titulo "Nueva recepcion".
- `headerRight` en `HomeList`: boton "+" (`Ionicons add-circle-outline`) que hace `navigation.navigate('HomeCreate')`.

## Paso 14 — refactor(data)
- Se borro `mockData.ts`: ya nadie lo usa.

## Preguntas que pueden hacer (de la rubrica)

**1. Axios vs fetch**
- Con `fetch` hay que repetir la URL base y los headers en cada llamada, revisar `response.ok` y llamar `.json()` a mano.
- Una instancia de Axios con `baseURL` define la URL, el timeout y los headers una sola vez. Tambien lanza error solo en respuestas 4xx y 5xx.
- Los interceptors son codigo que corre en cada peticion o respuesta. Sirven, por ejemplo, para adjuntar el token de autenticacion a todas las llamadas, o para manejar errores en un solo lugar.
- Una funcion simple con `fetch` basta para un script o un prototipo con una sola llamada. En una app con varias llamadas conviene la instancia compartida.

**2. Codigo minimo de useQuery**
```tsx
const { data, isLoading, isError } = useQuery({
  queryKey: ['posts'],
  queryFn: () => axios.get('/posts').then((r) => r.data),
});
```
- `queryKey` es un array: es el nombre del cajon del cache.
- `queryFn` devuelve una Promise que resuelve los datos.

**3. Invalidar el cache despues de crear**
```tsx
onSuccess: () => {
  return queryClient.invalidateQueries({ queryKey: ['posts'] });
},
```
- `invalidateQueries` marca esos datos como viejos (stale) y dispara un refetch de las consultas que estan en pantalla. La lista se actualiza sin recargar la app.
- `setQueryData` es distinto: escribe los datos directo en el cache, sin preguntar al servidor. Se usa en actualizaciones optimistas.

## Otras preguntas posibles
- **Que es "estado del servidor" y por que no va en Zustand?** Son datos que viven en el servidor y pueden cambiar sin que la app lo sepa. TanStack Query los trae, los guarda en cache y los mantiene al dia. Zustand es para estado del cliente, como las marcas del usuario.
- **Por que el store guarda solo ids?** Para no tener copias viejas de datos del servidor. Los datos completos salen siempre de TanStack Query.
- **Diferencia entre `isLoading` e `isRefetching`?** `isLoading` es la primera carga, cuando todavia no hay datos. `isRefetching` es cuando ya hay datos y se estan volviendo a pedir.
- **Que es `staleTime`?** El tiempo en que los datos se consideran frescos y no se vuelven a pedir. Aqui son 2 minutos.
- **Por que el `QueryClient` va afuera del componente?** Para que haya uno solo y no se cree de nuevo en cada render.
- **Por que `enabled: id !== ''`?** Para que la consulta no se ejecute sin un id.

## Como correr
```bash
pnpm install
pnpm start
pnpm typecheck
```