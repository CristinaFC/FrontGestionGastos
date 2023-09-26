import { StyleSheet } from 'react-native';
import * as Color from './Colors';
import { Style } from './Style';


const Views = StyleSheet.create({
    titleContainer: {
        display: 'flex',
        width: '100%',
        height: '10%',
        backgroundColor: Color.headerBackground,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Color.headerBackground,
        flexDirection: 'row',
        marginBottom: "2%"
    },
    menuView: {
        width: "90%",
        height: "7%",
        display: "flex",
        justifyContent: 'space-around',
        flexDirection: "column",
        marginVertical: 15
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        display: 'flex',
        width: '100%',
        height: 60,
        backgroundColor: Color.headerBackground,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        padding: Style.PADDING_2XS
    },
    image: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    }

});

export { Views };