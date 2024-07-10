import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from "@/styles/global";
import Header from "@/components/Header";
import RecipeItem from '@/components/RecipeItem';
import { useNavigation } from '@react-navigation/native';
import { Meal } from '@/app/(tabs)';

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
                        contentContainerStyle={styles.flatList} // Hier contentContainerStyle verwenden
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
        marginTop: 40,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    flatList: {
        width: 350,
        paddingHorizontal: 16,
    },
});
