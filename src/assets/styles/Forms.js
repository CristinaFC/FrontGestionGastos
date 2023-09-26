import { StyleSheet } from 'react-native';
import * as Color from './Colors';
import { Style } from './Style';

const Forms = StyleSheet.create({

    registerFormContainer: {
        width: "80%",
        height: 500,
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: 'rgba(236, 236, 236, .8)',
        justifyContent: 'space-evenly'
    },
    loginFormContainer: {
        width: "80%",
        height: 340,
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: 'rgba(236, 236, 236, .8)',
        justifyContent: "space-evenly",
    },
    forgotPasswordFormContainer: {
        height: Style.DEVICE_FORTY_PERCENT_HEIGHT,
        width: "90%",
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: 'rgba(236, 236, 236, .8)',
        justifyContent: "center",
    },
});

export { Forms };