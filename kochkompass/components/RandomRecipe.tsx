import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

type Recipe = {
    strMeal: string;
    strMealThumb: string;
    strInstructions: string;
    strYoutube: string;
    [key: string]: string;
};

type RandomRecipeProps = {
    recipe: Recipe;
};

export default function RandomRecipe({ recipe }: RandomRecipeProps) {
    const renderIngredients = () => {
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
        <View style={styles.recipeContainer}>
            <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
            <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
            <View style={styles.break}></View>
            <Text style={styles.recipeTitle}>List of ingredients</Text>
            <View style={styles.ingredientContainer}>
                {renderIngredients()}
            </View>
            <View style={styles.break}></View>
            <Text style={styles.recipeTitle}>Instruction</Text>
            <Text style={styles.recipeInstructions}>{recipe.strInstructions}</Text>
            <View style={styles.videoContainer}>
                <WebView
                    style={styles.video}
                    source={{ uri: recipe.strYoutube.replace("watch?v=", "embed/") }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        textAlign: 'left',
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
    ingredientContainer: {
        alignItems: 'flex-start',
    },
    ingredient: {
        fontSize: 16,
        textAlign: 'left',
        paddingHorizontal: 10,
    },
    break: {
<<<<<<< HEAD
        height: 20, // Hier kannst du die gewünschte Höhe des Abstands anpassen
=======
        height: 20,
>>>>>>> 41d8f36b3cb8336eb718ed033240dd5859d170fd
    },
});
