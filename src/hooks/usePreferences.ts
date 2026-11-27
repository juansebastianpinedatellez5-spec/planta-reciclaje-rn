// HOOK: preferencias del usuario guardadas con MMKV.
// Toda la logica de MMKV vive aqui. Las pantallas solo usan este hook.
// Los hooks de MMKV son reactivos: si una preferencia cambia, la pantalla se redibuja sola.
// Guardan al instante, sin async/await y sin boton de "Guardar".

import { useMMKVBoolean, useMMKVString } from 'react-native-mmkv';
import { storage } from '../storage/mmkv';

// Nombres con que se guarda cada preferencia (no usar textos sueltos por ahi).
const PREF_KEYS = {
  ORDEN: 'pref_orden',
  COMPACTO: 'pref_compacto',
  OCULTAR_FINALIZADOS: 'pref_ocultarFinalizados',
} as const;

// Formas de ordenar la lista de camiones.
export type OrdenLista = 'placa' | 'peso' | 'estado';
const ORDENES_VALIDOS: OrdenLista[] = ['placa', 'peso', 'estado'];

export function usePreferences() {
  // useMMKVString / useMMKVBoolean: como useState, pero guardado en el telefono.
  const [ordenGuardado, setOrdenGuardado] = useMMKVString(PREF_KEYS.ORDEN, storage);
  const [compacto, setCompacto] = useMMKVBoolean(PREF_KEYS.COMPACTO, storage);
  const [ocultarFinalizados, setOcultarFinalizados] = useMMKVBoolean(
    PREF_KEYS.OCULTAR_FINALIZADOS,
    storage,
  );

  // MMKV guarda un texto cualquiera. Si no es uno valido, se usa 'placa'.
  const orden: OrdenLista =
    ORDENES_VALIDOS.find((o) => o === ordenGuardado) ?? 'placa';

  return {
    orden,
    setOrden: (valor: OrdenLista) => setOrdenGuardado(valor),

    // Si nunca se guardo nada, el valor es undefined. "?? false" da un valor por defecto.
    compacto: compacto ?? false,
    setCompacto: (valor: boolean) => setCompacto(valor),

    ocultarFinalizados: ocultarFinalizados ?? false,
    setOcultarFinalizados: (valor: boolean) => setOcultarFinalizados(valor),
  };
}