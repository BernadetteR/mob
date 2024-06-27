import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

export default function TabTwoScreen() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [supermarkets, setSupermarkets] = useState([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            // Load nearby supermarkets
            loadNearbySupermarkets(location.coords.latitude, location.coords.longitude);
        })();
    }, []);

    const loadNearbySupermarkets = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://overpass-api.de/api/interpreter?data=[out:json];node["shop"="supermarket"](around:10000,${latitude},${longitude});out body;`
            );

            setSupermarkets(response.data.elements);
        } catch (error) {
            console.error('Error fetching nearby supermarkets:', error);
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

                {supermarkets.map(supermarket => (
                    <Marker
                        key={supermarket.id}
                        coordinate={{
                            latitude: supermarket.lat,
                            longitude: supermarket.lon,
                        }}
                        title={supermarket.tags.name || 'Supermarket'}
                    />
                ))}
            </MapView>
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
        height: '100%',
    },
});
