
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { connect } from 'react-redux';

import { MenuButton } from '../../../components/MenuButton';
import Routing from '../../../navigation/Routing';
import { localAssets } from '../../../assets/images/assets';


import * as RootRouting from '../../../navigation/RootRouting'

class ExpensesGraphsMenuScreen extends Component
{

    constructor(props) { super(props); }
    render()
    {
        return (
            <SafeAreaView style={[Views.container]}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <View style={{ width: "100%", height: "10%", alignItems: "center", flexDirection: 'column', marginTop: 30 }}>
                        <MenuButton title="Gastos mensuales" onPress={() => RootRouting.navigate(Routing.expensesPerMonthsGraphScreen)} />
                    </View>
                    <View style={{ width: "100%", height: "10%", alignItems: "center", flexDirection: 'column' }}>
                        <MenuButton title="Gastos anuales" onPress={() => RootRouting.navigate(Routing.expensesPerYearGraphScreen)} />
                    </View>
                    <View style={{ width: "100%", height: "10%", alignItems: "center", flexDirection: 'column' }}>
                        <MenuButton title="Categoría por año" onPress={() => RootRouting.navigate(Routing.expensesByCategoryAndYearGraphScreen)} />
                    </View>
                    <View style={{ width: "100%", height: "10%", alignItems: "center", flexDirection: 'column' }}>
                        <MenuButton title="Método de pago" onPress={() => RootRouting.navigate(Routing.expensesByAccountGraphScreen)} />
                    </View>

                    <View style={{ width: "100%", height: "10%", alignItems: "center", flexDirection: 'column' }}>
                        <MenuButton title="Comparación por fechas" onPress={() => RootRouting.navigate(Routing.expensesDatesComparationGraphScreen)} />
                    </View>

                </ImageBackground>
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
