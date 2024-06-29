import React from 'react';
import { StyleSheet, Image, View, Text, StatusBar, SafeAreaView } from 'react-native';

// Logo importieren
import logo from '../img/logo.jpeg';

// Headline wird mitgegeben
export default function Header(props) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#02A382" barStyle="light-content" />
            <View style={styles.header}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.headline}>{props.headlineText}</Text>
            </View>
        </SafeAreaView>
    );
}

// Die Styles für die Header-Komponente
const styles = StyleSheet.create({
    safeArea: {
        flex: 0,
        backgroundColor: '#02A382',
    },
    header: {
        backgroundColor: '#02A382',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 20,
        paddingTop: 10,
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
});
