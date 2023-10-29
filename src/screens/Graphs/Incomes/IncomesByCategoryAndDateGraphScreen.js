
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, View, ActivityIndicator, Text } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetIncomesByCategories, clearGraphData } from '../../../modules/Graph/GraphActions';

import { BarChart, Grid, XAxis } from 'react-native-svg-charts'

import DateDropDown from '../../../components/DateDropDown';
import * as scale from 'd3-scale'
import YAXISBarChart from '../../../components/YAXISBarChart';

class IncomesByCategoryAndDateGraphScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.props.clearGraphData()

        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth()
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
    componentWillUnmount()
    {
        this.props.clearGraphData()
    }

    _getData()
    {
        const { year, month } = this.state
        this.props.apiGetIncomesByCategories(month, year);
    }

    render()
    {
        const { incomes, isLoadingIncomes } = this.props;
        const { year, month } = this.state;

        const contentInset = { top: 30, bottom: 10 }

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
                        {isLoadingIncomes ? <ActivityIndicator /> : null}
                        <DateDropDown
                            month={month}
                            year={year}
                            onChangeMonth={(item) => this._handleChange('month', item.value)}
                            onChangeYear={(item) => this._handleChange('year', item.value)} />

                        {incomes?.length == 0 ?
                            <Text>No existen ingresos</Text> :
                            <View style={Views.squareBackground}>
                                <View style={{ height: 300, paddingHorizontal: 10, flexDirection: 'row', width: '90%' }}>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <BarChart
                                            style={{ flex: 1 }}
                                            data={incomes}
                                            svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                                            yAccessor={({ item }) => item.total}
                                            spacing={0.5}
                                            gridMin={0}
                                            contentInset={contentInset}
                                        >
                                            <Grid direction={Grid.Direction.HORIZONTAL} />
                                            <YAXISBarChart cutoff={20} />
                                        </BarChart>
                                        <XAxis
                                            style={{ marginHorizontal: 0, height: 45 }}
                                            svg={{
                                                fill: 'black',
                                                fontSize: 10,
                                                rotation: -25,
                                                originY: 40,
                                                y: 10,
                                            }}
                                            data={incomes}
                                            scale={scale.scaleBand}
                                            formatLabel={(value, index) => incomes[index].category}
                                            contentInset={{ left: 0, right: 0 }}
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





const mapStateToProps = ({ GraphReducer }) =>
{
    const { errors, incomes, isLoadingIncomes } = GraphReducer;

    return { errors, incomes, isLoadingIncomes };

};

const mapStateToPropsAction = {
    apiGetIncomesByCategories,
    clearGraphData
};



export default connect(mapStateToProps, mapStateToPropsAction)(IncomesByCategoryAndDateGraphScreen);
