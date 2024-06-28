import React from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export default function RecipeDetailScreen({ route, navigation }) {
    const { recipe } = route.params;

    const renderIngredients = () => {
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (recipe[`strIngredient${i}`]) {
                ingredients.push(
                    <Text key={i} style={styles.ingredient}>
                        {recipe[`strIngredient${i}`]} - {recipe[`strMeasure${i}`]}
                    </Text>
                );
            }
        }
        return ingredients;
    };

    return (
        <ImageBackground source={{ uri: recipe.strMealThumb }} style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.overlayContainer}>
                    <Text style={styles.title}>{recipe.strMeal}</Text>
                    <View style={styles.tagContainer}>
                        <Text style={styles.tag}>{recipe.strCategory}</Text>
                        <Text style={styles.tag}>{recipe.strArea}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        {renderIngredients()}
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        <Text style={styles.instructions}>{recipe.strInstructions}</Text>
                    </View>
                    {recipe.strYoutube ? (
                        <View style={styles.videoContainer}>
                            <Text style={styles.sectionTitle}>Video</Text>
                            <WebView
                                style={styles.video}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                source={{ uri: recipe.strYoutube.replace("watch?v=", "embed/") }}
                            />
                        </View>
                    ) : null}
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
    scrollContainer: {
        flexGrow: 1,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    overlayContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 20,
        margin: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    tagContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    tag: {
        backgroundColor: '#ddd',
        color: '#555',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginHorizontal: 5,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    ingredient: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    instructions: {
        fontSize: 16,
        color: '#555',
        textAlign: 'left',
    },
    videoContainer: {
        height: 200,
        marginTop: 20,
    },
    video: {
        flex: 1,
    },
});
