import React, { useState } from 'react';
import { StyleSheet, ImageBackground, Button, View, FlatList, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Searchbar } from 'react-native-paper';

import essenImage from '../../img/essen.png';

const DATA = [
  { id: '1', title: 'Baked salmon with fennel & tomatoes' },
  { id: '2', title: 'Cajun spiced fish tacos' },
  { id: '3', title: 'Escovitch Fish' },
  { id: '4', title: 'Fish fofos' },
  { id: '5', title: 'Fish pie' },
  { id: '6', title: 'Pasta with tomato sauce' }
  // Weitere Einträge...
];

export default function TabOneScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const onChangeSearch = query => {
    setSearchQuery(query);
    if (query) {
      setFilteredData(
          DATA.filter(item =>
              item.title.toLowerCase().includes(query.toLowerCase())
          )
      );
    } else {
      setFilteredData([]);
    }
  };

  const renderItem = ({ item }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
  );

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ImageBackground
              source={essenImage}
              style={styles.background}
          >
            <View style={styles.container}>
              <Text style={styles.headerTitle}>Recipes</Text>
              <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

              {/* Zusätzlicher Text */}
              <Text style={styles.contentText}>Dies ist ein zusätzlicher Textinhalt.</Text>

              {/* Button hinzufügen */}
              <Button
                  title="Klicken Sie mich"
                  onPress={() => alert('Button wurde geklickt!')}
              />

              {/* Searchbar hinzufügen */}
              <Searchbar
                  placeholder="Search"
                  onChangeText={onChangeSearch}
                  value={searchQuery}
                  style={styles.searchbar}
              />

              {/* FlatList hinzufügen */}
              <FlatList
                  data={filteredData}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
              />
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
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
    paddingHorizontal: 20,
  },
  headerTitle: {
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
  searchbar: {
    marginVertical: 20,
    width: '100%',
  },
  item: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    width: '100%',
  },
  title: {
    fontSize: 18,
  },
});
