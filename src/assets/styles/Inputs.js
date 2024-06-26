import { StyleSheet } from 'react-native';
import * as Color from './Colors';
import { Style } from './Style';


const Inputs = StyleSheet.create({
    loginInput: {
        height: "13%",
        width: "80%",
        margin: "2%",
        borderBottomWidth: 1,
        borderBottomColor: Color.firstText,
        padding: 0,
        color: Color.firstText,
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
    },
    registerInput: {
        height: 35,
        width: "100%",
        borderBottomWidth: 0.5,
        borderBottomColor: Color.firstText,
        color: Color.firstText,
        fontSize: Style.FONT_SIZE_SMALL,
        paddingBottom: 5,
        paddingTop: 0,
        paddingHorizontal: 0,
        fontFamily: Style.FONT_FAMILY
    },
    forgotPasswordInput: {
        height: "15%",
        width: "85%",
        // marginTop: "1%",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Color.orange,
        color: Color.firstText,
        fontSize: Style.FONT_SIZE_SMALL,
    },
    middleDropdown: {
        padding: 5,
        width: "45%",
        alignSelf: 'center',
        height: 40,
        borderColor: Color.white,
        borderWidth: 1,
        marginVertical: 10,
        backgroundColor: 'rgba(236, 236, 236, .8)',
        borderRadius: 10
    },
    halfDropdown: {
        padding: 5,
        width: Style.DEVICE_FORTY_FIVE_PERCENT_WIDTH,
        height: 40,
        borderColor: Color.white,
        borderWidth: 1,
        backgroundColor: Color.bodyBackground,
        borderRadius: 10
    },
    fullDropdown: {
        borderColor: Color.firstText,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
        height: 35,
        paddingStart: 5,
        paddingVertical: 5
    },


});

export { Inputs };