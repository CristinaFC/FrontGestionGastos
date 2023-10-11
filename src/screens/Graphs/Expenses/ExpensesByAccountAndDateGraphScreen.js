
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesByYear } from '../../../modules/Graph/GraphActions';

import { Grid, XAxis, YAxis, LineChart } from 'react-native-svg-charts'
import { Months, Years } from '../constants';

import { Dropdown } from 'react-native-element-dropdown';
import { Inputs } from '../../../assets/styles/Inputs';


class ExpensesByAccountAndDateGraphScreen extends Component
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
    }

    render()
    {
        const { expenses, categories, isLoadingExpenses, isLoadingCategories } = this.props;
        const { year, category } = this.state;
        const contentInset = { top: 10, bottom: 10 }

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
                        {isLoadingExpenses || isLoadingCategories ? <ActivityIndicator /> : null}
                        <View style={styles.dropdownContainer}>

                            <Dropdown
                                style={Inputs.dropdown}
                                data={categories}
                                value={category}
                                labelField="name"
                                valueField="name"
                                maxHeight={300}
                                placeholder="Seleccionar categoría..."
                                onChange={(item) => this._handleChange('category', item.name)}
                            />
                            <Dropdown
                                style={Inputs.dropdown}
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
                                    <Text style={{ fontSize: 20, color: 'black' }}>{` ${expenses[0]?.total}€`}</Text></View> :
                                <>
                                    <View style={Views.squareBackground}>
                                        <Text style={styles.graphTitle}>{category}</Text>
                                        <View style={styles.graphContainer}>
                                            <YAxis
                                                data={expenses}
                                                contentInset={contentInset}
                                                svg={{ fill: 'black', fontSize: 12 }}
                                                numberOfTicks={5}
                                                formatLabel={(value) => `${value}€`}
                                                style={{ marginBottom: 30 }}
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
                                                    style={{ height: 30 }}
                                                    data={expenses}
                                                    formatLabel={(value, index) =>
                                                        Months.find((month) => month.value === expenses[index]?.month)?.name}
                                                    contentInset={{ left: 10, right: 10 }}
                                                    svg={{ fontSize: 12, fill: 'black' }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </>
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
    graphContainer: { height: 300, padding: 20, flexDirection: 'row', width: '90%' },
    dropdownContainer: { width: "90%", flexDirection: 'row', justifyContent: "space-between" }
});

export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesByAccountAndDateGraphScreen);
