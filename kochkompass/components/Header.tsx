import React from 'react';
import { StyleSheet, Image, View, Text, StatusBar, SafeAreaView } from 'react-native';

// Logo importieren
import logo from '../img/logo.png';

// Headline wird mitgegeben
export default function Header(props) {
    return (
        <View style={styles.header}>
            <StatusBar backgroundColor="#02A382" barStyle="light-content" />
            <Image source={logo} style={styles.logo} />
            <Text style={styles.container}>{props.headlineText}</Text>
        </View>
    );
}

// Die Styles für die Header-Komponente
const styles = StyleSheet.create({
    header: {
        width: '100%',
        backgroundColor: '#02A382',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingVertical: 20, // Verringert die Höhe des Headers
    },
    logo: {
        width: 300, // Verkleinert das Logo
        height: 180,
        resizeMode: 'contain',
        marginRight: 20,
        marginTop: -20,
    },
    headline: {
        color: 'white',
        fontSize: 24,
    },
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        width: 270,
        alignItems: 'center',
        borderRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: 'black',
        position: 'absolute',
        bottom: -20,
        zIndex: 1,
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    }
});