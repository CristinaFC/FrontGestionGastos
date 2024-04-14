import { StyleSheet } from 'react-native';
import * as Color from './Colors';
import { Style } from './Style';


const Texts = StyleSheet.create({
    optionText: {
        fontSize: 16,
        color: Color.firstText,
        fontFamily: 'OpenSans',
        letterSpacing: 0.1,
        fontWeight: 'bold',
    },
    buttonText: {
        fontSize: 14,
        color: Color.firstText,
        fontFamily: 'OpenSans',
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
        fontFamily: 'Lato',
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: Color.firstText,
        marginBottom: 20
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
        fontSize: 20,
        color: Color.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Lato'
    },

    headerWithBackButtom: {
        fontSize: 25,
        // letterSpacing: 0.8,
        color: Color.white,
        fontWeight: 'bold',
        margin: 'auto',
        textAlign: 'center',
        paddingLeft: "10%",
        fontFamily: 'Montserrat'
    },
    recentsText: {
        fontSize: 16,
        color: Color.firstText,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },

});

export { Texts };