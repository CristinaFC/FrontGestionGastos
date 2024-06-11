
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { connect } from 'react-redux';

import { MenuButton } from '../../../components/MenuButton';
import Routing from '../../../navigation/Routing';
import { localAssets } from '../../../assets/images/assets';


import * as RootRouting from '../../../navigation/RootRouting'
import { Option } from '../../../components/Option';

class ExpensesGraphsMenuScreen extends Component
{

    constructor(props) { super(props); }
    render()
    {
        return (
            <SafeAreaView style={[Views.container]}>
                <Header goBack={true} title="Gráficos" />
                <Option action={() => RootRouting.navigate(Routing.expensesPerMonthsGraphScreen)} title="Gastos mensuales" icon="chart-bar" />
                <Option action={() => RootRouting.navigate(Routing.expensesPerYearGraphScreen)} title="Gastos anuales" icon="chart-areaspline" />
                <Option action={() => RootRouting.navigate(Routing.expensesByCategoryAndYearGraphScreen)} title="Categorías anuales" icon="chart-line" />
                <Option action={() => RootRouting.navigate(Routing.expensesByAccountPerMonthGraphScreen)} title="Método de pago mensual" icon="chart-pie" />
                <Option action={() => RootRouting.navigate(Routing.expensesByAccountPerYearGraphScreen)} title="Método de pago anual" icon="chart-pie" />
                <Option action={() => RootRouting.navigate(Routing.expensesDatesComparationGraphScreen)} title="Comparación por fechas" icon="chart-multiple" />
            </SafeAreaView >
        );
    }
}






const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default connect(null, null)(ExpensesGraphsMenuScreen);
