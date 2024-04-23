import { StyleSheet } from 'react-native';
import * as Color from './Colors';



const Dropdown = StyleSheet.create({
    dropdown: {
        padding: 5,
        flex: 1,
        alignSelf: 'center',
        height: 30,
        borderColor: Color.white,
        borderTopWidth: 1,
    },
    placeholderStyle: {
        fontSize: 14,
        color: Color.white,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: Color.firstText
    },

});

export { Dropdown };