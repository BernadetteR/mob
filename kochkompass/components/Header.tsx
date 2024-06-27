import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';

// Logo importieren
import logo from '../img/essen.png';

// Headline wird mitgegeben
export default function Header(props) {
    return (
        <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.headline}>{props.headlineText}</Text>
        </View>
    );
}

// Die Styles für die Header-Komponente
const styles = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
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
        fontWeight: 'bold',
    },
});
