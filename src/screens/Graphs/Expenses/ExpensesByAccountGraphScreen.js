
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, View, Text, ActivityIndicator } from 'react-native';
import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesByAccount, clearGraphData } from '../../../modules/Graph/GraphActions';
import { Dropdown as DropdownStyle } from '../../../assets/styles/Dropdown';
import { PieChart } from "react-native-chart-kit";
import { Dropdown } from 'react-native-element-dropdown';
import DateSelectorModal from '../../../components/Modals/DateSelectorModal';
import { Style } from '../../../assets/styles/Style';
import * as Color from '../../../assets/styles/Colors'
import { generateColors } from '../Helpers';

class ExpensesByAccountGraphScreen extends Component
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
        await this.props.apiGetExpensesByAccount(account, month, year)
        this.setState({ modal: false })
    }

    componentWillUnmount()
    {
        this.props.clearGraphData()
    }

    setGraphData()
    {
        const data = []
        const colors = generateColors(this.props.expenses.length - 1)
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
                    <DateSelectorModal
                        modal={modal}
                        onOpenModal={() => this.setState({ modal: !modal })}
                        onClose={() => this.setState({ modal: false })}
                        month={month}
                        year={year}
                        onChangeMonth={(item) => this._handleChange('month', item.value)}
                        onChangeYear={(item) => this._handleChange('year', item.value)}
                        onSubmit={() => this._getData()} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                        <Dropdown
                            style={DropdownStyle.dropdown}
                            selectedTextStyle={DropdownStyle.selectedTextStyle}
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
                        <PieChart
                            data={data}
                            width={Style.DEVICE_WIDTH}
                            height={300}
                            style={{
                                alignSelf: 'center', marginTop: 10
                            }}
                            chartConfig={{
                                backgroundColor: '#1cc910',
                                backgroundGradientFrom: '#eff3ff',
                                backgroundGradientTo: '#efefef',
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                            }}
                            paddingLeft={"30"}
                            accessor={"amount"}
                            backgroundColor='transparent'
                            center={[10, 10]}
                        />

                }
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


export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesByAccountGraphScreen);
