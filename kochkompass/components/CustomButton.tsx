import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#02A382',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginVertical: 5,
    },
    buttonText: {
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CustomButton;
