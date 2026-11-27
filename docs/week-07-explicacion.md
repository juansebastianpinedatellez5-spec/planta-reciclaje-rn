# Semana 07 — Explicacion paso a paso (para sustentar)

Tema: Persistencia local con MMKV, AsyncStorage y SecureStore. Dominio: planta de reciclaje.
Cada paso = un commit. Ver con `git log --oneline`.

## Que se hizo
La app ahora guarda datos en el telefono, cada uno en el almacenamiento que le corresponde:

| Que se guarda | Donde | Por que ahi |
| --- | --- | --- |
| Preferencias de la lista (orden, modo compacto, ocultar finalizados) | **MMKV** | Son datos chicos que se leen muy seguido y cambian al instante. MMKV es rapido y sincrono. |
| Copia de la lista de camiones (para verla sin internet) | **AsyncStorage** | Es un dato grande (una lista). No es secreto. Se lee una sola vez, al cargar. |
| Codigo de acceso de la bascula | **SecureStore** | Es un dato sensible. Se guarda cifrado. |

```
Pantallas
  |-- HomeScreen / FavoritesScreen --> usePreferences (MMKV)
  |-- SettingsScreen --> usePreferences (MMKV) + useCodigoAcceso (SecureStore)
useRecepciones (TanStack Query) --> API  o  copia en AsyncStorage
```

Regla: las pantallas nunca llaman a MMKV, AsyncStorage ni SecureStore directo. Siempre usan un hook.

## Paso 1 — chore(deps)
- `npx expo install react-native-mmkv react-native-nitro-modules @react-native-async-storage/async-storage expo-secure-store`.
- `react-native-nitro-modules` es la base nativa que necesita MMKV.
- Expo agrego solo el plugin de SecureStore en `app.json`.

## Paso 2 — feat(types)
- `RecepcionesConOrigen = { recepciones, origen: 'red' | 'cache' }`: la lista dice de donde salieron los datos.

## Paso 3 — feat(offline): copia sin internet (AsyncStorage)
- `useRecepciones` intenta pedir la lista a la API.
  - Si funciona: guarda una copia con `AsyncStorage.setItem(clave, JSON.stringify(lista))`.
  - Si falla (sin internet): busca la copia con `AsyncStorage.getItem` y la convierte con `JSON.parse`. Devuelve `origen: 'cache'`.
  - Si falla y no hay copia: ahora si es un error.
- AsyncStorage solo guarda texto. Por eso se usa `JSON.stringify` al guardar y `JSON.parse` al leer.
- `HomeScreen` muestra un aviso naranja "Mostrando datos sin red" cuando `origen === 'cache'`.

## Paso 4 — Compilar la app (dev build)
- MMKV no funciona en Expo Go, asi que se compilo una app propia con EAS Build (en la nube de Expo).
- Se instalo `expo-dev-client` y se creo `eas.json` con el perfil `development`.
- Comando: `npx eas-cli build --profile development --platform android`. Genera un APK que se instala en el celular.
- Problema que aparecio: la nube rechazo `expo-dev-client@58.0.22` y `expo-dev-launcher@58.1.0` por la politica de pnpm `minimumReleaseAge` (no acepta paquetes publicados hace menos de 1 dia). Solucion: fijar `expo-dev-client` en `58.0.21` (publicada una semana antes).

## Paso 5 — feat(storage): MMKV
- `src/storage/mmkv.ts`: `createMMKV({ id: 'app-storage' })`. Una sola instancia para toda la app.
- `src/hooks/usePreferences.ts`: `useMMKVString` y `useMMKVBoolean` (como `useState`, pero guardados en el telefono).
- Son reactivos: si una preferencia cambia, la pantalla se redibuja sola.
- Guardan al instante, sin `async/await` y sin boton de "Guardar".
- Si nunca se guardo nada el valor es `undefined`, asi que se usa un valor por defecto (`?? false`, o `'placa'` para el orden).
- Las claves estan en un objeto `PREF_KEYS`, no escritas sueltas.

## Paso 6 — feat(hooks): SecureStore
- `src/hooks/useCodigoAcceso.ts`: guarda, lee y borra el codigo con `setItemAsync`, `getItemAsync` y `deleteItemAsync`.
- El valor secreto NO esta escrito en el codigo: lo escribe el usuario en un campo.
- El codigo nunca se muestra completo: `leer` solo devuelve puntos (`'•'.repeat(largo)`).
- Despues de guardar, el campo se vacia.

