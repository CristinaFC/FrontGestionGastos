
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text, ActivityIndicator, ScrollView } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesDateComparation, clearGraphData } from '../../../modules/Graph/GraphActions';
import { LineChart, } from "react-native-chart-kit";

import { Months } from '../constants';
import * as Color from '../../../assets/styles/Colors';
import { generateColors } from '../Helpers';
import { toTwoDecimals } from '../../../services/api/Helpers';
import DateSelectorModal from '../../../components/Modals/DateSelectorModal';
import { Texts } from '../../../assets/styles/Texts';
import { Style } from '../../../assets/styles/Style';


class ExpensesDatesComparationGraphScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.month = props.route.params?.month;
        this.year = props.route.params?.year;
        this.state = {
            year: this.year ? this.year : new Date().getFullYear(),
            yearTwo: this.year ? this.year : new Date().getFullYear(),
            month: this.month ? this.month - 1 : new Date().getMonth(),
            monthTwo: this.month ? this.month : new Date().getMonth() + 1,
            modal: false,
            modalTwo: false,
            data1: [],
            data2: [],
            data: []
        }

    }

    componentDidMount()
    {
        this._getData();
    }

    _handleChange(name, value)
    {
        this.setState({ [name]: value })
    }

    async _getData()
    {
        try
        {
            await this.props.clearGraphData();

            const { year, yearTwo, month, monthTwo } = this.state;
            await this.props.apiGetExpensesDateComparation(year, yearTwo, month, monthTwo);

            const allCategories = this._getAllCategories();
            const { dataOne, dataTwo } = this.props.expenses

            const data1 = Array.isArray(dataOne) ? [...dataOne] : undefined;
            const data2 = Array.isArray(dataTwo) ? [...dataTwo] : undefined;

            this._fillEmptyCategories(allCategories, data1);
            this._fillEmptyCategories(allCategories, data2);

            this._sortAlpha(data1);
            this._sortAlpha(data2);
            this.setState({ modal: false, modalTwo: false, data1, data2 })
        } catch (error)
        {
            console.error(error);
        }

    }
    componentWillUnmount()
    {
        this.props.clearGraphData()
    }

    _getAllCategories()
    {
        const allCategories = []
        const { expenses = {} } = this.props

        for (const key in expenses)
            expenses[key]?.forEach(item => allCategories.push(item.category));
        return allCategories
    }

    _fillEmptyCategories(allCategories, data)
    {
        allCategories?.forEach((category) =>
        {
            if (!data?.some(obj => obj.category === category)) data?.push({ category: category, total: 0 })
        })
    }

    _sortAlpha(data)
    {
        data?.sort((a, b) =>
        {
            if (a.category > b.category) return 1;
            if (a.category < b.category) return -1;
            return 0;
        })
    }


    renderSummary(data)
    {
        const data1 = data[0]
        const data2 = data[1]

        return (
            <View style={styles.summaryContainer}>
                <View style={styles.summaryHeaderContainer}>
                    <Text style={styles.summaryTitle}>Categoría</Text>
                    <Text style={styles.summaryTitle}>{`${Months[data1.date.getMonth()].name} ${data1.date.getFullYear()}`}</Text>
                    <Text style={styles.summaryTitle}>{`${Months[data2.date.getMonth()].name} ${data2.date.getFullYear()}`}</Text>
                </View>
                <ScrollView style={styles.summaryBody}>
                    {this.renderSummaryContent(data)}
                </ScrollView>
            </View>
        )
    }

    renderSummaryContent(data)
    {
        const { data: data1 } = data[0]
        const { data: data2 } = data[1]

        if (data1?.length > 0)
        {
            return (
                data1.map((_, index) => (
                    <View key={index} style={{ width: "100%", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'black', fontSize: 14, flex: 0.3, textAlign: 'left', marginLeft: 20 }}>
                            {data1[index].category.slice(0, 8)}</Text>
                        <Text style={{ color: 'black', fontSize: 14, flex: 0.3, textAlign: 'center', lineHeight: 30 }}>
                            {toTwoDecimals(data1[index].total).replace('.', ',')}</Text>
                        <Text style={{ color: 'black', fontSize: 14, flex: 0.3, textAlign: 'center' }}>
                            {toTwoDecimals(data2[index]?.total).replace('.', ',')}</Text>
                    </ View>

                ))
            );
        } else return null;
    }

    setGraphData()
    {
        let data = {
            labels: [],
            datasets: [],
            legend: [`${this.state.month} ${this.state.year}`,
            `${this.state.monthTwo} ${this.state.yearTwo}`],
        }
        const colors = generateColors(2)
        data = this.formattData(this.state.data1, data, colors[0])
        data = this.formattData(this.state.data2, data, colors[1])
        return data
    }

    formattData(expenses, data, color)
    {
        const formattedData = { ...data }
        const dataset = {
            data: [],
            color: () => color,
        };

        expenses?.forEach((expense) =>
        {
            dataset.data?.push(expense.total)
            if (formattedData?.datasets?.length == 0)
                formattedData?.labels?.push(expense.category);
        });
        formattedData.datasets.push(dataset)
        return formattedData
    }

    render()
    {
        const { isLoadingExpenses } = this.props;
        const { month, year, monthTwo, yearTwo, data1, data2, modal, modalTwo, } = this.state;
        let data = this.setGraphData()
        const barChartWidth = Style.DEVICE_WIDTH * 1.5 * data.labels.length / 8
        const chartWidth = Style.DEVICE_WIDTH * 1.5 * data.labels.length / 8
        const summaryData = [
            {
                data: data1,
                svg: {
                    fill: Color.button,
                    stroke: 'black'

                },
                date: new Date(year, month - 1, 1)
            },
            {
                data: data2,
                svg: {
                    fill: Color.orange,
                    stroke: 'black'
                },
                date: new Date(yearTwo, monthTwo - 1, 1)
            },
        ]
        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeader} blurRadius={40}>
                    <View style={{ width: "100%", flexDirection: 'row' }}>
                        <View style={{ alignItems: 'center', width: "50%", flexDirection: 'column', borderRightWidth: 2, borderColor: Color.white }}>
                            <Text style={[Texts.titleText, { textDecorationLine: 'underline' }]}>Fecha 1</Text>
                            <DateSelectorModal
                                modal={modal}
                                onOpenModal={() => this.setState({ modal: !modal })}
                                onClose={() => this.setState({ modal: false })}
                                month={month}
                                year={year}
                                onChangeMonth={(item) => this._handleChange('month', item.value)}
                                onChangeYear={(item) => this._handleChange('year', item.value)}
                                onSubmit={() => this._getData()} />
                        </View>
                        <View style={{ width: "50%", flexDirection: 'column', alignItems: 'center', }}>
                            <Text style={[Texts.titleText, { textDecorationLine: 'underline' }]}>Fecha 2</Text>
                            <DateSelectorModal
                                modal={modalTwo}
                                onOpenModal={() => this.setState({ modalTwo: !modalTwo })}
                                onClose={() => this.setState({ modalTwo: false })}
                                month={monthTwo}
                                year={yearTwo}
                                onChangeMonth={(item) => this._handleChange('monthTwo', item.value)}
                                onChangeYear={(item) => this._handleChange('yearTwo', item.value)}
                                onSubmit={() => this._getData()} />
                        </View>
                    </View>
                </ImageBackground>
                <>
                    {!isLoadingExpenses ?

                        data?.labels?.length === 0 ? <Text>No existen gastos</Text> :
                            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>

                                <ScrollView style={Views.verticalGraphScrollView} >
                                    <ScrollView horizontal={true} contentContainerStyle={{ alignItems: 'center' }}>
                                        <LineChart
                                            bezier
                                            withHorizontalLabels={true}
                                            withVerticalLabels={true}
                                            data={data}
                                            width={chartWidth}
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
                                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

                                                propsForDots: {
                                                    r: "6",
                                                    strokeWidth: "2",
                                                }
                                            }}
                                        />

                                    </ScrollView>
                                </ScrollView>
                                {this.renderSummary(summaryData)}

                            </ScrollView>
                        : <ActivityIndicator />
                    }
                </>


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
    apiGetExpensesDateComparation,
    clearGraphData
};


const styles = StyleSheet.create({

    graphTitle: { fontSize: 20, fontWeight: 'bold' },

    graphContainer: { height: 300, padding: 20, flexDirection: 'row', width: '100%' },

    dropdownContainer: { width: "100%", flexDirection: 'column', alignItems: 'center' },

    graphContainer: { height: 280, paddingHorizontal: 20, paddingTop: 40, flexDirection: 'row', width: '90%' },

    summaryContainer: {
        flex: 1,
        justifyContent: 'center', width: '90%',
        borderRadius: 20, flexDirection: 'column',
        backgroundColor: 'rgba(236, 236, 236, .8)',
        marginVertical: 30,
        paddingVertical: 10,
        padding: 10
    },

    summaryHeaderContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomWidth: 1,
        width: "100%",
        paddingBottom: 10,
        alignItems: 'center',
    },

    summaryTitle: { fontSize: 16, fontWeight: 'bold', flex: 0.3, textAlign: 'center' },

    summaryBody: { width: "100%", flexDirection: 'column', paddingTop: 10 }
});

export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesDatesComparationGraphScreen);
