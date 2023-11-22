import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, ImageBackground, ScrollView, Text } from 'react-native';
import Routing from '../navigation/Routing';

import * as Color from '../assets/styles/Colors';

import { MenuButton } from '../components/MenuButton';
import { connect } from 'react-redux';
import { apiLogout, clearDataLogin } from '../modules/Auth/AuthActions';
import { apiGetBalance } from '../modules/Balance/BalanceActions';
import * as RootRouting from '../navigation/RootRouting';
import { Views } from '../assets/styles/Views';

import Header from '../components/Header';
import { localAssets } from '../assets/images/assets';

import { PieChart } from 'react-native-svg-charts'
class HomeScreen extends Component
{

    constructor(props) { super(props); }

    // componentDidMount() { this._getData() }

    _getData() { this.props.apiGetBalance() }

    render()
    {

        const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

        const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)

        const pieData = data
            .filter((value) => value > 0)
            .map((value, index) => ({
                value,
                svg: {
                    fill: randomColor(),
                    onPress: () => console.log('press', index),
                },
                key: `pie-${index}`,
            }))
        const { totalAmount, totalExpenses, totalIncomes, } = this.props.balance
        return (

            <SafeAreaView style={Views.container}>
                <Header
                    rightIcon="menu"
                    rightAction={() => RootRouting.navigate(Routing.settings)}
                    title="GestiónGastos"
                    goBack={false} />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>

                    {/* <View style={Views.header}>
                    <Text style={Texts.headerWithBackButtom}>GestiónGastos</Text>
                    <Pressable style={{ display: 'flex', marginLeft: 'auto', alignItems: 'flex-end' }} onPress={() => }>
                        <MaterialCommunityIcons name="menu" size={30} color={Color.white} />
                    </Pressable>
                </View> */}
                    <ButtonsView />
                    <ScrollView horizontal={true} style={{ flex: 1 }} >
                        <View style={styles.overviewContent}>
                            {/* <View style={styles.overview}>
                                <Text style={styles.overviewTitle}>Saldo</Text>
                                <Text style={totalAmount >= 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{totalAmount}€
                                </Text>
                            </View> */}
                            {/* <View style={styles.overview}>
                                <Text style={styles.overviewTitle}>Ingresos</Text>
                                <Text style={totalIncomes > 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{totalIncomes}€</Text>
                            </View>
                            <View style={styles.overview}>
                                <Text style={styles.overviewTitle}>Gastos</Text>
                                <Text style={totalExpenses <= 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{totalExpenses}€</Text>
                            </View> */}
                        </View>
                    </ScrollView>
                    {/* <View style={styles.overviewContent}>
                        <View style={styles.overview}>
                            <Text style={styles.overviewTitle}>Saldo</Text>
                            <Text style={totalAmount >= 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{totalAmount}€
                            </Text>
                        </View>
                        <View style={styles.overview}>
                            <Text style={styles.overviewTitle}>Ingresos</Text>
                            <Text style={totalIncomes > 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{totalIncomes}€</Text>
                        </View>
                        <View style={styles.overview}>
                            <Text style={styles.overviewTitle}>Gastos</Text>
                            <Text style={totalExpenses <= 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{totalExpenses}€</Text>
                        </View>
                    </View> */}

                    <View style={{ width: '100%', height: '60%', borderTopWidth: 1, borderColor: Color.white, padding: "5%", alignItems: 'center', alignSelf: 'flex-end' }}>

                        <PieChart style={{ height: "100%", width: "100%", }} data={pieData} />
                    </View>
                </ImageBackground>
            </SafeAreaView >)


    }
}


const ButtonsView = () =>
{

    return (
        <View style={styles.menuView}>
            <View style={styles.row}>
                <MenuButton title="GASTOS" onPress={() => RootRouting.navigate(Routing.menuExpenses)} />
                <MenuButton title="INGRESOS" onPress={() => RootRouting.navigate(Routing.incomes)} />
            </View>
            <View style={styles.row}>
                <MenuButton title="CUENTAS" onPress={() => RootRouting.navigate(Routing.accounts)} />
                <MenuButton title="GRÁFICOS" onPress={() => RootRouting.navigate(Routing.graphs)} />
            </View>
        </View>
    )

}
const styles = StyleSheet.create({
    menuView: {
        width: "80%",
        height: "15%",
        display: "flex",
        justifyContent: 'space-around',
        flexDirection: "column",
        marginVertical: 10,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        width: "100%",
        height: "50%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Color.bodyBackground,
    },
    overview: {
        width: "30%",
        margin: "1%",
        height: "100%",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(236, 236, 236, .8)',
        marginTop: 15,
        backgroundColor: 'rgba(236, 236, 236, .8)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    overviewTitle: {
        fontSize: 18, color: Color.firstText, marginBottom: 5
    },
    overviewContent: {
        height: '20%',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: Color.white
    }
});

const mapStateToProps = ({ BalanceReducer }) =>
{
    const { balance } = BalanceReducer;
    return { balance }
}
const mapStateToPropsAction = {
    apiLogout,
    clearDataLogin,
    apiGetBalance
};


export default connect(mapStateToProps, mapStateToPropsAction)(HomeScreen);