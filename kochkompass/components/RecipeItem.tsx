import React from 'react';
import { StyleSheet, View, ImageBackground, Text, TouchableOpacity } from 'react-native';

export default function RecipeItem({ item, onPress }) {
    return (
        <TouchableOpacity onPress={() => onPress(item)} style={styles.touchable}>
            <ImageBackground source={{ uri: item.strMealThumb }} style={styles.background}>
                <View style={styles.overlay}>
                    <Text style={styles.title}>{item.strMeal}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchable: {
        flex: 1,
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        height: 55,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 15,
        width: '100%',
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
    },
});
