
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesByCategoryAndDate, apiGetExpensesByYear, clearGraphData } from '../../../modules/Graph/GraphActions';

import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'

import DateDropDown from '../../../components/DateDropDown';
import * as scale from 'd3-scale'
import YAXISBarChart from '../../../components/YAXISBarChart';
import * as Color from '../../../assets/styles/Colors'
import * as RootRouting from '../../../navigation/RootRouting'
import Routing from '../../../navigation/Routing';
import { toTwoDecimals } from '../../../services/api/Helpers';

class ExpensesByCategoryAndDateGraphScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.props.clearGraphData()

        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            prevMonthExpenses: [],
            expenses: [],
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

    componentWillUnmount() { this.props.clearGraphData() }


    _getData()
    {
        const { year, month } = this.state
        this.props.apiGetExpensesByCategoryAndDate(month - 1, year)
            .then(() =>
            {
                const prevMonthExpenses = this.props.expenses;
                this.setState({ prevMonthExpenses }, () =>
                {
                    this.props.apiGetExpensesByCategoryAndDate(month, year)
                        .then(() =>
                        {
                            this.setState({ expenses: this.props.expenses });
                        })
                        .catch(error =>
                        {
                            console.error(error);
                        });
                });

            })
            .catch(error =>
            {
                console.error(error);
            });

    }

    summaryInfo()
    {
        const { expenses, month, year, prevMonthExpenses } = this.state
        let prevAmount = 0, amount = 0

        prevMonthExpenses?.forEach((expense) => { prevAmount += expense.total })
        expenses?.forEach((expense) => { amount += expense.total })

        const saving = amount < prevAmount ? true : false

        return (
            this.props.isLoadingExpenses ? <ActivityIndicator /> :
                <View style={{ width: "90%", marginTop: 20 }}>
                    <View style={Views.squareBackground}>
                        <Text style={styles.summaryText}>
                            En comparación al mes anterior, {saving ? 'has ahorrado' : 'tus gastos se han incrementado en'}
                            <Text style={[
                                saving ? styles.summaryTextButton : styles.summaryTextRed,
                            ]}>
                                {` ${saving ?
                                    toTwoDecimals(prevAmount - amount).replace('.', ',')
                                    : toTwoDecimals(amount - prevAmount).replace('.', ',')}€ \n`}
                            </Text>
                            Si quieres ver la comparación con el mes anterior pincha
                            <Text style={{ fontWeight: 'bold' }}
                                onPress={() => RootRouting.navigate(Routing.expensesDatesComparationGraphScreen, { month, year })}> aquí
                            </Text>
                        </Text>
                    </View>
                </View>
        )
    }

    render()
    {
        const { isLoadingExpenses } = this.props;
        const { year, month, expenses } = this.state;


        const contentInset = { top: 10, bottom: 0 }
        const xAxisHeight = 30

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
                            <>
                                <View style={Views.squareBackground}>
                                    <View style={Views.graphContainer}>
                                        <YAxis
                                            data={expenses}
                                            contentInset={contentInset}
                                            svg={{ fill: 'black', fontSize: 11 }}
                                            style={{ marginBottom: xAxisHeight }}
                                            yAccessor={({ item }) => item.total}
                                            formatLabel={(value) => `${value}€`}
                                            min={expenses.length === 1 && expenses[0].total < 2 ? 0.01 : 0.1}
                                            numberOfTicks={5}
                                        />
                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                            <BarChart
                                                style={{ flex: 1 }}
                                                data={expenses}
                                                svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                                                yAccessor={({ item }) => item.total}
                                                contentInset={contentInset}
                                                gridMin={0}
                                                numberOfTicks={5}
                                            >
                                                <Grid direction={Grid.Direction.HORIZONTAL} />
                                                <YAXISBarChart cutoff={1} />
                                            </BarChart>
                                            <XAxis
                                                style={{ height: 30 }}
                                                svg={{
                                                    fill: 'black',
                                                    fontSize: 12,
                                                    rotation: -30,
                                                    originY: 15,
                                                    y: 10,
                                                }}
                                                data={expenses}
                                                formatLabel={(value, index) => expenses[index].category.slice(0, 5)}
                                                contentInset={{ left: 15, right: 15 }}
                                            />
                                        </View>
                                    </View>
                                </View>
                                {this.summaryInfo()}

                            </>

                        }
                    </View>
                </ImageBackground>
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    summaryText: {
        fontSize: 18,
        color: Color.firstText,
        lineHeight: 30,
        textAlign: 'center',
        padding: 10
    },
    summaryTextRed: {
        fontSize: 24,
        lineHeight: 24,
        color: "red",

    },
    summaryTextButton: {
        fontSize: 22,
        lineHeight: 30,
        color: "#6AA58C",
    },
});


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
