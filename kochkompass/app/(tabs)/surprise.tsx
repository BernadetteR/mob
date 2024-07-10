import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Button, Text, View, ActivityIndicator, Image, ScrollView, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { WebView } from 'react-native-webview';
import Header from "@/components/Header";
import { globalStyles } from "@/styles/global";
import CustomButton from "@/components/CustomButton";
import RandomRecipe from "@/components/RandomRecipe";

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

  return (
      <View style={globalStyles.globalContainer}>
        <Header headlineText="Surprise Me" />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={globalStyles.globalScrollContainer}>
            <Text style={globalStyles.globalHeadline}>Don't know what to cook?{'\n'}Get a random recipe!</Text>
            <CustomButton title="Get new recipe!" onPress={fetchRandomRecipe} isSelected={false} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {recipe && (
                <RandomRecipe recipe={recipe} />
            )}
          </ScrollView>
        </View>
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
});