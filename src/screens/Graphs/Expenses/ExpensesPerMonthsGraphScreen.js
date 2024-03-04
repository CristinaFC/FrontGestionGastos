
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesByCategoryAndDate, clearGraphData } from '../../../modules/Graph/GraphActions';

import { BarChart } from "react-native-chart-kit";
import * as Color from '../../../assets/styles/Colors'
import * as RootRouting from '../../../navigation/RootRouting'
import Routing from '../../../navigation/Routing';
import { toTwoDecimals } from '../../../services/api/Helpers';
import DateSelectorModal from '../../../components/Modals/DateSelectorModal';
import { Style } from '../../../assets/styles/Style';

class ExpensesPerMonthsGraphScreen extends Component
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
            modal: false,
        }
    }

    componentDidMount() { this._getData() }

    _handleChange(name, value)
    {
        this.setState({ [name]: value })
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
                });

            })
            .catch(error =>
            {
                console.error(error);
            });
        this.setState({ modal: false });
    }

    setGraphData()
    {
        const data = {
            labels: [],
            datasets: [
                { data: [] }
            ]
        }
        this.props.expenses.forEach((expense) =>
        {
            data.labels.push(expense.category)
            data.datasets[0].data.push(expense.total)
        })
        return data
    }

    summaryInfo()
    {
        const { month, year, prevMonthExpenses } = this.state
        const { expenses } = this.props
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
        const { isLoadingExpenses, expenses } = this.props;
        const { year, month, modal } = this.state;
        const data = this.setGraphData()

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeader} blurRadius={40}>
                    <DateSelectorModal
                        modal={modal}
                        onOpenModal={() => this.setState({ modal: !modal })}
                        onClose={() => this.setState({ modal: false })}
                        month={month}
                        year={year}
                        onChangeMonth={(item) => this._handleChange('month', item.value)}
                        onChangeYear={(item) => this._handleChange('year', item.value)}
                        onSubmit={() => this._getData()} />
                </ImageBackground>

                <View style={Views.graphContainer}>
                    {isLoadingExpenses ? <ActivityIndicator /> : null}

                    {expenses?.length == 0 ?
                        <Text>No existen gastos</Text> :
                        <>
                            <BarChart
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                }}
                                data={data}
                                width={Style.DEVICE_NINETY_FIVE_PERCENT_WIDTH}
                                height={380}
                                yAxisLabel="€"
                                chartConfig={{
                                    backgroundColor: "#e26a00",
                                    backgroundGradientFrom: "#fb8c00",
                                    backgroundGradientTo: "#ffa726",
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                        stroke: "#ffa726"
                                    }
                                }}
                                verticalLabelRotation={0}
                            />

                            {this.summaryInfo()}

                        </>
                    }
                </View>
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
    const { expenses, isLoadingExpenses } = GraphReducer;

    return { expenses, isLoadingExpenses };

};

const mapStateToPropsAction = {
    apiGetExpensesByCategoryAndDate,
    clearGraphData
};



export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesPerMonthsGraphScreen);
