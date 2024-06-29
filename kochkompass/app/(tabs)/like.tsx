import React, { useState } from 'react';
import { StyleSheet, Button, Text, View, ActivityIndicator, Image, ScrollView } from 'react-native';
import Header from "@/components/Header";
import {globalStyles} from "@/styles/global";
import CustomButton from "@/components/CustomButton";

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
        <View style={[globalStyles.globalContainer, styles.mainContainer]}>
            <Header headlineText="My Favorites" />
            <View style={styles.container}>
                <Text style={globalStyles.globalHeadline}>Have a look on your saved recipes</Text>
                <CustomButton title="Neues Rezept laden" onPress={fetchRandomRecipe} />
                {loading && <ActivityIndicator size="large" color="#0000ff" />}
                {recipe && (
                    <ScrollView contentContainerStyle={globalStyles.globalScrollContainer}>
                        <View style={styles.recipeContainer}>
                            <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
                            <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
                            <Text style={styles.recipeInstructions}>{recipe.strInstructions}</Text>
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
