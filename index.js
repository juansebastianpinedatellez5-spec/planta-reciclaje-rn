// index.js: punto de entrada.
// registerRootComponent le dice a React Native cual es el componente raiz.
// Sin esto la app queda en blanco.
import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);
