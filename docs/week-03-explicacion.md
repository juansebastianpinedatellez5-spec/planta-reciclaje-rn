# Semana 03 — Explicacion paso a paso (para sustentar)

Tema: React Navigation 7. Dominio: planta de reciclaje.
Cada paso = un commit. Ver con `git log --oneline`.

## Como queda la app
```
NavigationContainer
  Tab (pestanas de abajo)
    Home (Stack)
      HomeList   -> lista de camiones
      HomeDetail -> detalle de un camion (recibe id y name)
    Favorites    -> camiones prioritarios
```

## Paso 1 — chore(deps)
- Se instalaron: `@react-navigation/native`, `native-stack`, `bottom-tabs`, `react-native-screens`, `react-native-safe-area-context` y `@expo/vector-icons`.
- Se usa `npx expo install` para que las versiones sirvan con Expo SDK 58.

## Paso 2 — refactor(components)
- `src/data/materiales.ts`: nombres e imagenes de cada material y estado.
- Antes estaban dentro de `RecepcionCard`. Ahora los usan la tarjeta y el detalle. Un solo lugar.

## Paso 3 — feat(navigation): tipos
- `HomeStackParamList`: `HomeList` no recibe nada; `HomeDetail` recibe `{ id, name }`.
- `RootTabParamList`: `Home` y `Favorites`. `Home` usa `NavigatorScreenParams<HomeStackParamList>` porque guarda un Stack adentro.
- Para que sirve: TypeScript avisa si navego a una pantalla que no existe o me falta un param.

## Paso 4 — feat(screens): DetailScreen
- `useRoute<RouteProp<HomeStackParamList, 'HomeDetail'>>()` lee los params.
- Con el `id` busca el camion en `RECEPCIONES` (`find`). Si no lo encuentra, muestra un aviso.
- `Campo`: componente chico que dibuja etiqueta + valor.

## Paso 5 — feat(screens): FavoritesScreen
- `PRIORITARIAS` = camiones que siguen en proceso (ids 1, 6, 10, 11). Por ahora fijos (en la semana 4 pasan al store).
- Al tocar una tarjeta: `navigation.navigate('Home', { screen: 'HomeDetail', params: {...} })`. Salta a la otra pestana y abre el detalle.
- Tiene `ListEmptyComponent` por si la lista queda vacia.

## Paso 6 — feat(navigation): RootNavigator
- `createNativeStackNavigator` crea el Stack. `createBottomTabNavigator` crea las pestanas.
- `HEADER_OPTIONS`: colores del header (fondo, boton atras, titulo).
- Titulo del detalle sale de los params: `Recepcion ${route.params.name}`.
- Iconos: `Ionicons` (`car` y `star`). `focused` = pestana activa, cambia entre icono lleno y de contorno.
- `tabBarActiveTintColor`: `#61DAFB` (color que pide el bootcamp, guardado en `COLORS.tabActive`).
- `headerShown: false` en el Tab porque Home ya tiene el header del Stack. En Favorites si se enciende.

## Paso 7 — feat(app): NavigationContainer
- `NavigationContainer` envuelve toda la navegacion y guarda el historial.
- `SafeAreaProvider` calcula los bordes seguros del celular.
- `TEMA_NAVEGACION` = `DarkTheme` con los colores de la planta. Sin esto, el fondo entre pantallas sale blanco.

## Paso 8 — feat(screens): HomeScreen navega
- Recibe `navigation` por props (`NativeStackScreenProps`).
- `handlePress`: `navigation.navigate('HomeDetail', { id, name: placa })`.
- Se quito el header propio y el `StatusBar` viejo: ahora los pone el Stack.

## Preguntas que pueden hacer (de la rubrica)
- **navigate vs push:** `navigate` reutiliza la pantalla si ya esta en el stack; `push` siempre crea una nueva. `push` sirve para abrir la misma pantalla con otros params.
- **Como se pasan params:** envio `navigation.navigate('HomeDetail', { id: '1', name: 'SXK-421' })`; recibo `const { id, name } = useRoute<DetailRouteProp>().params`.
- **Por que anidar un Stack dentro de un Tab:** cada pestana tiene su propio historial. Puedo ir de lista a detalle y la barra de pestanas sigue visible.
- **Por que tipar la navegacion:** para que TypeScript detecte errores antes de correr la app.

## Como correr
```bash
pnpm install
pnpm start
pnpm typecheck
```