import { StyleSheet } from 'react-native';
import * as Color from './Colors';
import { Style } from './Style';


const Views = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
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
        marginVertical: 15,
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
        resizeMode: 'cover', // O 'stretch' si prefieres estirar la imagen para cubrir toda la pantalla
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    squareBackground: {
        paddingVertical: 20,
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: 'rgba(236, 236, 236, .8)',
    },

    container: {
        flex: 1,
        width: "100%",
        alignItems: 'center',
        // justifyContent: 'center',
    },
    graphContainer: {
        height: 300,
        padding: 20,
        flexDirection: 'row',
        width: '90%'
    },
    collapseHeader: {
        borderColor: Color.white,
        borderWidth: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        height: 60,
        backgroundColor: Color.bodyBackground
    },
    collapseHeaderView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignContent: 'center',
        bodyBackground: ''
    },
    collapseHeaderText: {
        color: Color.headerBackground,
        fontSize: Style.FONT_SIZE_MEDIUM,
        fontFamily: Style.FONT_FAMILY
    },
    collapseBodyView: {
        height: 90,
        borderWidth: 1,
        flexDirection: 'column',
        marginVertical: 5,
        marginHorizontal: 5,
        alignItems: 'center',
        borderRadius: 10,
        borderColor: Color.white,
        backgroundColor: Color.bodyBackground,
        paddingHorizontal: 15,
        justifyContent: 'center'
    },
    collapseBodyText: {
        fontSize: Style.FONT_SIZE,
        fontFamily: Style.FONT_FAMILY,
        width: "45%",
        color: Color.firstText,
    },
    collapseBodyNoData: {
        fontSize: Style.FONT_SIZE,
        fontFamily: Style.FONT_FAMILY,
        color: Color.firstText
    },
    collapseBodyTextAmount: {
        color: Color.button,
        fontWeight: 'bold',
    },
    collapseBodyTextCategory: {
        fontWeight: 'bold',
    }

});

export { Views };