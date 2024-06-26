import React from 'react';
import { StyleSheet, ImageBackground, Button } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

// Bild importieren
import essenImage from '../../img/essen.png';

export default function TabOneScreen() {
  return (
      <ImageBackground
          source={essenImage}
          style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Recipes</Text>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

          {/* Zusätzlicher Text */}
          <Text style={styles.contentText}>Dies ist ein zusätzlicher Textinhalt.</Text>

          {/* Button hinzufügen */}
          <Button
              title="Klicken Sie mich"
              onPress={() => alert('Button wurde geklickt!')}
          />
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Hintergrundfarbe mit Transparenz
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
});
