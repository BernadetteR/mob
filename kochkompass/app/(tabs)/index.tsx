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
  strCategory?: string;
  [key: string]: string | string[] | undefined;
};


export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>(''); // current value of the search query entered by the user in the Searchbar
  const [data, setData] = useState<Meal[]>([]); // holds an array of Meal objects fetched from the API
  const [filteredData, setFilteredData] = useState<Meal[]>([]); // array of Meal objects that match the search
  const [loading, setLoading] = useState<boolean>(true);  // indicates whether data is currently being fetched
  const [error, setError] = useState<Error | null>(null); // any error that might occur during data fetching or processing
  const [selectedRecipe, setSelectedRecipe] = useState<Meal | null>(null);  // etails of a single recipe (Meal object) that the user selects to view in detail
  const [likedRecipes, setLikedRecipes] = useState<Meal[]>([]); // holds an array of Meal objects that the user has liked
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);  // the category name selected by the user

  // only once at the beginning
  useEffect(() => {
    //clearAsyncStorage();
    fetchRecipesFromAtoZ();
    loadLikedRecipes();
  }, []);

  // deletes saved recipes
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem('likedRecipes');
      setLikedRecipes([]);
    } catch (error) {
      console.error('Error clearing AsyncStorage', error);
    }
  };

  // get all recipes
  const fetchRecipesFromAtoZ = () => {
    setLoading(true); // Loading state set to true to indicate that data is loading
    const letters = 'abcdefghijklmnopqrstuvwxyz'; // List of all letters from a to z
    const promises = letters.split('').map(letter =>
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
            .then(response => response.json())
            .then(json => json.meals)
            .catch(error => {
              console.error('Error fetching recipes for letter', letter, error);
              return [];
            })
    );

    // Wait for all fetch promises to complete
    Promise.all(promises)
        .then(results => {
          let allMeals: Meal[] = [];
          // Iterate over the results and add the meals to the list of all meals
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
          setData(allMeals);  // Set the state with all meals loaded
          setLoading(false);  // false, when loading complete
        })
        .catch(error => {
          console.error('Error fetching recipes from A to Z', error);
          setError(error);
          setLoading(false);
        });
  };

  //  store all ingredients in an array
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

  // ingredient search
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    // entry
    if (query) {
      const queryLower = query.toLowerCase();
      setFilteredData(
          data.filter((item) =>
              item.ingredients.some((ingredient) =>
                  ingredient.includes(queryLower)
              )
          )
      );
    }
    // no entry
    else {
      setFilteredData([]);
    }
  };

  // get recipe by category
  const fetchCategoryData = (category: string) => {
    setLoading(true);
    setSelectedCategory(category);  // set category state
    // Fetch recipes based on the selected category from the API
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

          setFilteredData(categoryMeals); // Update filtered data with category meals
          setLoading(false); // Set loading state to false after data fetching
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
  };

  const handlePress = (item: Meal) => {
    setLoading(true);
    const selectedId = item.idMeal; // get the meal ID
    const firstLetter = item.strMeal.charAt(0).toLowerCase();

    // Fetch recipes starting with the first letter of the meal name from the API
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`)
        .then((response) => response.json())
        .then((secondJson) => {
          // Extract the list of meals from the JSON response
          const secondMeals: Meal[] = secondJson.meals || [];
          // Find a meal in the list that matches the selected meal ID
          const matchedRecipe = secondMeals.find((meal) => meal.idMeal === selectedId);
          // meal found
          if (matchedRecipe) {
            setSelectedRecipe(matchedRecipe);
          } else {
            setSelectedRecipe(item);
          }
          // fetch is complete --> false
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
  };

  // deselect recipe
  const handleBackPress = () => {
    setSelectedRecipe(null);
  };

  // like recipe
  const toggleLike = async (recipe: Meal | null) => {
    if (recipe === null) return;  // no recipe liked
    // toggle liked status of the recipe in the liked recipes state
    let updatedLikedRecipes;
    if (likedRecipes.some(likedRecipe => likedRecipe.idMeal === recipe.idMeal)) {
      updatedLikedRecipes = likedRecipes.filter(likedRecipe => likedRecipe.idMeal !== recipe.idMeal);
    }
    else {
      updatedLikedRecipes = [...likedRecipes, recipe];
    }
    // update liked recipes state
    setLikedRecipes(updatedLikedRecipes);
    try {
      // save updated liked recipes to AsyncStorage
      await AsyncStorage.setItem('likedRecipes', JSON.stringify(updatedLikedRecipes));
    }
    catch (error) {
      console.error('Error saving liked recipes to AsyncStorage', error);
    }
  };

  // load liked recipes from AsyncStorage
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

  // RecipeItem
  const renderItem = ({ item }: { item: Meal }) => (
      <RecipeItem
          item={item}
          onPress={handlePress}
          isLiked={likedRecipes.some(likedRecipe => likedRecipe.idMeal === item.idMeal)}
          onToggleLike={() => toggleLike(item)}
      />
  );

  // show loading spinner
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // error message in case of error
  if (error) {
    return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
    );
  }

  // show Detailscreen of selected recipe
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
