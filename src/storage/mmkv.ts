// STORAGE: la instancia de MMKV para toda la app.
// MMKV es un almacenamiento muy rapido y SINCRONO (sin async/await).
// Se crea UNA sola vez aqui y se importa desde los hooks.
// OJO: necesita app compilada (dev build). No funciona en Expo Go.

import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'app-storage' });