## Paso 7 — feat(screens): SettingsScreen
- Seccion Preferencias: botones para ordenar (placa, peso, estado) y dos `Switch`. Cada toque se guarda solo.
- Seccion Seguridad: campo de 4 a 8 numeros (`/^\d{4,8}$/`), con botones Guardar, Ver y Borrar. El campo usa `secureTextEntry`.
- La pantalla no habla con MMKV ni SecureStore directo: usa los hooks.

## Paso 8 — feat(navigation): pestana Ajustes
- `Settings: undefined` en `RootTabParamList`, pestana con icono `settings` y su propio header.

## Paso 9 — feat(components): modo compacto
- `RecepcionCard` recibe `compacto?: boolean` (por defecto `false`). Si es `true`, no muestra la imagen ni el conductor.

## Paso 10 — feat(screens): lista con preferencias
- `HomeScreen` lee `usePreferences()` y aplica tres cosas dentro de `useMemo`: ocultar finalizados (`filter`), ordenar (`ordenarLista`) y buscar.
- `ordenarLista` hace una copia (`[...lista]`) para no cambiar la original: `sort` modifica el arreglo.
- `useMemo` depende de `[data, query, orden, ocultarFinalizados]`.
- `FavoritesScreen` tambien pasa `compacto` a las tarjetas.

## Preguntas que pueden hacer (de la rubrica)

**1. Cuando usar cada storage (app bancaria: tema, ultimas transacciones, token JWT)**
- **(a) Tema claro/oscuro -> MMKV.** Es un dato chico que se lee en cada pantalla. MMKV es sincrono y muy rapido.
- **(b) Ultimas transacciones offline -> AsyncStorage.** Es una lista grande y no es secreta. Se lee una vez, asi que la velocidad no es critica.
- **(c) Token JWT -> SecureStore.** Es un dato sensible. SecureStore lo guarda cifrado (Keystore en Android, Keychain en iPhone). MMKV y AsyncStorage guardan en texto plano.

**2. Por que MMKV no funciona en Expo Go**
- MMKV esta escrito en C++ y se conecta a JavaScript con **JSI**, una interfaz C++ directa que reemplaza al bridge antiguo. El JavaScript llama al C++ de forma sincrona, sin mensajes ni JSON de por medio.
- La version 4 usa **Nitro Modules** para generar ese puente.
- Expo Go es una app ya compilada con una lista fija de modulos nativos. No trae el codigo C++ de MMKV ni de Nitro, y no se puede agregar sin recompilar.
- Por eso hace falta un **build nativo propio** (dev build): `expo run:android` / `expo run:ios` (compila en la maquina) o `expo prebuild` (genera las carpetas nativas) o EAS Build (compila en la nube, que fue lo que se uso aqui).
- AsyncStorage y SecureStore si funcionan en Expo Go porque ya vienen incluidos.

**3. Por que no basta `useState` para guardar preferencias**
- `useState` guarda en la **memoria RAM**, que es volatil. Al cerrar la app se borra y la preferencia vuelve al valor inicial.
- AsyncStorage escribe en el **sistema de archivos** del dispositivo (disco). Esos datos sobreviven al cierre de la app y a que se reinicie el telefono.

## Otras preguntas posibles
- **Por que MMKV es sincrono y AsyncStorage no?** MMKV usa memoria mapeada y JSI: se lee en el mismo hilo, sin esperar. AsyncStorage pasa por el bridge y devuelve una Promise (`await`).
- **Por que `JSON.stringify` y `JSON.parse` con AsyncStorage?** Solo guarda texto. Un objeto o una lista hay que convertirlos a texto para guardarlos y volver a convertirlos al leerlos.
- **Para que sirve `undefined` en MMKV?** Si la clave nunca se guardo, el valor es `undefined`. Se le da un valor por defecto con `??`.
- **Por que el codigo no se muestra completo?** Un dato sensible no se debe ver en pantalla. Solo se confirma que existe, con puntos.
- **Por que `eas.json` y que es un perfil `development`?** Es la configuracion del build. El perfil