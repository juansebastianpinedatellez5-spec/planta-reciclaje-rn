// HOOK: codigo de acceso de la bascula guardado con Expo SecureStore.
// SecureStore guarda el valor CIFRADO (Keystore en Android, Keychain en iPhone).
// Nunca se guarda en AsyncStorage ni en MMKV: no estan cifrados.
// Este hook junta toda la logica. La pantalla no llama a SecureStore directo.

import { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

// Nombre con que se guarda el dato. El valor secreto NO esta escrito en el codigo.
const CLAVE = 'codigo_acceso_bascula';

export function useCodigoAcceso() {
  // hayCodigo = true si ya hay un codigo guardado.
  const [hayCodigo, setHayCodigo] = useState<boolean>(false);
  // enmascarado = puntos en vez del codigo. El valor real nunca se muestra.
  const [enmascarado, setEnmascarado] = useState<string | null>(null);

  // Al abrir la pantalla: revisa si ya hay un codigo guardado.
  useEffect(() => {
    SecureStore.getItemAsync(CLAVE)
      .then((valor) => setHayCodigo(valor !== null))
      .catch(() => setHayCodigo(false));
  }, []);

  // Guarda el codigo cifrado.
  const guardar = useCallback(async (codigo: string): Promise<void> => {
    await SecureStore.setItemAsync(CLAVE, codigo);
    setHayCodigo(true);
    setEnmascarado(null);
  }, []);

  // Lee el codigo, pero solo deja ver puntos (uno por cada digito).
  const leer = useCallback(async (): Promise<void> => {
    const valor = await SecureStore.getItemAsync(CLAVE);
    setEnmascarado(valor === null ? null : '•'.repeat(valor.length));
  }, []);

  // Borra el codigo.
  const borrar = useCallback(async (): Promise<void> => {
    await SecureStore.deleteItemAsync(CLAVE);
    setHayCodigo(false);
    setEnmascarado(null);
  }, []);

  return { hayCodigo, enmascarado, guardar, leer, borrar };
}