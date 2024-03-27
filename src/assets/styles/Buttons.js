import { StyleSheet } from 'react-native';
import * as Color from './Colors';
import { Style } from './Style';

const Buttons = StyleSheet.create({
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Color.button,
        paddingVertical: "2%",
        paddingHorizontal: "10%",
        marginTop: 20,
        marginBottom: 20
    },
    pressedButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: Color.button,
        borderWidth: 2,
        borderColor: Color.button,
        paddingVertical: "2%",
        paddingHorizontal: "10%",
        marginTop: 20,
        marginBottom: 20
    },
    categoryButton: {
        width: Style.DEVICE_NINETY_PERCENT_WIDTH,
        borderWidth: 1,
        borderRadius: 10,
        padding: Style.PADDING_3XS,
        margin: "2%",

    },
    homeButtonPressed: {
        width: "50%",
        height: "80%",
        borderWidth: 1,
        borderColor: Color.button,
        borderRadius: 10,
        backgroundColor: Color.button,
        justifyContent: 'center',
        alignItems: 'center'
    },
    homeButton: {
        width: "50%",
        height: "80%",
        borderWidth: 1,
        borderColor: Color.white,
        borderRadius: 10,
        backgroundColor: 'rgba(236, 236, 236, .8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerRightButton: {
        display: 'flex',
        marginLeft: 'auto',
        alignItems: 'flex-end'
    },
    touchableIcon: {
        borderWidth: 1,
        borderColor: Color.firstText,
        margin: "1%",
        alignItems: 'center',
        padding: 2,
        borderRadius: 10
    },
    touchableIconSelected: {
        borderWidth: 1,
        borderColor: Color.button,
        margin: "1%",
        alignItems: 'center',
        padding: 2,
        borderRadius: 10
    },
    fullWithButton: {
        width: "100%",
        height: "80%",
        borderWidth: 1,
        borderColor: Color.white,
        borderRadius: 10,
        backgroundColor: 'rgba(236, 236, 236, .8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pressedFullWithButton: {
        width: "100%",
        height: "80%",
        borderWidth: 1,
        borderColor: Color.button,
        borderRadius: 10,
        backgroundColor: Color.button,
        justifyContent: 'center',
        alignItems: 'center'
    },

});

export { Buttons };