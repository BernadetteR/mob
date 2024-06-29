import {StyleSheet} from "react-native";

export const globalStyles = StyleSheet.create({
    globalContainer: {
        backgroundColor: 'white',
        flex: 1,
    },
    globalHeadline: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    globalButton: {
        backgroundColor: '#02A382',
        borderRadius: 20,
        textTransform: 'uppercase',
        color: 'white',
        minWidth: 120,
        alignItems: 'center',
    },
    globalScrollContainer: {
        flexGrow: 1,
    }

})