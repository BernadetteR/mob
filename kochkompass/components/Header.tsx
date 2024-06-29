import React from 'react';
import { StyleSheet, Image, View, Text, StatusBar, SafeAreaView, Platform } from 'react-native';

// Logo importieren
import logo from '../img/logo.jpeg';

export default function Header({ headlineText, onInfoPress }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#02A382" barStyle="light-content" />
            <View style={styles.header}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.headline}>{headlineText}</Text>
                <View style={styles.infoButtonContainer}>
                    <FontAwesome5
                        name="info-circle"
                        size={25}
                        color="white"
                        onPress={onInfoPress}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#02A382',
    },
    header: {
        backgroundColor: '#02A382',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 20,
        paddingTop: Platform.OS === 'android' ? 30 : 10, // mehr Padding für Android
        width: '100%',
    },
    logo: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 50,
        height: 50,
        resizeMode: 'contain', // Verhindert, dass das Bild verzerrt wird
    },
    headline: {
        color: 'white',
        fontSize: 24,
    },
    infoButtonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});
