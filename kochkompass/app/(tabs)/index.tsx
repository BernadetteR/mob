import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { Searchbar } from 'react-native-paper';
import Header from '../../components/Header';
import RecipeItem from '../../components/RecipeItem';
import RecipeDetailScreen from '../../components/RecipeDetailScreen';
import { globalStyles } from "@/styles/global";
import CustomButton from "@/components/CustomButton";
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  ingredients: string[];
  strInstructions?: string;
  strYoutube?: string;
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [data, setData] = useState<Meal[]>([]);
  const [filteredData, setFilteredData] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Meal | null>(null);
  const [likedRecipes, setLikedRecipes] = useState<Meal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    //clearAsyncStorage();
    fetchRecipesFromAtoZ();
    loadLikedRecipes();
  }, []);

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem('likedRecipes');
      setLikedRecipes([]);
    } catch (error) {
      console.error('Error clearing AsyncStorage', error);
    }
  };

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
        break;
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
    setSelectedCategory(category);
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
    const firstLetter = item.strMeal.charAt(0).toLowerCase();

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
    setSelectedRecipe(null);
  };

  const toggleLike = async (recipe: Meal | null) => {
    if (recipe === null) return;

    let updatedLikedRecipes;
    if (likedRecipes.some(likedRecipe => likedRecipe.idMeal === recipe.idMeal)) {
      updatedLikedRecipes = likedRecipes.filter(likedRecipe => likedRecipe.idMeal !== recipe.idMeal);
    } else {
      updatedLikedRecipes = [...likedRecipes, recipe];
    }
    setLikedRecipes(updatedLikedRecipes);
    try {
      await AsyncStorage.setItem('likedRecipes', JSON.stringify(updatedLikedRecipes));
    } catch (error) {
      console.error('Error saving liked recipes to AsyncStorage', error);
    }
  };

  const loadLikedRecipes = async () => {
    try {
      const storedLikedRecipes = await AsyncStorage.getItem('likedRecipes');
      if (storedLikedRecipes) {
        setLikedRecipes(JSON.parse(storedLikedRecipes));
      }
    } catch (error) {
      console.error('Error loading liked recipes from AsyncStorage', error);
    }
  };

  const renderItem = ({ item }: { item: Meal }) => (
      <RecipeItem
          item={item}
          onPress={handlePress}
          isLiked={likedRecipes.some(likedRecipe => likedRecipe.idMeal === item.idMeal)}
          onToggleLike={() => toggleLike(item)}
      />
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
        <RecipeDetailScreen
            recipe={selectedRecipe}
            onBackPress={handleBackPress}
            isLiked={likedRecipes.some(likedRecipe => likedRecipe.idMeal === selectedRecipe?.idMeal)}
            onToggleLike={() => toggleLike(selectedRecipe)}
        />
    );
  }

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={globalStyles.globalContainer}>
          <Header headlineText="Enter your ingredients" />
          <View style={styles.searchContainer}>
            <Searchbar placeholder="search by ingredient" onChangeText={onChangeSearch} value={searchQuery} style={styles.searchbar} />
          </View>
          <View style={styles.container}>
          <FlatList
              data={filteredData}
              keyExtractor={(item) => item.idMeal}
              renderItem={renderItem}
              ListHeaderComponent={() => (
                  <View>
                    <Text style={globalStyles.globalHeadline}>Search by category</Text>
                    <View style={styles.buttonContainer}>
                      {['Beef', 'Chicken', 'Dessert', 'Pasta', 'Pork', 'Seafood', 'Vegetarian', 'Vegan'].map((cat) => (
                          <CustomButton
                              key={cat}
                              title={cat}
                              onPress={() => fetchCategoryData(cat)}
                              isSelected={selectedCategory === cat}
                          />
                      ))}
                    </View>
                  </View>
              )}
              contentContainerStyle={styles.list}
          />
          </View>
        </View>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  list: {
    paddingVertical: 10,
    flexGrow: 1,
    //width: 300
  },
  searchContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    height: 50,
    width: 320,
    borderColor: 'black',
    marginTop: -30,
    zIndex: 1,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    alignSelf: 'center',
  },
  searchbar: {
    backgroundColor: 'transparent',
    width: '100%',
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
  noRecipesText: {
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 20,
  },
});
