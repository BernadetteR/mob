import React from 'react';
import { StyleSheet, View, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RecipeItem({ item, onPress, isLiked, onToggleLike }) {
    const toggleLike = () => {
        onToggleLike(item.idMeal);
    };

    return (
        <TouchableOpacity onPress={() => onPress(item)} style={styles.touchable}>
            <ImageBackground source={{ uri: item.strMealThumb }} style={styles.background}>
                <View style={styles.overlay}>
                    <Text style={styles.title}>{item.strMeal}</Text>
                    <TouchableOpacity onPress={toggleLike}>
                        <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color="white" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
}

// Stil bleibt unverändert


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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
    },
    icon: {
        marginLeft: 10, // Abstand zwischen dem Text und dem Icon
    },
});
