
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesByYear, clearGraphData } from '../../../modules/Graph/GraphActions';
import { apiGetCategoriesByType } from '../../../modules/Category/CategoryActions'

import { Months, Years } from '../constants';

import { Dropdown } from 'react-native-element-dropdown';
import { Inputs } from '../../../assets/styles/Inputs';
import * as Color from '../../../assets/styles/Colors'
import { Style } from '../../../assets/styles/Style';
import { LineChart } from "react-native-chart-kit";
import { fillAllMonths } from '../../../services/api/Helpers';

class ExpensesByCategoryAndYearGraphScreen extends Component
{

    constructor(props)
    {
        super(props);
        const { category, year } = this.props;

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

    setGraphData()
    {
        const expenses = fillAllMonths(this.props.expenses)

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

        expenses?.forEach(expense =>
        {
            data.labels.push(Months[expense.month - 1]?.name.slice(0, 3))
            data.datasets[0].data.push(expense.total)
        })
        return data
    }

    render()
    {
        const { categories, isLoadingExpenses, isLoadingCategories, expenses } = this.props;
        const { year, category } = this.state;
        let data = []
        if (!this.props.isLoadingExpenses) data = this.setGraphData()

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeader} blurRadius={40}>
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
                <View style={Views.graphContainer}>
                    {isLoadingExpenses ? <ActivityIndicator /> : null}
                    {expenses?.length == 0 || !data || data.length == 0 ?
                        <Text>No existen gastos</Text> :
                        <LineChart
                            data={data}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                            width={Style.DEVICE_NINETY_FIVE_PERCENT_WIDTH}
                            height={350}
                            yAxisLabel="€"
                            verticalLabelRotation={-20}
                            chartConfig={{
                                backgroundColor: Color.orange,
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
                                    stroke: Color.button
                                }
                            }}
                            bezier
                        />
                    }
                </View>

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

    dropdownContainer: { width: "100%", flexDirection: 'row', justifyContent: "space-between" }
});

export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesByCategoryAndYearGraphScreen);
