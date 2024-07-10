import React from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Meal } from '@/app/(tabs)';

type Props = {
    recipe: Meal;
    onBackPress: () => void;
    isLiked: boolean;
    onToggleLike: (recipeId: string) => void;
};

export default function RecipeDetailScreen({ recipe, onBackPress, isLiked, onToggleLike }: Props) {
    const renderIngredients = () => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}` as keyof Meal] as string;
            const measure = recipe[`strMeasure${i}` as keyof Meal] as string;
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

    const toggleLike = () => {
        onToggleLike(recipe.idMeal);
    };

    return (
        <ImageBackground source={{ uri: recipe.strMealThumb }} style={styles.background}>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <View style={styles.overlay}>
                    <View style={styles.headlineIcon}>
                        <Text numberOfLines={4} style={styles.title}>
                            {recipe.strMeal}
                        </Text>
                        <Ionicons
                            name={isLiked ? 'heart' : 'heart-outline'}
                            size={30}
                            color={isLiked ? 'red' : 'black'}
                            style={styles.icon}
                            onPress={toggleLike}
                        />
                    </View>
                    {recipe.strCategory && (
                        <Text style={styles.category}>{recipe.strCategory}</Text>
                    )}
                    <Image source={{ uri: recipe.strMealThumb }} style={styles.thumbnail} />
                    <View style={styles.ingredientsContainer}>
                        <Text style={styles.sectionTitle}>Ingredients:</Text>
                        {renderIngredients()}
                    </View>
                    <Text style={styles.instructions}>{recipe.strInstructions}</Text>
                    {recipe.strYoutube && (
                        <WebView
                            style={styles.video}
                            source={{ uri: recipe.strYoutube.replace('watch?v=', 'embed/') }}
                        />
                    )}
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        padding: 20,
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
        textAlign: 'center',
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    category: {
        fontSize: 18,
        color: 'black',
        marginBottom: 10,
        textAlign: 'center',
    },
    thumbnail: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 20,
    },
    ingredientsContainer: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ingredient: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
    },
    instructions: {
        fontSize: 16,
        color: 'black',
        marginBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 20,
        marginTop: 10,
    },
    backButtonText: {
        fontSize: 18,
        color: 'white',
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 8,
    },
    video: {
        width: '100%',
        height: 200,
        marginTop: 20,
        marginBottom: 20,
    },
    headlineIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon: {
        marginLeft: 10,
    },
});
