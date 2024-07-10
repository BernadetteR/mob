import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from "@/styles/global";
import Header from "@/components/Header";
import RecipeItem from '@/components/RecipeItem';
import { useNavigation } from '@react-navigation/native';

type Meal = {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    ingredients: string[];
    strInstructions?: string;
    strYoutube?: string;
};

export default function LikedRecipesScreen() {
    const [likedRecipes, setLikedRecipes] = useState<Meal[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        loadLikedRecipes();
    }, []);

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

    const handlePressRecipe = (recipe: Meal) => {
        // Detailansicht
        //navigation.navigate('RecipeDetail', { recipe }); // Navigiere zu RecipeDetailScreen
    };
    const toggleLike = async (recipeId: string) => {
        const updatedLikedRecipes = likedRecipes.filter(recipe => recipe.idMeal !== recipeId);
        setLikedRecipes(updatedLikedRecipes);
        await AsyncStorage.setItem('likedRecipes', JSON.stringify(updatedLikedRecipes));
    };

    const renderItem = ({ item }: { item: Meal }) => (
        <RecipeItem
            item={item}
            onPress={handlePressRecipe}
            isLiked={likedRecipes.some(recipe => recipe.idMeal === item.idMeal)}
            onToggleLike={toggleLike}
        />
    );

    return (
        <View style={globalStyles.globalContainer}>
            <Header headlineText="My Favorites" />
            <View style={styles.container}>
                {likedRecipes.length > 0 ? (
                    <FlatList
                        data={likedRecipes}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.idMeal}
                        style={styles.flatList}
                    />
                ) : (
                    <Text>No liked recipes yet.</Text>
                )}
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    flatList: {


    },
});
