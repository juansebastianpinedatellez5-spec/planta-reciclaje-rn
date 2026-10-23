# Semana 01 — Explicacion paso a paso (para sustentar)

Tema: Core Components y Flexbox. Dominio: planta de reciclaje.
Cada paso = un commit. Ver con `git log --oneline`.

## Paso 1 — chore(setup): esqueleto Expo
- `package.json`: dependencias exactas (expo, react, react-native, typescript). `main` apunta a `index.js`.
- `index.js`: llama `registerRootComponent(App)`. Le dice a React Native cual es el componente raiz.
- `app.json`: nombre "Planta de Reciclaje" (el bootcamp pide el nombre del dominio aqui).
- `tsconfig.json`: `strict: true` = TypeScript estricto, prohibido `any` sin querer.
- `App.tsx`: app minima para probar que arranca.

## Paso 2 — feat(types): tipos
- `Material`: plastico, carton, vidrio, metal (los 4 que clasifica la planta).
- `Estado`: en_bascula, descargando, finalizado.
- `Recepcion`: un camion que llega (placa, conductor, material, pesoKg, estado, imageUri).
- Pregunta tipica: por que tipos? -> TypeScript avisa errores antes de correr la app.

## Paso 3 — feat(data): datos de prueba
- `RECEPCIONES`: 4 camiones fijos (el minimo pedido es 3).
- Todavia no hay base de datos ni API. Eso viene en semanas posteriores.

## Paso 4 — feat(components): RecepcionCard
- `View` = contenedor (como div). `Text` = todo texto. `Image` = imagen. `Pressable` = zona tocable.
- `Pressable` con funcion en `style`: `pressed` es true mientras el dedo toca, y cambia el color (feedback visual).
- Flexbox: `flexDirection: 'row'` pone material y peso en la misma fila; `justifyContent: 'space-between'` los separa a los extremos; `alignItems: 'center'` los centra en vertical.
- `Record<Material, string>`: objeto que traduce cada material a su texto bonito.
- Estilos con `StyleSheet.create`, ninguno inline.

## Paso 5 — feat(screens): HomeScreen
- Header con titulo y subtitulo del dominio.
- `ScrollView` para bajar con el dedo.
- `RECEPCIONES.map(...)` dibuja una tarjeta por camion. `key` ayuda a React a identificar cada una.
- `handlePress` muestra un `Alert` (en semana 3 sera navegacion).
- `SafeAreaView` de RN esta deprecado, por eso se usa `paddingTop` manual con `Platform` y `StatusBar`.

## Paso 6 — App.tsx final
- Solo renderiza `<HomeScreen />`.

## Preguntas que pueden hacer
- Diferencia web vs RN: no hay div/span/img; todo texto va en `<Text>`; el eje por defecto es `column`.
- Por que no `position: absolute`? Restriccion de la semana: Flexbox basta.
- Por que `flex: 1` en la pantalla? Para ocupar todo el alto disponible.

## Como correr
```bash
pnpm install
pnpm start      # escanear QR con Expo Go
pnpm typecheck  # revisar tipos
```
