import { StyleSheet } from 'react-native';
import { Style } from './Style';

const Forms = StyleSheet.create({

    registerFormContainer: {
        width: Style.DEVICE_NINETY_PERCENT_WIDTH,
        height: Style.DEVICE_SEVENTY_PERCENT_HEIGHT,
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: 'rgba(236, 236, 236, .8)',
        justifyContent: 'space-evenly'
    },
    loginFormContainer: {
        width: Style.DEVICE_EIGHTY_PERCENT_WIDTH,
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