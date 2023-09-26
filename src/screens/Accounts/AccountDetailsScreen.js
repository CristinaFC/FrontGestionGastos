import React, { Component } from "react";
import { View, StyleSheet, ImageBackground, ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity } from "react-native";
import { apiGetIncomesByAccount } from "../../modules/Income/IncomeActions";
import { apiGetExpensesByAccount } from "../../modules/Expense/ExpenseActions";

import
{
    apiPutAccountById,
    apiGetAccountById,
    apiDeleteAccount,
    setAccountDataState,
    clearAccountData
} from "../../modules/Accounts/AccountActions";
import { connect } from "react-redux";
import { Views } from "../../assets/styles/Views";
import Header from "../../components/Header";
import { localAssets } from "../../assets/images/assets";

import * as Color from '../../assets/styles/Colors'
import { Style } from "../../assets/styles/Style";
import { Texts } from "../../assets/styles/Texts";
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Routing from "../../navigation/Routing";
import * as RootRouting from '../../navigation/RootRouting'

class AccountDetails extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            name: '',
            icon: '',
            totalAmount: '',
            totalIncomes: '',
            totalExpenses: '',
            incomesExpanded: false,
            expensesExpanded: false,
            formErrors: [],
        }
        this.id = props.route.params.id;
    }

    async componentDidMount()
    {
        await this._getData()
    }

    async _getData()
    {
        await this.props.apiGetAccountById(this.id);
        let { name, icon, isBalance, totalExpenses, totalIncomes, totalAmount } = this.props.account
        totalIncomes = totalIncomes.toString()
        totalExpenses = totalExpenses.toString()
        totalAmount = totalAmount.toString()
        this.setState({ name, icon, isBalance, totalExpenses, totalIncomes, totalAmount })

        await this.props.apiGetIncomesByAccount(this.id)
        await this.props.apiGetExpensesByAccount(this.id)
    }

    render()
    {
        const { isLoadingAccount, isLoadingIncomes, incomes, expenses } = this.props;
        const { totalAmount, totalExpenses, totalIncomes } = this.props.account;

        return (
            <View style={styles.container}>
                <Header goBack={true} title="Detalles" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <Balance totalAmount={totalAmount} totalExpenses={totalExpenses} totalIncomes={totalIncomes} />

                    <SafeAreaView style={styles.safeContainer}>
                        <ScrollView contentContainerStyle={styles.scrollview}>
                            {isLoadingAccount ? <ActivityIndicator /> :
                                <View style={styles.content}>
                                    <Collapse>
                                        <CollapseHeader style={styles.collapseHeader}>
                                            <CollapseHeaderTitle name="Ingresos" />
                                        </CollapseHeader>
                                        <CollapseBody>
                                            {incomes?.length > 0
                                                ? incomes.map((data, index) => (
                                                    <CollapseBodyData key={index} data={data}
                                                        onPress={
                                                            () => RootRouting.navigate(Routing.detailsIncome, { id: data.uid })
                                                        }
                                                    />
                                                ))
                                                : <Text style={styles.collapseBodyNoData}>No hay ingresos</Text>
                                            }
                                        </CollapseBody>
                                    </Collapse>

                                    <Collapse>
                                        <CollapseHeader style={styles.collapseHeader}>
                                            <CollapseHeaderTitle name="Gastos" />
                                        </CollapseHeader>
                                        <CollapseBody>
                                            {expenses?.length > 0
                                                ? expenses.map((data, index) => (
                                                    <CollapseBodyData key={index} data={data}
                                                        onPress={
                                                            () => RootRouting.navigate(Routing.detailsExpense, { id: data.uid })
                                                        }
                                                    />))
                                                : <Text style={styles.collapseBodyNoData}>No hay gastos</Text>
                                            }
                                        </CollapseBody>
                                    </Collapse>
                                </View>}
                        </ScrollView>
                    </SafeAreaView>
                </ImageBackground >
            </View >
        )

    }
}
const CollapseHeaderTitle = ({ name }) => (
    <View style={styles.collapseHeaderView} >
        <Text style={styles.collapseHeaderText}>{name}</Text>
        <MaterialCommunityIcons name="chevron-down" size={30} color={Color.headerBackground} />
    </View>
)


