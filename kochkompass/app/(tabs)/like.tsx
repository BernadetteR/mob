import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
    navigation: any; // Falls Navigation erforderlich ist
};

const LikeScreen: React.FC<Props> = ({ navigation }) => {
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
        <View style={{ padding: 10 }}>
            <Text>{item}</Text>
            {/* Hier könntest du weitere Details oder eine Miniaturansicht des Rezepts anzeigen */}
        </View>
    );

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {likedRecipes.length > 0 ? (
                <FlatList
                    data={likedRecipes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item}
                    style={{ width: '100%' }}
                />
            ) : (
                <Text>No liked recipes yet.</Text>
            )}
        </View>
    );
};

export default LikeScreen;
