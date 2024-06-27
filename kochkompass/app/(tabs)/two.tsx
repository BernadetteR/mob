import React, { useState } from 'react';
import { StyleSheet, Button, Text, View, ActivityIndicator, Image, ScrollView } from 'react-native';

export default function TabTwoScreen() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomRecipe = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      setRecipe(data.meals[0]);
    } catch (error) {
      console.error('Fehler beim Abrufen des Rezepts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Zufälliges Rezept</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <Button title="Neues Rezept laden" onPress={fetchRandomRecipe} />

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {recipe && (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.recipeContainer}>
                <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
                <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
                <Text style={styles.recipeInstructions}>{recipe.strInstructions}</Text>
              </View>
            </ScrollView>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  scrollContainer: {
    alignItems: 'center',
  },
  recipeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  recipeImage: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  recipeInstructions: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});