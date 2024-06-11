
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, View, ActivityIndicator, Text, StyleSheet, ScrollView } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetIncomesByCategoryAndDate, clearGraphData, } from '../../../modules/Graph/GraphActions';

import { BarChart } from "react-native-chart-kit";
import * as Color from '../../../assets/styles/Colors'
import * as RootRouting from '../../../navigation/RootRouting'
import Routing from '../../../navigation/Routing';
import { toTwoDecimals } from '../../../services/api/Helpers';
import DateSelectorModal from '../../../components/Modals/DateSelectorModal';
import { Style } from '../../../assets/styles/Style';

class IncomesPerMonthsGraphScreen extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            prevMonthIncomes: [],
            incomes: [],
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
        this.props.apiGetIncomesByCategoryAndDate(month - 1, year)
            .then(() =>
            {
                const prevMonthIncomes = this.props.incomes;
                this.setState({ prevMonthIncomes }, () =>
                {
                    this.props.apiGetIncomesByCategoryAndDate(month, year)
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

        const incomes = Array.isArray(this.props.incomes) ? [...this.props.incomes] : undefined;
        const data = {
            labels: [],
            datasets: [
                { data: [] }
            ]
        }
        incomes?.forEach((income) =>
        {
            data.labels.push(income.category)
            data.datasets[0].data.push(income.total)
        })
        return data
    }

    summaryInfo()
    {
        const { month, year, prevMonthIncomes } = this.state
        const { incomes } = this.props
        let prevAmount = 0, amount = 0

        prevMonthIncomes?.forEach((income) => { prevAmount += income.total })
        incomes?.forEach((income) => { amount += income.total })

        const saving = amount < prevAmount ? true : false

        return (
            this.props.isLoadingIncomes ? <ActivityIndicator /> :
                <View style={{ width: Style.DEVICE_NINETY_FIVE_PERCENT_WIDTH, marginBottom: 10, alignSelf: 'center' }}>
                    <View style={Views.squareBackground}>
                        <Text style={styles.summaryText}>
                            En comparación al mes anterior, {saving ? 'has incrementado tus ingresos' : 'tus ingresos han disnminuido'}
                            <Text style={[
                                saving ? styles.summaryTextButton : styles.summaryTextRed,
                            ]}>
                                {` ${saving ?
                                    toTwoDecimals(prevAmount - amount).replace('.', ',')
                                    : toTwoDecimals(amount - prevAmount).replace('.', ',')}€ \n`}
                            </Text>
                            Si quieres ver la comparación con el mes anterior pincha
                            <Text style={{ fontWeight: 'bold' }}
                                onPress={() =>
                                {
                                    RootRouting.navigate(Routing.incomesDatesComparationGraphScreen, { month, year })
                                }}> aquí
                            </Text>
                        </Text>
                    </View>
                </View>
        )
    }

    render()
    {
        const { isLoadingIncomes, incomes } = this.props;
        const { year, month, modal } = this.state;
        let data = this.setGraphData()
        const barChartWidth = Style.DEVICE_WIDTH * 1.5 * data.labels.length / 8
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

                <ScrollView  >
                    {isLoadingIncomes ? <ActivityIndicator /> : null}

                    {incomes?.length == 0 ?
                        <Text>No existen ingresos</Text> :
                        <ScrollView style={Views.verticalGraphScrollView} >
                            {this.summaryInfo()}
                            <ScrollView horizontal={true} contentContainerStyle={{ alignItems: 'center' }}
                                style={Views.horizontalGraphScrollView}>
                                <BarChart
                                    data={data}
                                    width={Style.DEVICE_WIDTH}
                                    height={350}
                                    yAxisLabel="€"

                                    style={{
                                        borderRadius: 20,
                                        padding: 10,
                                    }}
                                    chartConfig={{
                                        backgroundColor: Color.white,
                                        backgroundGradientFrom: Color.white,
                                        backgroundGradientTo: Color.white,
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => Color.button,
                                        labelColor: (opacity = 1) => Color.firstText,
                                        barRadius: 10,
                                        propsForDots: {
                                            r: "6",
                                            strokeWidth: "2",
                                            stroke: Color.button
                                        }
                                    }}
                                    verticalLabelRotation={0}
                                />
                            </ScrollView>
                        </ScrollView>


                    }
                </ScrollView>
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    summaryText: {
        fontSize: 14,
        color: Color.firstText,
        lineHeight: 30,
        textAlign: 'center',
        padding: 10
    },
    summaryTextRed: {
        fontSize: 14,
        lineHeight: 24,
        color: "red",

    },
    summaryTextButton: {
        fontSize: 14,
        lineHeight: 30,
        color: "#6AA58C",
    },
});


const mapStateToProps = ({ GraphReducer }) =>
{
    const { incomes, isLoadingIncomes } = GraphReducer;

    return { incomes, isLoadingIncomes };

};

const mapStateToPropsAction = {
    apiGetIncomesByCategoryAndDate,
    clearGraphData
};



export default connect(mapStateToProps, mapStateToPropsAction)(IncomesPerMonthsGraphScreen);
