import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'; //to import location for gps
import axios from 'axios'; //import axios for api requests
import Header from "@/components/Header";
import {globalStyles} from "@/styles/global";

// Defining the type for the location object
type LocationObject = {
    coords: {
        latitude: number;
        longitude: number;
    };
};
//Defining the type for the store
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
    const [location, setLocation] = useState<LocationObject | null>(null); //state for current location
    const [errorMsg, setErrorMsg] = useState<string | null>(null); //state for error massage
    const [stores, setStores] = useState<Store[]>([]); //state for list of stores
    const [selectedStore, setSelectedStore] = useState<Store | null>(null); //state for selected store

    useEffect(() => {
        (async () => {
            //Requesting permission for location access
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            // to get the current location
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            // Load nearby stores (supermarkets, grocery stores, convenience stores) based on location
            loadNearbyStores(location.coords.latitude, location.coords.longitude);
        })();
    }, []);
    // Function to load nearby stores
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
    // function when a marker(pin) is clicked
    const handleMarkerPress = (store: Store) => {
        setSelectedStore(store);
    };
    // opening hours of the selected store
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
    // error message
    if (errorMsg) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.title}>Error</Text>
                <Text>{errorMsg}</Text>
            </View>
        );
    }
    //if location is not set
    if (!location) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    // render function
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
// styles
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
