
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, View, ActivityIndicator, Text, ScrollView, StyleSheet } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { clearGraphData, apiGetIncomesGroupedByCategory } from '../../../modules/Graph/GraphActions';
import { Dropdown as DropdownStyle } from '../../../assets/styles/Dropdown';
import { LineChart, PieChart } from "react-native-chart-kit";
import * as Color from '../../../assets/styles/Colors'
import { Months, Years } from '../constants';
import { Dropdown } from 'react-native-element-dropdown';
import { Texts } from '../../../assets/styles/Texts';
import { Style } from '../../../assets/styles/Style';
import { generateColors } from '../Helpers';

class IncomesPerYearGraphScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.props.clearGraphData()

        this.state = {
            year: new Date().getFullYear(),
            category: '',
            prevMonthIncomes: [],
            incomes: [],
            modal: false,
            pieData: [],
        }
    }

    async componentDidMount() { await this._getIncomes() }

    async _handleChange(name, value)
    {
        this.setState({ [name]: value })
    }

    componentWillUnmount() { this.props.clearGraphData() }

    async _getIncomes()
    {
        await this.props.apiGetIncomesGroupedByCategory(this.state.year)
        this.setState({ data: this.setGraphData() })
    }

    fillMissingMonths()
    {
        let data = JSON.parse(JSON.stringify(this.props.incomes));
        data?.forEach(category =>
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
        const { isLoadingIncomes } = this.props;
        const { year } = this.state;

        const data = this.setGraphData()
        const lineChartWidth = Style.DEVICE_WIDTH * 1.5 * data[0].labels.length / 10
        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeaderWithFilters} blurRadius={40}>
                    <Text style={[Texts.titleText, { marginLeft: 5, color: Color.white }]}>Año</Text>
                    <Dropdown
                        style={{ width: "100%", borderWidth: 1, borderColor: Color.white, paddingHorizontal: 10, borderRadius: 10 }}
                        selectedTextStyle={[DropdownStyle.selectedTextStyle, { color: Color.white }]}
                        placeholderStyle={DropdownStyle.placeholderStyle}
                        iconColor={Color.white}
                        data={Years}
                        value={year}
                        labelField="name"
                        valueField="value"
                        maxHeight={300}
                        placeholder="Seleccionar año..."
                        onChange={async ({ value }) => { await this._handleChange("year", value); await this._getIncomes() }}
                    />
                </ImageBackground>

                {isLoadingIncomes ? <ActivityIndicator /> : null}
                {this.props.incomes.length == 0 ? <Text>No existen ingresos</Text> :

                    <ScrollView style={Views.container}>
                        <ScrollView style={Views.verticalGraphScrollView} >
                            <ScrollView horizontal={true} contentContainerStyle={{ alignItems: 'center' }}
                                style={Views.horizontalGraphScrollView}>
                                <LineChart
                                    bezier
                                    withHorizontalLabels={true}
                                    withVerticalLabels={true}
                                    data={data[0]}
                                    width={lineChartWidth}
                                    height={350}
                                    yAxisLabel="€"
                                    style={{
                                        borderRadius: 20,
                                        padding: 10,
                                    }}
                                    chartConfig={{
                                        backgroundColor: Color.firstText,
                                        backgroundGradientFrom: Color.white,
                                        backgroundGradientTo: Color.white,
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

                                        propsForDots: {
                                            r: "6",
                                            strokeWidth: "2",
                                        }
                                    }}
                                />

                            </ScrollView></ScrollView>
                        <View style={styles.pierChartContainer}>

                            <PieChart
                                data={data[1]}
                                width={Style.DEVICE_NINETY_FIVE_PERCENT_WIDTH}
                                height={300}
                                style={{
                                    borderRadius: 20,
                                }}
                                chartConfig={{
                                    backgroundColor: Color.white,
                                    backgroundGradientFrom: Color.white,
                                    backgroundGradientTo: Color.white,
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                }}
                                paddingLeft={"30"}
                                accessor={"amount"}
                                backgroundColor={Color.white}
                                center={[10, 10]}
                            />
                        </View>
                    </ScrollView>
                }
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    pierChartContainer: {
        borderRadius: 20,
        width: Style.DEVICE_NINETY_FIVE_PERCENT_WIDTH,
        alignSelf: 'center',
        marginBottom: 10
    }
})

const mapStateToProps = ({ GraphReducer }) =>
{
    const { incomes, isLoadingIncomes } = GraphReducer;

    return { incomes, isLoadingIncomes };

};

const mapStateToPropsAction = {
    apiGetIncomesGroupedByCategory,
    clearGraphData
};



export default connect(mapStateToProps, mapStateToPropsAction)(IncomesPerYearGraphScreen);
