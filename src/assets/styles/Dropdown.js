import { StyleSheet } from 'react-native';
import * as Color from './Colors';
import { Style } from './Style';

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
        fontSize: Style.FONT_SIZE_SMALL,
        color: Color.placeholder,
    },
    selectedTextStyle: {
        fontSize: Style.FONT_SIZE_SMALL,
        color: Color.firstText
    },

});

export { Dropdown };