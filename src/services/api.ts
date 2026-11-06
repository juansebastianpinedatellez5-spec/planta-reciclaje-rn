// SERVICIO: cliente de la API.
// Aqui se crea UNA sola instancia de Axios para toda la app.
// Todas las llamadas usan esta instancia, asi no repito la URL base.

import axios, { AxiosError } from 'axios';

// Direccion de la API (la que creaste en mockapi.io).
const API_BASE_URL = 'https://6aedc7f0a677fe0fc14f5618.mockapi.io/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // Si el servidor no responde en 10 segundos, falla.
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor de respuesta: se ejecuta con CADA respuesta de la API.
// Si hay error, lo muestra en la consola (solo en desarrollo) y lo deja pasar.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (__DEV__) {
      console.error('[API Error]', error.response?.status, error.config?.url);
    }
    return Promise.reject(error);
  },
);