// PANTALLA: HomeScreen
// Pantalla principal. Tiene un header y una lista de tarjetas.

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Recepcion } from '../types';
import { RecepcionCard } from '../components/RecepcionCard';
import { RECEPCIONES } from '../data/mockData';

const TITULO = 'Planta de Reciclaje';
const SUBTITULO = 'Recepciones del dia';

export function HomeScreen(): React.JSX.Element {
  // Se ejecuta cuando tocan una tarjeta.
  // Por ahora solo muestra un aviso. En la semana 3 sera navegacion.
  function handlePress(recepcion: Recepcion): void {
    Alert.alert(recepcion.placa, `Conductor: ${recepcion.conductor}`);
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1117" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{TITULO}</Text>
        <Text style={styles.headerSubtitle}>{SUBTITULO}</Text>
      </View>

      {/* ScrollView: permite bajar con el dedo si hay muchas tarjetas */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {/* map = por cada recepcion, dibujo una tarjeta */}
        {RECEPCIONES.map((recepcion) => (
          <RecepcionCard
            key={recepcion.id}
            recepcion={recepcion}
            onPress={handlePress}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// Espacio de arriba para que el header no quede debajo de la barra del telefono.
// SafeAreaView de React Native esta deprecado, por eso se hace a mano.
const TOP_SPACE = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 50;

const styles = StyleSheet.create({
  screen: {
    flex: 1, // flex 1 = ocupa toda la pantalla
    backgroundColor: '#0d1117',
    paddingTop: TOP_SPACE,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8b949e',
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
});
