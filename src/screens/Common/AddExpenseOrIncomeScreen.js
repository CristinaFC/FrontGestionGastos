
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Header from '../../components/Header';
import { Views } from '../../assets/styles/Views';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormValidatorsManager from '../../utils/validators/FormValidatorsManager';
import * as Color from '../../assets/styles/Colors';

import { TextInputValidator } from '../../components/TextInputValidator';
import { connect } from 'react-redux';

import { apiPostExpense } from '../../modules/Expense/ExpenseActions';
import { Dropdown } from 'react-native-element-dropdown';

import { apiGetAccounts } from '../../modules/Accounts/AccountActions';
import { apiGetCategoriesByType } from '../../modules/Category/CategoryActions';
import { Inputs } from '../../assets/styles/Inputs';
import { Texts } from '../../assets/styles/Texts';
import { Style } from '../../assets/styles/Style';
import ConceptAndCategory from '../../components/ConceptAndCategory';
import DateInput from '../../components/DateInput';

import { apiPostIncome } from '../../modules/Income/IncomeActions';
import axios from 'axios';
import { Currencies } from './constants';
import { formatCurrency } from '../../services/api/Helpers';

class AddExpenseOrIncomeScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            amount: '0',
            account: '',
            category: '',
            type: props.route.params.type || 'Expenses',
            concept: '',
            date: new Date(),
            formErrors: [],
            showDate: false,
            categoryModal: false,
            currency: 'EUR',
            value: '0',
            rate: '0',
            rates: []
        }

    }


    async componentDidMount()
    {
        await this.props.apiGetCategoriesByType(this.state.type)
        await this.props.apiGetAccounts()
        const response = await axios.get(`https://api.frankfurter.app/latest?from=EUR`);
        this.setState({ rates: response.data.rates })
    }


    async convert() 
    {
        const { amount, rates, currency } = this.state;
        if (amount.length == 0 || amount == '0')
            this.setState({ value: '0', rate: ' 0' })
        else
            if (currency == "EUR")
            {
                this.setState({ value: amount, rate: '1' })
            } else
            {
                const rate = 1 / rates[currency]
                let value = parseFloat(amount) * parseFloat(rate)
                this.setState({ value: formatCurrency(value), rate: rate.toFixed(6)?.toString()?.replace('.', ',') })
            }

    }

    _add()
    {
        const account = this.state.account.uid
        const category = this.state.category.uid
        const value = this.state.value.replace(',', '.')
        const amount = this.state.amount.replace(',', '.')
        const rate = this.state.rate.replace(',', '.')
        let { concept, date, type, currency, } = this.state

        const formErrors = FormValidatorsManager.formExpenseIncome({ date, amount, account, category, concept })
        date = this.state.date.getFullYear() + "-"
            + ('0' + (this.state.date.getMonth() + 1)).slice(-2) + "-"
            + ('0' + this.state.date.getDate()).slice(-2)

        this.setState({ formErrors }, async () =>
        {
            if (formErrors.length === 0)
                if (type == "Expenses")
                    await this.props.apiPostExpense({ date, amount: value, account, category, concept, exchangeData: { currency, value: amount, rate } });
                else
                    await this.props.apiPostIncome({ date, amount: value, account, category, concept, exchangeData: { currency, value: amount, rate } });

        })
    }

    _handleChange = (name, value) => { this.setState({ [name]: value }) }

    _handleDateChange(name, value)
    {
        const datePicker = `show${name.charAt(0).toUpperCase() + name.slice(1)}`

        this.setState({
            [name]: value,
            [datePicker]: false
        });
    }

    render()
    {
        const { date, amount, account,
            category, concept,
            type, formErrors, currency, value,
            rate } = this.state

        const { accounts, categories, isLoadingAccounts, isLoadingCategories } = this.props

        return (
            <SafeAreaView style={Views.container}>
                <Header
                    title={type === "Expenses" ? "Añadir gasto" : "Añadir ingreso"}
                    goBack={true}
                    rightIcon="content-save"
                    rightAction={() => this._add()} />

                {
                    (isLoadingAccounts || isLoadingCategories) ? <ActivityIndicator /> :
                        <View style={styles.container} >

                            <ConceptAndCategory
                                concept={concept}
                                categories={categories}
                                formErrors={formErrors}
                                category={category}
                                onChangeCategory={value => this._handleChange('category', value)}
                                onChangeConcept={value => this._handleChange('concept', value)}
                            />
                            <View style={[styles.inputsContainer, { flexDirection: 'row' }]}>

                                <TextInputValidator
                                    error={formErrors}
                                    errorKey="amount"
                                    inputValue={amount}
                                    keyboardType="numeric"
                                    onChange={async value =>
                                    {
                                        await this._handleChange('amount', value)
                                        this.convert()
                                    }}
                                    placeholder="Cantidad"
                                    title="Cantidad"
                                    errorStyle={{ marginBottom: 100 }}
                                    style={{ width: "80%" }}
                                />
                                <Dropdown
                                    style={{ marginLeft: 5, width: "19%", borderBottomWidth: 0.8, alignItems: 'center', height: 45, borderColor: Color.firstText }}
                                    data={Currencies}
                                    value={currency}
                                    labelField="value"
                                    valueField="value"
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    maxHeight={300}
                                    placeholder="Seleccionar..."
                                    onChange={async item =>
                                    {
                                        await this._handleChange('currency', item.value)
                                        this.convert(item.value)
                                    }}
                                />
                            </View>
                            <View style={[styles.inputsContainer, { flexDirection: 'row' }]}>
                                <TextInputValidator
                                    error={formErrors}
                                    errorKey="rate"
                                    inputValue={rate}
                                    keyboardType="numeric"
                                    onChange={async value =>
                                    {
                                        await this._handleChange('rate', value)
                                        if (value.length > 0)
                                        {
                                            let valueConverted = parseFloat(value?.replace(',', '.')) * parseFloat(amount)
                                            this.setState({ value: formatCurrency(valueConverted) })
                                        } else this.setState({ value: '0' })

                                    }}
                                    placeholder={`Precio (1 ${this.state.currency} a EUR)`}
                                    title={`Precio (1 ${this.state.currency} a EUR)`}
                                    errorStyle={{ marginBottom: 100 }}
                                    style={{ width: "60%" }}
                                />
                                <TextInputValidator
                                    error={formErrors}
                                    errorKey="amount"
                                    inputValue={value}
                                    keyboardType="numeric"
                                    onChange={async value =>
                                    {
                                        this._handleChange('amount', value)
                                        await this.convert()
                                    }}
                                    placeholder="Cantidad convertida"
                                    title="Cantidad convertida"
                                    editable={false}
                                    errorStyle={{ marginBottom: 100 }}
                                    style={{ width: "38%", marginLeft: "2%" }}
                                />
                            </View>
                            <View style={styles.inputsContainer}>
                                <DateInput
                                    date={date}
                                    onChange={(date) => { this._handleDateChange('date', date) }}
                                    title='Fecha'
                                    style={{ width: Style.DEVICE_NINETY_PERCENT_WIDTH }}
                                />
                            </View>
                            <View style={styles.inputsContainer}>
                                <Text style={Texts.inputTitle}>
                                    {formErrors.find(error => error.key === "account") !== undefined ?
                                        <Text style={Texts.errorText}>*</Text> : null}Cuenta:
                                </Text>
                                <View style={[Inputs.registerInput, { borderBottomWidth: 0 }]}>
                                    <Dropdown
                                        style={Inputs.fullDropdown}
                                        data={accounts}
                                        value={account}
                                        labelField="name"
                                        valueField="uid"
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        maxHeight={300}
                                        placeholder="Seleccionar..."
                                        onChange={item =>
                                        {
                                            this._handleChange('account', item)
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                }
            </SafeAreaView >
        );
    }
}

const mapStateToProps = ({ AccountReducer, CategoryReducer }) =>
{

    const { accounts, isLoadingAccounts } = AccountReducer;
    const { categories, isLoadingCategories } = CategoryReducer

    return { accounts, categories, isLoadingAccounts, isLoadingCategories };

};

const mapStateToPropsAction = {
    apiPostExpense,
    apiGetCategoriesByType,
    apiGetAccounts,
    apiPostIncome,
};


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Color.white,
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    modalCategory: {
        width: "100%",
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: Color.bodyBackground,
        height: 40,
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center'
    },
    inputsContainer: {
        width: Style.DEVICE_NINETY_PERCENT_WIDTH,
        alignItems: 'center'
    },
    datePicker: {
        width: Style.DEVICE_FORTY_PERCENT_WIDTH,
        height: "100%",
        borderBottomColor: Color.white,
        justifyContent: 'flex-end',
        marginBottom: "10%"
    },
    dateData: {
        color: Color.firstText,
        fontSize: 16,
        paddingBottom: 5
    },
    container: {
        width: "100%",
        height: Style.DEVICE_HALF_HEIGHT,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(236, 236, 236, .8)',
    },

});

export default connect(mapStateToProps, mapStateToPropsAction)(AddExpenseOrIncomeScreen);