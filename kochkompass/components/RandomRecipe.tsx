import React from 'react';
import {StyleSheet, View, ImageBackground, Text, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {globalStyles} from "@/styles/global";
import CustomButton from "@/components/CustomButton";
import {WebView} from "react-native-webview";

type RecipeProps = {
    recipe: {
        strMeal: string;
        strMealThumb: string;
        strInstructions: string;
        strYoutube: string;
        [key: string]: string;
    } | null;
    onNewRecipe: () => void;
    loading: boolean;
};

export default function RandomRecipe({ recipe, onNewRecipe, loading }: RecipeProps) {
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

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!recipe) {
        return (
            <View style={styles.container}>
                <Text>No recipe available.</Text>
                <CustomButton title="Load New Recipe" onPress={onNewRecipe} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={globalStyles.globalScrollContainer}>
            <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
            <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
            <View style={styles.ingredientsContainer}>
                {renderIngredients()}
            </View>
            <Text style={styles.recipeInstructions}>{recipe.strInstructions}</Text>
            <View style={styles.videoContainer}>
                <WebView style={styles.video} source={{ uri: recipe.strYoutube.replace('watch?v=', 'embed/') }} />
            </View>
            <CustomButton title="Load New Recipe" onPress={onNewRecipe} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
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
    ingredientsContainer: {
        marginTop: 20,
        alignItems: 'flex-start',
    },
    ingredient: {
        fontSize: 16,
        textAlign: 'left',
        paddingHorizontal: 10,
    },
    recipeInstructions: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    video: {
        flex: 1,
    },
});