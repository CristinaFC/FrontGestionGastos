
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesByAccountPerYear, clearGraphData } from '../../../modules/Graph/GraphActions';
import { Dropdown as DropdownStyle } from '../../../assets/styles/Dropdown';
import { PieChart } from "react-native-chart-kit";
import { Dropdown } from 'react-native-element-dropdown';
import DateSelectorModal from '../../../components/Modals/DateSelectorModal';
import { Style } from '../../../assets/styles/Style';
import * as Color from '../../../assets/styles/Colors'
import { generateColors } from '../Helpers';
import { Years } from '../constants';
import { Inputs } from '../../../assets/styles/Inputs';
import { Texts } from '../../../assets/styles/Texts';

class ExpensesByAccountPerYearGraphScreen extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            account: "",
            modal: false
        }
    }

    componentDidMount()
    {
        this._getData()
    }

    _handleChange(name, value) { this.setState({ [name]: value }) }

    async _getData()
    {
        this.props.clearGraphData()
        const { account, month, year } = this.state
        await this.props.apiGetExpensesByAccountPerYear(account, year)
        this.setState({ modal: false })
    }

    componentWillUnmount()
    {
        this.props.clearGraphData()
    }
    summaryInfo()
    {
        const { year, account } = this.state
        const { expenses } = this.props
        const total = expenses.reduce((accumulator, exp) => accumulator + exp.total, 0);

        return (
            this.props.isLoadingExpenses ? <ActivityIndicator /> :
                <View style={{ width: Style.DEVICE_NINETY_FIVE_PERCENT_WIDTH, marginVertical: 10, alignSelf: 'center' }}>
                    <View style={Views.squareBackground}>
                        <Text style={styles.summaryText}>
                            En {year}, has gastado un total de {total}€ desde la cuenta: {account}

                        </Text>
                    </View>
                </View>
        )
    }
    setGraphData()
    {
        const data = []
        const colors = generateColors(this.props.expenses?.length - 1)
        this.props.expenses.forEach((expense, index) =>
        {
            data.push({
                name: expense.category,
                amount: expense.total,
                color: colors[index],
                legendFontColor: Color.firstText,
                legendFontSize: 12
            })
        })

        return data
    }

    render()
    {
        const { expenses, accounts, isLoadingExpenses, isLoadingAccounts } = this.props;
        const { month, year, account, modal } = this.state;
        let data = []
        if (!this.props.isLoadingExpenses) data = this.setGraphData()

        return (
            <SafeAreaView style={Views.container} >
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
                        onChange={async ({ value }) => { await this._handleChange("year", value); await this._getData() }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                        <Dropdown
                            style={DropdownStyle.dropdown}
                            selectedTextStyle={[DropdownStyle.selectedTextStyle, { color: Color.white }]}
                            placeholderStyle={DropdownStyle.placeholderStyle}
                            data={accounts}
                            value={account}
                            labelField="name"
                            valueField="name"
                            maxHeight={300}
                            withVerticalLabels={true}
                            showValuesOnTopOfBars
                            placeholder="Seleccionar cuenta..."
                            onChange={async (item) => { await this._handleChange('account', item.name); await this._getData() }}
                        />
                    </View>
                </ImageBackground>
                {isLoadingExpenses || isLoadingAccounts ? <ActivityIndicator /> : null}
                {
                    expenses?.length === 0 ? <Text>No existen gastos</Text> :
                        <ScrollView style={Views.verticalGraphScrollView} >
                            {this.summaryInfo()}
                            <ScrollView horizontal={true} style={Views.horizontalGraphScrollView} >
                                <PieChart
                                    data={data}
                                    width={Style.DEVICE_WIDTH}
                                    height={300}
                                    style={{
                                        borderRadius: 20,
                                        padding: 10,
                                    }}
                                    chartConfig={{
                                        backgroundColor: Color.white,
                                        backgroundGradientFrom: Color.white,
                                        backgroundGradientTo: Color.white,
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => Color.white,
                                        style: {
                                            borderRadius: 16,
                                        },
                                    }}
                                    paddingLeft={"30"}
                                    accessor={"amount"}
                                    backgroundColor='transparent'
                                    center={[10, 10]}
                                />
                            </ScrollView>
                        </ScrollView>

                }
            </SafeAreaView >
        );
    }
}
const styles = StyleSheet.create({
    summaryText: {
        fontSize: 14,
        color: Color.firstText,
        lineHeight: 30,
        textAlign: 'center',
        padding: 10
    },
    summaryTextRed: {
        fontSize: 14,
        lineHeight: 24,
        color: "red",

    },
    summaryTextButton: {
        fontSize: 14,
        lineHeight: 30,
        color: "#6AA58C",
    },
});


const mapStateToProps = ({ GraphReducer, AccountReducer }) =>
{

    const { expenses, isLoadingExpenses } = GraphReducer;
    const { accounts, isLoadingAccounts } = AccountReducer;

    return { expenses, isLoadingExpenses, accounts, isLoadingAccounts };

};

const mapStateToPropsAction = {
    apiGetExpensesByAccountPerYear,
    clearGraphData
};


export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesByAccountPerYearGraphScreen);
