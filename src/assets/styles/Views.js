import { StyleSheet } from 'react-native';
import * as Color from './Colors';
import { Style } from './Style';


const Views = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
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
    menuHeaderView: {
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
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    squareBackground: {
        marginTop: 10,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: Color.white,
    },

    container: {
        flex: 1,
        backgroundColor: Color.bodyBackground,
    },
    collapseHeader: {
        borderColor: Color.white,
        borderWidth: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        height: 60,
        backgroundColor: Color.headerBackground
    },
    collapseHeaderView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignContent: 'center',
        borderWidth: 1,
        borderColor: Color.white,
        backgroundColor: Color.headerBackground,
        width: Style.DEVICE_WIDTH
    },
    collapseHeaderText: {
        color: Color.white,
        fontSize: Style.FONT_SIZE_MEDIUM,
        fontFamily: Style.FONT_FAMILY
    },
    collapseBodyView: {
        height: 200,
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
        fontSize: Style.FONT_SIZE_SMALL,
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
        fontSize: Style.FONT_SIZE
    },

    imageHeader: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: Color.white,
        backgroundColor: Color.headerBackground,
    },
    recentsTitleContainer: {
        width: "100%",
        backgroundColor: Color.bodyBackground,
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderColor: Color.bodyBackground
    },

    imageHeaderWithFilters: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        borderWidth: 1,
        borderColor: Color.white,
        backgroundColor: Color.headerBackground,
    },
    graphContainer: {
        width: "100%",
        height: "100%",
        alignItems: "center"
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalScrollContainer: {
        flex: 1,
        backgroundColor: Color.white
    },
    modalContent: {
        position: 'absolute',
        width: '100%',
        height: Style.DEVICE_HALF_HEIGHT,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verticalGraphScrollView: {
        marginVertical: 10,
        // marginLeft: 10,
        // borderTopLeftRadius: 20,
        // borderBottomLeftRadius: 20,
    },
    horizontalGraphScrollView: {
        borderRadius: 20,
        backgroundColor: Color.white
    },
    swticherContainer: {
        flexDirection: 'row',
        height: 20,
        marginTop: 10,
        marginBottom: 20,
        width: Style.DEVICE_NINETY_PERCENT_WIDTH,
        justifyContent: 'space-between',
    },

});

export { Views };