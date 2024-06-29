import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Header from "@/components/Header";
import {globalStyles} from "@/styles/global";

type LocationObject = {
    coords: {
        latitude: number;
        longitude: number;
    };
};

type Store = {
    id: number;
    lat: number;
    lon: number;
    tags: {
        name?: string;
        opening_hours?: string;
    };
};

export default function TabThreeScreen() {
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            // Load nearby stores (supermarkets, grocery stores, convenience stores)
            loadNearbyStores(location.coords.latitude, location.coords.longitude);
        })();
    }, []);

    const loadNearbyStores = async (latitude: number, longitude: number) => {
        try {
            const response = await axios.get(
                `https://overpass-api.de/api/interpreter?data=[out:json];(node["shop"="supermarket"](around:10000,${latitude},${longitude});node["shop"="grocery"](around:2000,${latitude},${longitude});node["shop"="convenience"](around:2000,${latitude},${longitude}););out body;`
            );

            setStores(response.data.elements);
        } catch (error) {
            console.error('Error fetching nearby stores:', error);
        }
    };

    const handleMarkerPress = (store: Store) => {
        setSelectedStore(store);
    };

    const renderOpeningHours = () => {
        if (selectedStore && selectedStore.tags.opening_hours) {
            return (
                <View style={styles.openingHoursContainer}>
                    <Text style={styles.openingHoursTitle}>Opening Hours:</Text>
                    <Text>{selectedStore.tags.opening_hours}</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.openingHoursContainer}>
                    <Text style={styles.openingHoursTitle}>No opening hours available</Text>
                </View>
            );
        }
    };

    if (errorMsg) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.title}>Error</Text>
                <Text>{errorMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={[globalStyles.globalContainer, styles.container]}>
            <Header headlineText="Closest Shops" />
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    title="I am here"
                />

                {stores.map(store => (
                    <Marker
                        key={store.id}
                        coordinate={{
                            latitude: store.lat,
                            longitude: store.lon,
                        }}
                        title={store.tags.name || 'Store'}
                        onPress={() => handleMarkerPress(store)}
                    />
                ))}
            </MapView>

            {selectedStore && (
                <View style={styles.selectedStoreContainer}>
                    <Text style={styles.selectedStoreTitle}>{selectedStore.tags.name}</Text>
                    {renderOpeningHours()}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    map: {
        flex: 1,
        marginTop: 40,
        margin: 20,
    },
    selectedStoreContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    selectedStoreTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    openingHoursContainer: {
        marginTop: 5,
    },
    openingHoursTitle: {
        fontWeight: 'bold',
    },
});
