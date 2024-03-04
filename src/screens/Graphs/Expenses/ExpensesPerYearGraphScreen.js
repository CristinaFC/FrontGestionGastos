
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, View, ActivityIndicator, Text } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { clearGraphData, apiGetExpensesGroupedByCategory } from '../../../modules/Graph/GraphActions';
import { Dropdown as DropdownStyle } from '../../../assets/styles/Dropdown';
import { LineChart, PieChart } from "react-native-chart-kit";
import * as Color from '../../../assets/styles/Colors'
import { Months, Years } from '../constants';
import { Dropdown } from 'react-native-element-dropdown';
import { Texts } from '../../../assets/styles/Texts';
import { Style } from '../../../assets/styles/Style';
import { generateColors } from '../Helpers';

class ExpensesPerYearGraphScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.props.clearGraphData()

        this.state = {
            year: new Date().getFullYear(),
            prevMonthExpenses: [],
            expenses: [],
            modal: false,
            pieData: []
        }
    }

    async componentDidMount() { await this._getExpenses() }

    async _handleChange(name, value)
    {
        this.setState({ [name]: value })
    }

    componentWillUnmount() { this.props.clearGraphData() }

    async _getExpenses()
    {
        await this.props.apiGetExpensesGroupedByCategory(this.state.year)
    }

    summaryInfo()
    {

    }

    fillMissingMonths()
    {
        let data = JSON.parse(JSON.stringify(this.props.expenses));
        data.forEach(category =>
        {
            const existingMonths = new Set(category.months.map(month => month.month));

            Months.forEach((month, index) =>
            {
                if (!existingMonths.has(month.value))
                {
                    category.months.push({
                        month: month.value,
                        total: 0
                    });
                }
            });
            category.months.sort((a, b) => a.month - b.month);
        });

        return data
    }

    setGraphData()
    {
        const category = this.fillMissingMonths()
        const chartsData = []
        const data = {
            labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            datasets: [],
            legend: [],
        }
        const pieData = [];
        let total
        const colors = generateColors(category.length)
        category.forEach((categoryItem, index) =>
        {
            total = 0
            const dataset = {
                data: [],
                color: () => colors[index],
            };

            categoryItem.months.forEach((monthItem) =>
            {
                total += monthItem.total
                dataset.data.push(monthItem.total);
            });

            data.datasets.push(dataset);
            data.legend.push(categoryItem._id);
            pieData.push({
                name: categoryItem._id,
                amount: total,
                color: colors[index],
                legendFontColor: Color.firstText,
                legendFontSize: 12
            })
        });
        chartsData.push(data)
        chartsData.push(pieData)
        return chartsData
    }
    render()
    {
        const { isLoadingExpenses } = this.props;
        const { year } = this.state;


        const data = this.setGraphData()
        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeader} blurRadius={40}>
                    <Text style={[Texts.titleText, { marginLeft: 5, color: Color.white }]}>Año</Text>
                    <Dropdown
                        style={{ width: "100%", borderWidth: 1, borderColor: Color.white, paddingHorizontal: 10, borderRadius: 10 }}
                        selectedTextStyle={DropdownStyle.selectedTextStyle}
                        placeholderStyle={DropdownStyle.placeholderStyle}
                        iconColor={Color.white}
                        data={Years}
                        value={year}
                        labelField="name"
                        valueField="value"
                        maxHeight={300}
                        placeholder="Seleccionar año..."
                        onChange={async ({ value }) => { await this._handleChange("year", value); await this._getExpenses() }}
                    />
                </ImageBackground>

                <View style={Views.container}>
                    {isLoadingExpenses ? <ActivityIndicator /> : null}
                    {this.props.expenses.length == 0 ? <Text>No existen gastos</Text> :
                        <>
                            <LineChart
                                bezier
                                withHorizontalLabels={true}
                                withVerticalLabels={true}
                                data={data[0]}
                                width={Style.DEVICE_WIDTH}
                                height={350}
                                yAxisLabel="€"
                                chartConfig={{
                                    backgroundColor: Color.firstText,
                                    backgroundGradientFrom: Color.white,
                                    backgroundGradientTo: Color.white,
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                    }
                                }}
                            />
                            <PieChart
                                data={data[1]}
                                width={Style.DEVICE_WIDTH}
                                height={300}
                                style={{
                                    alignSelf: 'center', marginTop: 10
                                }}
                                chartConfig={{
                                    backgroundColor: '#1cc910',
                                    backgroundGradientFrom: '#eff3ff',
                                    backgroundGradientTo: '#efefef',
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                }}
                                paddingLeft={"15"}
                                accessor={"amount"}
                                backgroundColor='transparent'
                                center={[20, 10]}
                            />
                        </>
                    }
                </View>
            </SafeAreaView >
        );
    }
}

const mapStateToProps = ({ GraphReducer }) =>
{
    const { expenses, isLoadingExpenses } = GraphReducer;

    return { expenses, isLoadingExpenses };

};

const mapStateToPropsAction = {
    apiGetExpensesGroupedByCategory,
    clearGraphData
};



export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesPerYearGraphScreen);
