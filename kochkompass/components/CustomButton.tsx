import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type CustomButtonProps = {
    title: string;
    onPress: () => void;
    isSelected: boolean;
};

export default function CustomButton({ title, onPress, isSelected }: CustomButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, isSelected ? styles.selectedButton : null]}
        >
            <Text style={[styles.buttonText, isSelected ? styles.selectedText : null]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#02A382',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#02A382', // Initial border color when not selected
    },
    selectedButton: {
        backgroundColor: 'white', // Selected background color
        borderColor: '#02A382', // Selected border color
    },
    buttonText: {
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    selectedText: {
        color: '#02A382', // Selected text color
    },
});
