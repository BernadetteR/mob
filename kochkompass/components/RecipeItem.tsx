import React from 'react';
import { StyleSheet, View, ImageBackground, Text } from 'react-native';

export default function RecipeItem({ item }) {
    return (
        <View style={styles.recipeItem}>
            <ImageBackground source={{ uri: item.strMealThumb }} style={styles.background}>
                <View style={styles.container}>
                    <Text style={styles.title}>{item.strMeal}</Text>
                </View>
            </ImageBackground>
        </View>

    );
}

const styles = StyleSheet.create({
    recipeItem: {
        backgroundColor: 'white',
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
    },
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Hintergrundfarbe mit Transparenz für den Text
        padding: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'black', // Schattierung für den Text
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});
