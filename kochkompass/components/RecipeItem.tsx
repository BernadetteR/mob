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
                    <Text numberOfLines={2} style={styles.title}>{item.strMeal}</Text>
                    <TouchableOpacity onPress={toggleLike}>
                        <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color="white" style={styles.icon} />
                    </TouchableOpacity>
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
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        height: 55,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        flex: 1,
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
    },
    icon: {
        marginLeft: 10,
    },
});
