import { StyleSheet } from 'react-native';
import { Style } from './Style';
import * as Color from './Colors';


const Icons = StyleSheet.create({
    headerSaveIcon: {
        borderWidth: 1,
        width: Style.DEVICE_TEN_PERCENT_WIDTH,
        height: Style.DEVICE_TEN_PERCENT_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: Color.white,
        flexDirection: 'row',
        backgroundColor: Color.white
    },
})


export { Icons };