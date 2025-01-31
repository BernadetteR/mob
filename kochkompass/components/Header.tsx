import React from 'react';
import { StyleSheet, Image, View, Text, StatusBar, Platform } from 'react-native';

// Define Props type
type HeaderProps = {
    headlineText: string;
};

export default function Header(props: HeaderProps) {
    return (
        <View style={styles.header}>
            <StatusBar
                backgroundColor="#02A382"
                barStyle="light-content"
                translucent={Platform.OS === 'android'}
            />
            <Image source={require('.././img/logo.png')} style={styles.logo}/>
            <View style={styles.textContainer}>
                <Text style={styles.headline}>{props.headlineText}</Text>
            </View>
        </View>
    );
}

// The Styles for the Header Component
const styles = StyleSheet.create({
    header: {
        width: '100%',
        backgroundColor: '#02A382',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingVertical: 20,
        paddingTop: Platform.OS === 'ios' ? 40 : 20,    // Design for iOS
    },
    logo: {
        width: 300,
        height: 180,
        resizeMode: 'contain',
        marginRight: 20,
        marginTop: -55,
    },
    textContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
        width: 300,
        borderColor: 'black',
        position: 'absolute',
        bottom: -20,
        zIndex: 1,
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    headline: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    }
});
