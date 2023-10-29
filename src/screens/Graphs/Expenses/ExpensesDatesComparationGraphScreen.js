
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text, ActivityIndicator, ScrollView } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesDateComparation, clearGraphData } from '../../../modules/Graph/GraphActions';

import { Grid, XAxis, YAxis, BarChart } from 'react-native-svg-charts'
import { Months } from '../constants';

import DateDropDown from '../../../components/DateDropDown';

import * as scale from 'd3-scale'
import CustomGrid from '../../../components/CustomGrid';
import * as Color from '../../../assets/styles/Colors';
import { findMaxValue } from '../Helpers';


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
        }

    }

    componentDidMount()
    {
        this._getData();
    }

    _handleChange(name, value)
    {
        this.setState({ [name]: value }, () =>
        { this._getData(); })
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
            this.setState({ data1, data2 })
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
            expenses[key].forEach(item => allCategories.push(item.category));
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

    renderLegend(data)
    {
        if (data.length > 0)
        {
            return (
                <View style={{ width: "90%", flexDirection: 'row' }}>
                    {data.map((item, index) => (
                        <View key={index} style={{ width: "50%", flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ height: 10, width: 10, marginHorizontal: 10, backgroundColor: item.svg.fill }} />
                            <Text style={{ color: 'black', fontSize: 14 }}>
                                {`${Months[item.date.getMonth()].name} ${item.date.getFullYear()}`}
                            </Text>
                        </View>
                    ))}
                </View>

            );
        } else return null;
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

        if (data1.length > 0)
        {
            return (
                data1.map((_, index) => (
                    <View key={index} style={{ width: "100%", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                        <Text style={{ color: 'black', fontSize: 14, flex: 0.3, textAlign: 'left', marginLeft: 20 }}>
                            {data1[index].category.slice(0, 8)}</Text>
                        <Text style={{ color: 'black', fontSize: 14, flex: 0.3, textAlign: 'center' }}>
                            {data1[index].total}</Text>
                        <Text style={{ color: 'black', fontSize: 14, flex: 0.3, textAlign: 'center' }}>
                            {data2[index]?.total}</Text>
                    </ View>

                ))


            );
        } else return null;
    }

    renderGraph(data)
    {
        const xAxisHeight = 30
        const contentInsent = { top: 10, bottom: 10 }
        const maxValue = findMaxValue(data);
        return (
            <View style={Views.squareBackground}>
                {this.renderLegend(data)}
                <View style={styles.graphContainer}>
                    <YAxis
                        data={data}
                        style={{ marginBottom: xAxisHeight }}
                        contentInset={contentInsent}
                        svg={{ fill: 'black', fontSize: 11 }}
                        yAccessor={({ item }) => maxValue}
                        min={0.01}
                        formatLabel={(value) => `${value}€`}
                        numberOfTicks={5}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <BarChart
                            style={{ flex: 1, marginLeft: 16 }}
                            data={data}
                            numberOfTicks={5}
                            spacingInner={0.1}
                            yAccessor={({ item }) => item.total}
                            svg={{ fill: 'rgba(134, 65, 244, 0.8)', }}
                            contentInset={contentInsent}
                        >
                            <Grid />
                            <CustomGrid />
                        </BarChart>
                        <XAxis
                            style={{ height: xAxisHeight }}
                            svg={{
                                fill: 'black',
                                fontSize: 10,
                                rotation: -25,
                                originY: 40,
                                y: 10,
                            }}
                            data={data[0].data}
                            scale={scale.scaleBand}
                            xAccessor={({ item }) => item.category}
                            formatLabel={(value) => `${value.slice(0, 5)}.`}
                            contentInset={{ left: 10, right: 10 }}
                            gridMin={0.1}
                        />
                    </View>
                </View>

            </View>
        )
    }



    render()
    {
        const { isLoadingExpenses } = this.props;
        const { month, year, monthTwo, yearTwo, data1, data2 } = this.state;

        const data = [
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
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
                        {isLoadingExpenses ? <ActivityIndicator /> : null}
                        <View style={styles.dropdownContainer}>
                            <DateDropDown
                                month={month}
                                year={year}
                                onChangeMonth={(item) => this._handleChange('month', item.value)}
                                onChangeYear={(item) => this._handleChange('year', item.value)} />

                            <DateDropDown
                                month={monthTwo}
                                year={yearTwo}
                                onChangeMonth={(item) => this._handleChange('monthTwo', item.value)}
                                onChangeYear={(item) => this._handleChange('yearTwo', item.value)} />
                        </View>
                        {(data1?.length && data2?.length) === (0 || undefined) ? <Text>No existen gastos</Text> :
                            <>
                                {this.renderGraph(data)}
                                {this.renderSummary(data)}
                            </>
                        }
                    </View>
                </ImageBackground>
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

    graphContainer: { height: 300, padding: 20, flexDirection: 'row', width: '90%' },

    dropdownContainer: { width: "100%", flexDirection: 'column', alignItems: 'center' },

    graphContainer: { height: 280, paddingHorizontal: 20, paddingTop: 40, flexDirection: 'row', width: '90%' },

    summaryContainer: {
        // flex: 1,
        justifyContent: 'center', width: '90%',
        borderRadius: 20, flexDirection: 'column',
        backgroundColor: 'rgba(236, 236, 236, .8)', marginVertical: 30, paddingVertical: 10
    },
    summaryHeaderContainer: {
        justifyContent: 'space-between', flexDirection: 'row', borderBottomWidth: 1, width: "100%", paddingBottom: 10
    },
    summaryTitle: { fontSize: 16, fontWeight: 'bold', flex: 0.3, textAlign: 'center' },

    summaryBody: { width: "100%", flexDirection: 'column', paddingTop: 10 }
});

export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesDatesComparationGraphScreen);
