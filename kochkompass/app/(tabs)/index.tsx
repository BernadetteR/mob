import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, Button, View, FlatList, Text, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import Header from '../../components/Header';
import RecipeItem from '../../components/RecipeItem';
import RecipeDetailScreen from '../../components/RecipeDetailScreen';
import essenImage from '../../img/essen.png';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  ingredients: string[];
  strInstructions?: string;
  strYoutube?: string;
  [key: string]: any;
}

export default function TabOneScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [data, setData] = useState<Meal[]>([]);
  const [filteredData, setFilteredData] = useState<Meal[]>([]); // Initialize with empty array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Meal | null>(null); // Zustand für ausgewähltes Rezept

  useEffect(() => {
    fetchRecipesFromAtoZ();
  }, []);

  const fetchRecipesFromAtoZ = () => {
    setLoading(true);
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const promises = letters.split('').map(letter =>
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
            .then(response => response.json())
            .then(json => json.meals)
            .catch(error => {
              console.error('Error fetching recipes for letter', letter, error);
              return [];
            })
    );

    Promise.all(promises)
        .then(results => {
          let allMeals: Meal[] = [];
          results.forEach(meals => {
            if (meals) {
              const mappedMeals = meals.map((meal: any) => ({
                idMeal: meal.idMeal,
                strMeal: meal.strMeal,
                strMealThumb: meal.strMealThumb,
                ingredients: extractIngredients(meal),
                strInstructions: meal.strInstructions,
                strYoutube: meal.strYoutube,
              }));
              allMeals = [...allMeals, ...mappedMeals];
            }
          });
          setData(allMeals);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching recipes from A to Z', error);
          setError(error);
          setLoading(false);
        });
  };

  const extractIngredients = (meal: any): string[] => {
    let ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      if (ingredient) {
        ingredients.push(ingredient.toLowerCase());
      } else {
        break; // Stop if no more ingredients are found
      }
    }
    return ingredients;
  };

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const queryLower = query.toLowerCase();
      setFilteredData(
          data.filter((item) =>
              item.ingredients.some((ingredient) =>
                  ingredient.includes(queryLower)
              )
          )
      );
    } else {
      setFilteredData([]);
    }
  };

  const fetchCategoryData = (category: string) => {
    setLoading(true);
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then((response) => response.json())
        .then((json) => {
          const categoryMeals: Meal[] = json.meals.map((meal: any) => ({
            idMeal: meal.idMeal,
            strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb,
            ingredients: extractIngredients(meal),
            strInstructions: meal.strInstructions,
            strYoutube: meal.strYoutube,
          }));

          setFilteredData(categoryMeals);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
  };

  const handlePress = (item: Meal) => {
    setLoading(true);
    const selectedId = item.idMeal;
    const firstLetter = item.strMeal.charAt(0).toLowerCase(); // Anfangsbuchstabe des Rezeptnamens

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`)
        .then((response) => response.json())
        .then((secondJson) => {
          const secondMeals: Meal[] = secondJson.meals || [];

          const matchedRecipe = secondMeals.find((meal) => meal.idMeal === selectedId);

          if (matchedRecipe) {
            setSelectedRecipe(matchedRecipe);
          } else {
            setSelectedRecipe(item);
          }

          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
  };

  const handleBackPress = () => {
    setSelectedRecipe(null); // Zurück zur Listenansicht
  };

  const renderItem = ({ item }: { item: Meal }) => (
      <RecipeItem item={item} onPress={handlePress} />
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

  if (selectedRecipe) {
    return (
        <RecipeDetailScreen recipe={selectedRecipe} onBackPress={handleBackPress} />
    );
  }

  return (

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View>
            <Header headlineText="Enter your ingredients" />
            <View style={styles.container}>

              <Text style={styles.headerTitle}>Recipes</Text>
              <View style={styles.separator} />
              <Text style={styles.contentText}>Dies ist ein zusätzlicher Textinhalt.</Text>
              <Button title="Klicken Sie mich" onPress={() => alert('Button wurde geklickt!')} />
              <Searchbar placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} style={styles.searchbar} />
              <View style={styles.buttonContainer}>
                {['Beef', 'Chicken', 'Dessert', 'Pasta', 'Pork', 'Seafood', 'Vegetarian', 'Vegan'].map((cat) => (
                    <Button key={cat} title={cat} onPress={() => fetchCategoryData(cat)} />
                ))}
              </View>
              {filteredData.length > 0 ? (
                  <FlatList data={filteredData} keyExtractor={(item) => item.idMeal} renderItem={renderItem} contentContainerStyle={styles.list} />
              ) : (
                  <Text style={styles.noRecipesText}>No recipes found.</Text>
              )}
            </View>
        </View>
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
    backgroundColor: '#eee', // Replace lightColor and darkColor
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
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  noRecipesText: {
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 20,
  },
});
