import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Button, Text, View, ActivityIndicator, Image, ScrollView, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { WebView } from 'react-native-webview';
import Header from "@/components/Header";
import { globalStyles } from "@/styles/global";

type Recipe = {
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strYoutube: string;
  [key: string]: string;
};

export default function TabTwoScreen() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
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

  const renderIngredients = () => {
    if (!recipe) return null;

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${ingredient} - ${measure}`);
      }
    }

    return ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.ingredient}>
          • {ingredient}
        </Text>
    ));
  };

  return (
      <View style={[globalStyles.globalContainer, styles.mainContainer]}>
        <Header headlineText="Surprise Me" />
        <View style={styles.container}>
          <View style={styles.separator} />
          <Button title="Neues Rezept laden" onPress={fetchRandomRecipe} />
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {recipe && (
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.recipeContainer}>
                  <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
                  <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
                  <View style={styles.ingredientContainer}>
                    {renderIngredients()}
                  </View>
                  <Text style={styles.recipeInstructions}>{recipe.strInstructions}</Text>
                  <View style={styles.videoContainer}>
                    <WebView
                        style={styles.video}
                        source={{ uri: recipe.strYoutube.replace("watch?v=", "embed/") }}
                    />
                  </View>
                </View>
              </ScrollView>
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
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
    backgroundColor: '#eee',
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
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9, // Adjust aspect ratio as needed
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
  ingredientContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  ingredient: {
    fontSize: 16,
    textAlign: 'left',
    paddingHorizontal: 10,
  },
});
