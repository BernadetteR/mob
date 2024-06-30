import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from "@/styles/global";
import Header from "@/components/Header";

type Props = {
    navigation: any; // Falls Navigation erforderlich ist
};

export default function TabFourScreen({ navigation }: Props) {
    const [likedRecipes, setLikedRecipes] = useState<string[]>([]);

    useEffect(() => {
        loadLikedRecipes();
    }, []);

    useEffect(() => {
        // Hier kannst du die Anzeige aktualisieren, wenn likedRecipes sich ändert
        // Du könntest hier weitere Logik hinzufügen, um auf Änderungen zu reagieren
    }, [likedRecipes]);

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

    const renderItem = ({ item }: { item: string }) => (
        <View style={styles.item}>
            <Text>{item}</Text>
            {/* Hier könntest du weitere Details oder eine Miniaturansicht des Rezepts anzeigen */}
        </View>
    );

    return (
        <View style={globalStyles.globalContainer}>
            <Header headlineText="My Favorites" />
            <View style={styles.container}>
                {likedRecipes.length > 0 ? (
                    <FlatList
                        data={likedRecipes}
                        renderItem={renderItem}
                        keyExtractor={(item) => item}
                        style={styles.flatList}
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
        justifyContent: 'center',
        marginTop: 40,
    },
    flatList: {
        width: '100%',
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
