
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';

import { Views } from '../../assets/styles/Views';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesByCategoryAndDate, clearGraphData } from '../../modules/Graph/GraphActions';

import { BarChart, Grid, XAxis } from 'react-native-svg-charts'
import { MenuButton } from '../../components/MenuButton';
import { Forms } from '../../assets/styles/Forms';
import { Months, Years } from './constants';

import { Dropdown } from 'react-native-element-dropdown';
import * as Color from '../../assets/styles/Colors';


class ExpensesGraphsScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth()
        }
    }


    componentDidMount() { this._getData() }

    _handleChange(name, value) { this.setState({ [name]: value }) }

    _getData() { this.props.apiGetExpensesByCategoryAndDate() }

    render()
    {
        const { expenses, errors } = this.props;
        const { year, month } = this.state;
        console.log(this.props)
        if (expenses?.length == 0) return <ActivityIndicator />
        return (
            <SafeAreaView style={styles.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    {errors != null ? <Text>No existen gastos</Text> :
                        <View style={{ width: "100%", height: "100%", alignItems: "center" }}>

                            <View style={{ width: "100%", height: 40, borderWidth: 1, justifyContent: "space-around", alignItems: "center", flexDirection: 'row', margin: 20 }}>

                                <Dropdown
                                    style={styles.dropdown}
                                    data={Months}
                                    value={month}
                                    labelField="name"
                                    valueField="value"
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    maxHeight={300}
                                    placeholder="Seleccionar..."
                                    onChange={item =>
                                    {
                                        this._handleChange('month', item.value)
                                    }}
                                />
                                <Dropdown
                                    style={styles.dropdown}
                                    data={Years}
                                    value={year}
                                    labelField="name"
                                    valueField="value"
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    maxHeight={300}
                                    placeholder="Seleccionar..."
                                    onChange={item =>
                                    {
                                        this._handleChange('year', item.value)
                                    }}
                                />
                                {/* Esto será un selector del mes*/}
                            </View>
                            <View View style={Forms.registerFormContainer}>
                                <BarChart
                                    style={{ height: 200, width: "80%" }}
                                    data={expenses[0].gastos}
                                    yAccessor={({ item }) => item.value}
                                    svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                                    contentInset={{ top: 20, bottom: 20 }}
                                >
                                    <XAxis
                                        data={expenses[0].gastos}
                                        xAccessor={({ index }) => index}
                                        formatLabel={(value) => expenses[0].gastos[value].label}
                                        contentInset={{ left: 40, right: 40 }}
                                        svg={{ fontSize: 10, fill: 'black' }}
                                    />
                                </BarChart>
                            </View>
                        </View>
                    }
                    {/* <BarChart style={{ height: 200, width: "80%" }} data={data} svg={{ fill }} contentInset={{ top: 30, bottom: 30 }}>
                        <XAxis
                            // style={{ marginHorizontal: 10 }}
                            data={data}
                            xAccessor={({ index }) => index}
                            formatLabel={keys}
                            contentInset={{ left: 10, right: s10 }}
                            svg={{ fontSize: 10, fill: 'black' }}
                        />
                        <Grid />
                    </BarChart> */}
                    {/* <StackedBarChart
                        style={{ height: 200, width: 300 }}
                        keys={keys}
                        colors={colors}
                        data={data}
                        showGrid={true}
                        contentInset={{ top: 30, bottom: 30 }}
                    /> */}
                </ImageBackground>
            </SafeAreaView >
        );
    }

}





const mapStateToProps = ({ GraphReducer }) =>
{

    const { errors, expenses } = GraphReducer;

    return { errors, expenses };

};

const mapStateToPropsAction = {
    apiGetExpensesByCategoryAndDate,
    clearGraphData
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        // display: 'flex',
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 10, padding: "5%",
        marginTop: "5%",
        backgroundColor: 'rgba(236, 236, 236, .8)',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: "row",
        margin: "2%",
        alignItems: 'center',
    },
    title: {
        width: "60%",
        justifyContent: 'center',
        alignItems: 'flex-start',
        display: 'flex',
        paddingLeft: 0,
    },
    rightButton: {
        width: "20%",
        alignItems: 'flex-end',
        justifyContent: 'center',
        display: 'flex'
    },


    dropdown: {
        padding: 5,
        width: 150,
        alignSelf: 'flex-end',
        height: 40,
        borderColor: Color.white,
        borderWidth: 1,
        marginTop: "2%",
        backgroundColor: 'rgba(236, 236, 236, .8)',
        borderRadius: 10
    },
    dropdownContainer: {
        paddingHorizontal: "10%",
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    dropdownText: {
        color: Color.firstText,
        fontSize: 16
    },
    datePicker: {
        width: "80%",
        height: "100%",
        borderBottomWidth: 0.4,
        borderBottomColor: Color.firstText,
        justifyContent: 'flex-end',
        marginBottom: "10%"
    },
    dateData: {
        color: Color.firstText,
        fontSize: 16,
        paddingBottom: 5
    },
    form: {
        width: "80%",
        height: 550,
        paddingVertical: 30,
        marginTop: "10%",
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: 'rgba(236, 236, 236, .8)',
        justifyContent: 'space-between'
    }



});

export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesGraphsScreen);