const CollapseBodyData = (props) =>
{
    const { data, onPress } = props

    return (
        <TouchableOpacity style={styles.collapseBodyView} onPress={onPress}>
            <Text style={[styles.collapseBodyText, styles.collapseBodyTextAmount]}>{data.amount}€</Text>
            <Text style={[styles.collapseBodyText, styles.collapseBodyTextCategory]}>{data.category.name}</Text>
            <Text style={styles.collapseBodyText}>{new Date(data.date).toLocaleDateString()}</Text>
        </TouchableOpacity>

    )
}


const Balance = ({ totalAmount, totalExpenses, totalIncomes }) =>
{
    return (
        <View style={styles.overviewContent}>
            <View style={styles.overview}>
                <Text style={styles.overviewTitle}>Saldo</Text>
                <Text style={totalAmount >= 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{totalAmount}€
                </Text>
            </View>
            <View style={styles.overview}>
                <Text style={styles.overviewTitle}>Ingresos</Text>
                <Text style={totalIncomes > 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{totalIncomes}€</Text>
            </View>
            <View style={styles.overview}>
                <Text style={styles.overviewTitle}>Gastos</Text>
                <Text style={totalExpenses <= 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{totalExpenses}€</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeContainer: {
        flex: 1,
        marginBottom: 10,
        marginTop: "15%"
    },
    scrollview: {
        width: Style.DEVICE_WIDTH,
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex'
    },
    content: {
        backgroundColor: 'rgba(236, 236, 236, .4)',
        width: "93%",
        display: 'flex',
    },
    overview: {
        width: "30%",
        margin: "1%",
        height: "100%",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(236, 236, 236, .8)',
        marginTop: 30,
        backgroundColor: 'rgba(236, 236, 236, .8)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    overviewTitle: {
        fontSize: 18, color: Color.firstText, marginBottom: 5
    },
    overviewContent: {
        flexDirection: 'row',
        height: "10%",
        width: '100%',
        justifyContent: 'center'
    },
    collapseHeader: {
        borderColor: Color.white,
        borderWidth: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        height: 60,
        backgroundColor: Color.bodyBackground
    },
    collapseHeaderView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignContent: 'center',
        bodyBackground: ''
    },
    collapseHeaderText: {
        color: Color.headerBackground,
        fontSize: Style.FONT_SIZE_MEDIUM,
        fontFamily: Style.FONT_FAMILY
    },
    collapseBodyView: {
        height: 50,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
        marginHorizontal: 5,
        alignItems: 'center',
        backgroundColor: Color.bodyBackground,
        paddingHorizontal: 30
    },
    collapseBodyText: {
        fontSize: Style.FONT_SIZE,
        fontFamily: Style.FONT_FAMILY,
        width: "30%",
        color: Color.firstText
    },
    collapseBodyNoData: {
        fontSize: Style.FONT_SIZE,
        fontFamily: Style.FONT_FAMILY,
        color: Color.firstText
    },
    collapseBodyTextAmount: {
        color: Color.button,
        fontWeight: 'bold',
    },
    collapseBodyTextCategory: {
        fontWeight: 'bold',
    }
});

const mapStateToProps = ({ AccountReducer, IncomeReducer, ExpenseReducer }) =>
{

    const { account, isLoadingAccount } = AccountReducer;
    const { incomes, isLoadingIncomes } = IncomeReducer;
    const { expenses, isLoadingExpenses } = ExpenseReducer;

    return { account, isLoadingAccount, incomes, isLoadingIncomes, expenses, isLoadingExpenses };

};

const mapStateToPropsAction = {
    apiGetAccountById,
    apiPutAccountById,
    apiDeleteAccount,
    setAccountDataState,
    apiGetIncomesByAccount,
    apiGetExpensesByAccount,
    clearAccountData
};
export default connect(mapStateToProps, mapStateToPropsAction)(AccountDetails);
