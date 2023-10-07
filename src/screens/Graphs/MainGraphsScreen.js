
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';

import { Views } from '../../assets/styles/Views';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetIncomesByCategoryAndDate } from '../../modules/Graph/GraphActions';

import { BarChart, Grid, XAxis } from 'react-native-svg-charts'
import { MenuButton } from '../../components/MenuButton';
import { Forms } from '../../assets/styles/Forms';
import Routing from '../../navigation/Routing';
import * as RootRouting from '../../navigation/RootRouting'

class MainGraphsScreen extends Component
{

    constructor(props) { super(props); }

    componentDidMount()
    {
        this._getData()
    }

    async _getData() { await this.props.apiGetIncomesByCategoryAndDate() }

    render()
    {
        const { isLoadingGraphs, incomes } = this.props;
        const fill = 'rgb(134, 65, 244)'
        const incomesData = []
        // incomes.forEach(key => incomesData.push(key.categories))
        // const keys = Object.keys(incomesData[0])
        // const data = Object.values(incomesData[0])
        const data = [
            { value: 50, label: 'Categoría A' },
            { value: 80, label: 'Categoría B' },
            { value: 120, label: 'Categoría C' },
            // Agrega más datos de ser necesario
        ];

        return (
            <SafeAreaView style={styles.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <View style={Views.menuView}>
                        <MenuView
                            leftTitle="Gastos"
                            leftOnPress={() => RootRouting.navigate(Routing.expenseGraphs)}
                            rightTitle="Ingresos"
                            rightOnPress={() => RootRouting.navigate(Routing.incomeGraphs)} />
                    </View>
                    <View style={Forms.registerFormContainer}>

                        {/* <BarChart
                            style={{ height: 200, width: "80%" }}
                            data={incomes[0].ingresos}
                            yAccessor={({ item }) => item.value}
                            svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                            contentInset={{ top: 20, bottom: 20 }}
                        >
                            <XAxis
                                data={incomes[0].ingresos}
                                xAccessor={({ index }) => index}
                                formatLabel={(value) => incomes[0].ingresos[value].label}
                                contentInset={{ left: 40, right: 40 }}
                                svg={{ fontSize: 10, fill: 'black' }}
                            />
                        </BarChart> */}
                    </View>
                    {/* <BarChart style={{ height: 200, width: "80%" }} data={data} svg={{ fill }} contentInset={{ top: 30, bottom: 30 }}>
                        <XAxis
                            // style={{ marginHorizontal: 10 }}
                            data={data}
                            xAccessor={({ index }) => index}
                            formatLabel={keys}
                            contentInset={{ left: 10, right: 10 }}
                            svg={{ fontSize: 10, fill: 'black' }}
                        />
                        <Grid />
                    </BarChart> */}
                    {/* <StackedBarChart
                        style={{ height: 200, width: 300 }}
                        keys={keys}
                        colors={colors}
                        data={data}
                        showGrid={true}
                        contentInset={{ top: 30, bottom: 30 }}
                    /> */}
                </ImageBackground>
            </SafeAreaView >
        );
    }

}

const data = [
    {
        total: 225,
        month: new Date()
    },
    {
        total: 270,
        month: new Date()
    },
    {
        total: 33,
        month: new Date()
    }
]


const MenuView = (props) =>
{

    const { leftTitle, leftOnPress, rightTitle, rightOnPress } = props;
    return (
        <View style={Views.row}>
            <MenuButton title={leftTitle} onPress={leftOnPress} />
            <MenuButton title={rightTitle} onPress={rightOnPress} />
        </View>
    )
}

const mapStateToProps = ({ GraphReducer }) =>
{

    const { incomes, expenses, isLoadingIncomes } = GraphReducer;

    return { incomes, expenses, isLoadingIncomes };

};

const mapStateToPropsAction = {
    apiGetIncomesByCategoryAndDate,
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        // display: 'flex',
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 10, padding: "5%",
        marginTop: "5%",
        backgroundColor: 'rgba(236, 236, 236, .8)',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: "row",
        margin: "2%",
        alignItems: 'center',
    },
    title: {
        width: "60%",
        justifyContent: 'center',
        alignItems: 'flex-start',
        display: 'flex',
        paddingLeft: 0,
    },
    rightButton: {
        width: "20%",
        alignItems: 'flex-end',
        justifyContent: 'center',
        display: 'flex'
    }

});

export default connect(mapStateToProps, mapStateToPropsAction)(MainGraphsScreen);
