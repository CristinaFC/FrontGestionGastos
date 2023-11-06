
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesByYear, clearGraphData } from '../../../modules/Graph/GraphActions';
import { apiGetCategoriesByType } from '../../../modules/Category/CategoryActions'

import { Grid, XAxis, YAxis, LineChart } from 'react-native-svg-charts'
import { Months, Years } from '../constants';

import { Dropdown } from 'react-native-element-dropdown';
import { Inputs } from '../../../assets/styles/Inputs';
import * as Color from '../../../assets/styles/Colors'


class ExpensesByYearGraphScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            year: new Date().getFullYear(),
            category: "Comida"
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
        this.props.apiGetExpensesByYear(year, category)
        this.props.apiGetCategoriesByType('Expenses')
    }
    componentWillUnmount()
    {
        this.props.clearGraphData()
    }

    _fillAllMonths()
    {
        const { expenses } = this.props
        let data = Array.isArray(expenses) ? [...expenses] : undefined;
        Months.forEach((month) =>
        {
            if (!expenses?.some(obj => obj.month === month.value)) data?.push({ total: 0, month: month.value })
        })
        data?.sort((a, b) =>
        {
            if (a.month > b.month) return 1;
            if (a.month < b.month) return -1;
            return 0;
        })
        return data
    }

    render()
    {
        const { categories, isLoadingExpenses, isLoadingCategories } = this.props;
        const { year, category } = this.state;
        const contentInset = { top: 10, bottom: 10 }
        const xAxisHeight = 30

        const expenses = this._fillAllMonths()
        console.log(expenses)

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
                        {isLoadingExpenses || isLoadingCategories ? <ActivityIndicator /> : null}
                        <View style={styles.dropdownContainer}>

                            <Dropdown
                                style={Inputs.middleDropdown}
                                data={categories}
                                value={category}
                                labelField="name"
                                valueField="name"
                                maxHeight={300}
                                placeholder="Seleccionar categoría..."
                                onChange={(item) => this._handleChange('category', item.name)}
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
                        {expenses?.length === 0 ? <Text>No existen gastos</Text> :
                            expenses?.length === 1 ?
                                <View style={styles.overview}>
                                    <Text style={{ fontSize: 18, color: Color.firstText, textAlign: 'center', padding: 10, lineHeight: 24 }}>
                                        {`Solo se han registrado gastos de ${category} en el mes de ${Months[expenses[0]?.month].name}:`}
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {` ${expenses[0]?.total}€`}
                                        </Text>
                                    </Text>
                                </View> :

                                <View style={Views.squareBackground}>
                                    <Text style={styles.graphTitle}>{category}</Text>
                                    <View style={Views.graphContainer}>
                                        <YAxis
                                            data={expenses}
                                            contentInset={contentInset}
                                            // scale={scale.scaleBand}
                                            svg={{ fill: 'black', fontSize: 12 }}
                                            numberOfTicks={5}
                                            formatLabel={(value) => `${value}€`}
                                            style={{ marginBottom: xAxisHeight }}
                                            yAccessor={({ item }) => item.total}

                                        />
                                        <View style={{ flex: 1, marginLeft: 10 }}>

                                            <LineChart
                                                style={{ flex: 1, marginLeft: 16 }}
                                                data={expenses ? expenses : []}
                                                numberOfTicks={5}
                                                yAccessor={({ item }) => item?.total}
                                                gridMin={0}
                                                svg={{ stroke: 'rgb(134, 65, 244)' }}
                                                contentInset={contentInset}
                                            >
                                                <Grid />
                                            </LineChart>
                                            <XAxis
                                                style={{ height: xAxisHeight }}
                                                data={expenses}
                                                formatLabel={(value, index) =>
                                                    Months.find((month) => month.value === expenses[index]?.month)?.name.slice(0, 3)}
                                                contentInset={{ left: 10, right: 10 }}
                                                svg={{
                                                    fontSize: 12, fill: 'black', rotation: -25,
                                                    originY: 18,
                                                    y: 10,
                                                }}
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



const mapStateToProps = ({ GraphReducer, CategoryReducer }) =>
{

    const { expenses, isLoadingExpenses } = GraphReducer;
    const { categories, isLoadingCategories } = CategoryReducer;

    return { expenses, isLoadingExpenses, categories, isLoadingCategories };

};

const mapStateToPropsAction = {
    apiGetExpensesByYear,
    apiGetCategoriesByType,
    clearGraphData
};


const styles = StyleSheet.create({

    overview: {
        width: "90%",
        height: "10%",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(236, 236, 236, .8)',
        marginTop: 15,
        backgroundColor: 'rgba(236, 236, 236, .8)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    graphTitle: { fontSize: 20, fontWeight: 'bold' },
    dropdownContainer: { width: "90%", flexDirection: 'row', justifyContent: "space-between" }
});

export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesByYearGraphScreen);
