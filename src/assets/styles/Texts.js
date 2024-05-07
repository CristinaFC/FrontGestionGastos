import { StyleSheet } from 'react-native';
import * as Color from './Colors';
import { Style } from './Style';


const Texts = StyleSheet.create({
    buttonWithOrangeBack: {
        fontSize: Style.FONT_SIZE_SMALL,
        fontFamily: Style.FONT_FAMILY,
        color: Color.white
    },
    optionText: {
        fontSize: 16,
        color: Color.firstText,
        fontFamily: 'OpenSans',
        letterSpacing: 0.1,
        fontWeight: 'bold',
    },
    buttonText: {
        fontSize: Style.FONT_SIZE_SMALL,
        color: Color.firstText,
        fontFamily: Style.FONT_FAMILY,
        letterSpacing: 0.1,
        fontWeight: 'bold',
    },
    inputTitle: {
        fontSize: Style.FONT_SIZE_SMALL,
        fontFamily: Style.FONT_FAMILY,
        letterSpacing: 0.1,
        width: "100%",
        color: Color.firstText,
    },
    buttonTextSelected: {
        fontSize: 14,
        color: Color.white,
        fontFamily: 'OpenSans',
        letterSpacing: 0.2,
        fontWeight: 'bold'
    },
    errorText: {
        // alignSelf: 'flex-start',
        width: "100%",
        fontSize: 14,
        letterSpacing: 0.2,
        color: "#D17A00",
        marginTop: 0,
    },
    text: {
        fontFamily: Style.FONT_FAMILY,
        fontSize: Style.FONT_SIZE_SMALL,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: Color.firstText,
        marginBottom: 20,
    },
    attrName: {
        borderBottomWidth: 1,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: Color.firstText,
        fontWeight: 'bold',
        marginBottom: 20,
        width: "30%",
        fontFamily: Style.FONT_FAMILY,
        fontSize: Style.FONT_SIZE_MEDIUM,
    },

    overviewTextPositive: {
        fontFamily: 'Lato',
        fontSize: 20,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: Color.button,
        fontWeight: 'bold'
    },
    overviewTextNegative: {
        fontFamily: 'Lato',
        fontSize: 20,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: Color.orange,
        fontWeight: 'bold'
    },

    titleText: {
        fontSize: Style.FONT_SIZE_TITLE_S,
        color: Color.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: Style.TITLE_FONT_FAMILY
    },

    recentsText: {
        fontSize: 16,
        color: Color.firstText,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    conceptTitle: {
        textAlign: 'center',
        fontSize: Style.FONT_SIZE_TITLE_M,
        color: Color.headerBackground,
        fontFamily: Style.FONT_FAMILY,
        marginTop: 30
    }

});

export { Texts };