
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text, ActivityIndicator, ScrollView } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetIncomesByYear, clearGraphData } from '../../../modules/Graph/GraphActions';
import { apiGetCategoriesByType } from '../../../modules/Category/CategoryActions'

import { Months, Years } from '../constants';

import { Dropdown } from 'react-native-element-dropdown';
import { Inputs } from '../../../assets/styles/Inputs';
import * as Color from '../../../assets/styles/Colors'
import { Style } from '../../../assets/styles/Style';
import { LineChart } from "react-native-chart-kit";
import { fillAllMonths } from '../../../services/api/Helpers';
import { findMaxValue, findMinValue } from '../Helpers';

class IncomesByCategoryAndYearGraphScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            year: new Date().getFullYear(),
            category: "Saldo inicial",
            monthOne: '',
            monthTwo: '',
            amountOne: 0,
            amountTwo: 0,
        }
    }

    componentDidMount() { this._getData() }

    _handleChange(name, value)
    {
        this.setState({ [name]: value }, () =>
        { this._getData(); })
    }

    _getData()
    {
        const { year, category } = this.state
        this.props.apiGetIncomesByYear(year, category)
        this.props.apiGetCategoriesByType('Incomes')
    }

    componentWillUnmount()
    {
        this.props.clearGraphData()
    }

    setGraphData()
    {
        const incomes = fillAllMonths(this.props.incomes)
        let monthOne = '', monthTwo = ''
        let amountOne = 0, amountTwo = Infinity
        console.log(amountTwo)
        const data = {
            labels: [],
            datasets: [
                {
                    data: [],
                    color: (opacity = 1) => `rgba(132, 195, 168, ${opacity})`,
                    strokeWidth: 2
                }
            ],
            legend: [this.state.category]
        };

        incomes?.forEach(income =>
        {
            ({ monthOne, amountOne } = updateMaxTotal(income, amountOne, monthOne));
            ({ monthTwo, amountTwo } = updateMinTotal(income, amountTwo, monthTwo));
            console.log(updateMinTotal(income, amountTwo, monthTwo))
            data.labels.push(Months[income.month - 1]?.name.slice(0, 3))
            data.datasets[0].data.push(income.total)
        })
        return { data, monthOne, monthTwo, amountOne, amountTwo }
    }

    render()
    {
        const { categories, isLoadingIncomes, isLoadingCategories, incomes } = this.props;
        const { year, category } = this.state;
        let data = []
        let monthOne, monthTwo, amountOne, amountTwo = ''
        if (!this.props.isLoadingIncomes) ({ data, monthOne, monthTwo, amountOne, amountTwo } = this.setGraphData());
        const chartWidth = Style.DEVICE_WIDTH * 1.5

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeader} blurRadius={40}>
                    {isLoadingIncomes || isLoadingCategories ? <ActivityIndicator /> : null}
                    <View style={styles.dropdownContainer}>
                        <Dropdown
                            style={Inputs.middleDropdown}
                            data={categories}
                            value={category}
                            labelField="name"
                            valueField="name"
                            maxHeight={300}
                            placeholder="Seleccionar categoría..."
                            onChange={(item) => this._handleChange('category', item?.name)}
                        />
                        <Dropdown
                            style={Inputs.middleDropdown}
                            data={Years}
                            value={year}
                            labelField="name"
                            valueField="value"
                            maxHeight={300}
                            placeholder="Seleccionar año..."
                            onChange={(item) => this._handleChange('year', item.value)}
                        />
                    </View>
                </ImageBackground>
                <ScrollView style={Views.container} contentContainerStyle={{ justifyContent: 'center' }}>
                    {isLoadingIncomes ? <ActivityIndicator /> : null}
                    {incomes?.length == 0 || !data || data.length == 0 ?
                        <Text>No existen ingresos</Text> :
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{ width: Style.DEVICE_NINETY_FIVE_PERCENT_WIDTH, backgroundColor: Color.white, marginBottom: 10, borderRadius: 20, padding: 20, marginTop: 10, justifyContent: 'center', alignContent: 'center' }}>
                                <Text style={{ color: Color.firstText, fontSize: Style.fontSize, fontFamily: Style.fontFamily, textAlign: 'center' }}>"¡{monthOne} fue intenso en ingresos para la categoría {category}! Registraste un total de {amountOne}€.</Text>{amountTwo > 0 && <Text style={{ color: Color.firstText, fontSize: Style.fontSize, fontFamily: Style.fontFamily, textAlign: 'center' }}> Por otro lado, ¡encontramos una buena noticia! En el mes {monthTwo} lograste ahorrar {amountTwo}€ en esta categoría. ¡Excelente trabajo !"</Text>}
                            </View>
                            <ScrollView style={Views.verticalGraphScrollView} >
                                <ScrollView horizontal={true} contentContainerStyle={{ alignItems: 'center' }}>
                                    <LineChart
                                        data={data}
                                        width={chartWidth}
                                        height={350}
                                        yAxisLabel="€"
                                        verticalLabelRotation={-20}
                                        style={{
                                            borderRadius: 16,
                                        }}
                                        chartConfig={{
                                            backgroundColor: Color.white,
                                            backgroundGradientFrom: Color.white,
                                            backgroundGradientTo: Color.white,
                                            decimalPlaces: 2,
                                            color: (opacity = 1) => Color.firstText,
                                            labelColor: (opacity = 1) => Color.firstText,

                                            propsForDots: {
                                                r: "6",
                                                strokeWidth: "1",
                                                stroke: Color.button
                                            }
                                        }}
                                        bezier
                                    />
                                </ScrollView></ScrollView>
                        </View>
                    }
                </ScrollView>

            </SafeAreaView >
        );
    }
}

const updateMaxTotal = (income, amountOne, monthOne) =>
{
    if (income.total > amountOne)
    {
        monthOne = Months[income.month - 1]?.name;
        amountOne = income.total;
    }
    return { monthOne, amountOne }
};

// Función para actualizar el mínimo
const updateMinTotal = (income, amountTwo, monthTwo) =>
{
    console.log(income.total < amountTwo)
    if (income.total < amountTwo && income.total != 0)
    {
        monthTwo = Months[income.month - 1]?.name;
        amountTwo = income.total;
    }
    return { monthTwo, amountTwo }
};


const mapStateToProps = ({ GraphReducer, CategoryReducer }) =>
{

    const { incomes, isLoadingIncomes } = GraphReducer;
    const { categories, isLoadingCategories } = CategoryReducer;

    return { incomes, isLoadingIncomes, categories, isLoadingCategories };

};

const mapStateToPropsAction = {
    apiGetIncomesByYear,
    apiGetCategoriesByType,
    clearGraphData
};


const styles = StyleSheet.create({

    dropdownContainer: { width: "100%", flexDirection: 'row', justifyContent: "space-between" }
});

export default connect(mapStateToProps, mapStateToPropsAction)(IncomesByCategoryAndYearGraphScreen);
