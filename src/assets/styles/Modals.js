import { StyleSheet } from 'react-native';
import * as Color from './Colors';
import { Style } from './Style';


const Modals = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Color.white,
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    modalCategory: {
        width: "100%",
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: Color.bodyBackground,
        height: 40,
        alignItems: 'center'
    },
    categoryText: {
        color: Color.firstText,
        marginLeft: 10,
    },
})


export { Modals };