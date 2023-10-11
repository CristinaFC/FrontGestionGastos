
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesByCategoryAndDate, apiGetExpensesByYear, clearGraphData } from '../../../modules/Graph/GraphActions';

import { BarChart, Grid, XAxis } from 'react-native-svg-charts'

import * as Color from '../../../assets/styles/Colors';
import DateDropDown from '../../../components/DateDropDown';
import * as scale from 'd3-scale'
import { Text as SvgText } from 'react-native-svg'

class ExpensesByCategoryAndDateGraphScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.props.clearGraphData()

        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth()
        }
    }

    componentDidMount() { this._getData() }

    _handleChange(name, value)
    {
        this.setState({ [name]: value }, () =>
        {
            this._getData();
        })
    }

    _getData()
    {
        const { year, month } = this.state
        this.props.apiGetExpensesByCategoryAndDate(month, year);
    }

    render()
    {
        const { expenses, isLoadingExpenses } = this.props;
        const { year, month } = this.state;

        const contentInset = { top: 30, bottom: 10 }

        const CUT_OFF = 20
        const values = []

        expenses.forEach((exp) => { values.push(exp.total) })

        const Labels = ({ x, y, bandwidth, data }) => (
            values.map((value, index) => (
                <SvgText
                    key={index}
                    x={x(index) + (bandwidth / 2)}
                    y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
                    fontSize={14}
                    fill={value >= CUT_OFF ? 'white' : 'black'}
                    alignmentBaseline={'middle'}
                    textAnchor={'middle'}
                >
                    {value}
                </SvgText>
            ))
        )

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
                        {isLoadingExpenses ? <ActivityIndicator /> : null}
                        <DateDropDown
                            month={month}
                            year={year}
                            onChangeMonth={(item) => this._handleChange('month', item.value)}
                            onChangeYear={(item) => this._handleChange('year', item.value)} />

                        {expenses?.length == 0 ?
                            <Text>No existen gastos</Text> :
                            <View style={Views.squareBackground}>
                                <View style={{ height: 300, paddingHorizontal: 10, flexDirection: 'row', width: '90%' }}>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <BarChart
                                            style={{ flex: 1 }}
                                            data={expenses}
                                            svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                                            yAccessor={({ item }) => item.total}
                                            spacing={0.2}
                                            gridMin={0}
                                            contentInset={contentInset}
                                        >
                                            <Grid direction={Grid.Direction.HORIZONTAL} />
                                            <Labels />
                                        </BarChart>
                                        <XAxis
                                            style={{ marginTop: 10 }}
                                            data={expenses}
                                            scale={scale.scaleBand}
                                            formatLabel={(value, index) => expenses[index].category}
                                            contentInset={{ left: 10, right: 10 }}
                                            labelStyle={{ color: 'black' }}
                                        />
                                    </View>
                                </View>
                            </View>
                        }
                    </View>
                </ImageBackground>
            </SafeAreaView >
        );
    }
}





const mapStateToProps = ({ GraphReducer }) =>
{
    const { errors, expenses, isLoadingExpenses } = GraphReducer;

    return { errors, expenses, isLoadingExpenses };

};

const mapStateToPropsAction = {
    apiGetExpensesByCategoryAndDate,
    apiGetExpensesByYear,
    clearGraphData
};



export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesByCategoryAndDateGraphScreen);
