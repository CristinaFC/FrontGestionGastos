
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text, ActivityIndicator, Dimensions } from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesByAccount, clearGraphData } from '../../../modules/Graph/GraphActions';

import { Grid, XAxis, YAxis, PieChart } from 'react-native-svg-charts'
import { Months, Years } from '../constants';

import { Dropdown } from 'react-native-element-dropdown';
import { Inputs } from '../../../assets/styles/Inputs';
import DateDropDown from '../../../components/DateDropDown';
import { generateColors } from '../Helpers';
import { Text as SVGText } from 'react-native-svg'

class ExpensesByAccountGraphScreen extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            account: "",
            labelWidth: 0,
            colors: []
        }


    }

    componentDidMount()
    {
        this._getData()
    }

    _handleChange(name, value)
    {
        this.setState({ [name]: value }, () =>
        { this._getData(); })
    }

    _getData()
    {
        const { account, month, year } = this.state
        this.props.apiGetExpensesByAccount(account, month, year)
    }
    componentWillUnmount()
    {
        this.props.clearGraphData()
    }
    render()
    {
        const { expenses, accounts, isLoadingExpenses, isLoadingAccounts } = this.props;
        const { month, year, account, } = this.state;


        const keys = [], values = []

        const colors = generateColors(this.props.expenses?.length)

        expenses.forEach(element =>
        {
            values.push(element?.total)
            keys.push(element?.category)
        });

        const data = keys.map((key, index) =>
        {
            return {
                key,
                value: values[index],
                svg: { fill: colors[index] },
            }
        })
        const Labels = ({ slices, height, width }) =>
        {
            return slices.map((slice, index) =>
            {
                const { labelCentroid, pieCentroid, data } = slice;
                return (
                    <SVGText
                        key={index}
                        x={pieCentroid[0]}
                        y={pieCentroid[1]}
                        fill={'white'}
                        textAnchor={'middle'}
                        alignmentBaseline={'middle'}
                        fontSize={18}
                        stroke={'black'}
                        strokeWidth={0.2}
                    >
                        {data.value}
                    </SVGText>
                )
            })
        }

        const Legend = () =>
        {
            if (data.length > 0)
            {
                return (
                    data.map((item, index) => (
                        <View key={index} style={{ width: "100%", flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ height: 10, width: 10, marginHorizontal: 30, backgroundColor: item.svg.fill }} />
                            <Text style={{ color: 'black', fontSize: 14, width: 200 }}>{item.key}</Text>
                            <Text style={{ color: 'black', fontSize: 14 }}>{item.value}€</Text>

                        </View>
                    ))

                );
            } else return null;
        }

        return (
            <SafeAreaView style={Views.container} >
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>

                    {isLoadingExpenses || isLoadingAccounts ? <ActivityIndicator /> : null}
                    <View style={styles.dropdownContainer}>
                        <DateDropDown
                            month={month}
                            year={year}
                            onChangeMonth={(item) => this._handleChange('month', item.value)}
                            onChangeYear={(item) => this._handleChange('year', item.value)} />
                    </View>
                    <Dropdown
                        style={Inputs.fullDropdown}
                        data={accounts}
                        value={account}
                        labelField="name"
                        valueField="name"
                        maxHeight={300}
                        placeholder="Seleccionar cuenta..."
                        onChange={(item) => this._handleChange('account', item.name)}
                    />
                    {expenses?.length === 0 ? <Text>No existen gastos</Text> :
                        <>
                            <View style={{
                                flex: 0.3, justifyContent: 'center', width: '85%',
                                borderRadius: 20,
                                backgroundColor: 'rgba(236, 236, 236, .8)', marginVertical: 30
                            }}>
                                <Legend />
                            </View>
                            <View style={{
                                flex: 0.5, justifyContent: 'center', width: '85%',
                                borderRadius: 20,
                                backgroundColor: 'rgba(236, 236, 236, .8)',
                            }}>

                                <PieChart
                                    style={{ height: 300 }}
                                    valueAccessor={({ item }) => item.value}
                                    data={data}
                                    spacing={0}
                                    outerRadius={'80%'}
                                >
                                    <Labels />
                                </PieChart>
                            </View>

                        </>
                    }
                </ImageBackground>
            </SafeAreaView >
        );
    }
}





const mapStateToProps = ({ GraphReducer, AccountReducer }) =>
{

    const { expenses, isLoadingExpenses } = GraphReducer;
    const { accounts, isLoadingAccounts } = AccountReducer;

    return { expenses, isLoadingExpenses, accounts, isLoadingAccounts };

};

const mapStateToPropsAction = {
    apiGetExpensesByAccount,
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
    graphContainer: { height: 300, padding: 20, flexDirection: 'row', width: '90%' },
    dropdownContainer: { width: "95%", flexDirection: 'row', justifyContent: 'center' }
});

export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesByAccountGraphScreen);
