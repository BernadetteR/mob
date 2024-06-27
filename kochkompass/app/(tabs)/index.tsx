import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, Button, View, FlatList, Text, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Image, ScrollView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import Header from '../../components/Header';
import RecipeItem from '../../components/RecipeItem';

import essenImage from '../../img/essen.png';

export default function TabOneScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
        .then((response) => response.json())
        .then((json) => {
          setData(json.meals);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
  }, []);

  const onChangeSearch = query => {
    setSearchQuery(query);
    if (query) {
      setFilteredData(
          data.filter(item =>
              item.strMeal.toLowerCase().includes(query.toLowerCase())
          )
      );
    } else {
      setFilteredData([]);
    }
  };

  const renderItem = ({ item }) => (
      <View style={styles.item}>
        <Image source={{ uri: item.strMealThumb }} style={styles.thumbnail} />
        <Text style={styles.title}>{item.strMeal}</Text>
      </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
    );
  }

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ImageBackground
              source={essenImage}
              style={styles.background}
          >

            <View style={styles.container}>
              <Header headlineText="Enter your ingredients" />

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
                  keyExtractor={item => item.idMeal}
                  renderItem={renderItem}
                  contentContainerStyle={styles.list}
              />
            </View>
          </ImageBackground>
        </ScrollView>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  list: {
    padding: 10,
  },
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
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    flex: 1,
    flexWrap: 'wrap',
    alignSelf: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  emptyText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
});
