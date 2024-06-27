import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

export default function TabTwoScreen() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);

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

    const loadNearbyStores = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://overpass-api.de/api/interpreter?data=[out:json];(node["shop"="supermarket"](around:10000,${latitude},${longitude});node["shop"="grocery"](around:2000,${latitude},${longitude});node["shop"="convenience"](around:2000,${latitude},${longitude}););out body;`
            );

            setStores(response.data.elements);
        } catch (error) {
            console.error('Error fetching nearby stores:', error);
        }
    };

    const handleMarkerPress = (store) => {
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
            <View style={styles.container}>
                <Text style={styles.title}>Error</Text>
                <Text>{errorMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    map: {
        width: '100%',
        height: '70%',
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
