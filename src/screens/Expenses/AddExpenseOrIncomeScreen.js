
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Header from '../../components/Header';
import { Views } from '../../assets/styles/Views';
import { localAssets } from '../../assets/images/assets';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icons } from '../../assets/styles/Icons';
import ConceptAndCategory from '../../components/ConceptAndCategory';
import DateInput from '../../components/DateInput';

import { apiPostIncome } from '../../modules/Income/IncomeActions';


class AddExpenseOrIncomeScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            amount: '',
            account: '',
            category: '',
            type: props.route.params.type || 'Expenses',
            concept: '',
            date: new Date(),
            formErrors: [],
            showDate: false,
            categoryModal: false,
        }
    }


    componentDidMount()
    {
        this.props.apiGetCategoriesByType(this.state.type)
        this.props.apiGetAccounts()
    }

    _add()
    {
        const account = this.state.account.uid
        const category = this.state.category.uid
        const amount = this.state.amount.replace(',', '.')
        let { concept, date, type } = this.state

        const formErrors = FormValidatorsManager.formExpenseIncome({ date, amount, account, category, concept })
        date = this.state.date.getFullYear() + "-"
            + ('0' + (this.state.date.getMonth() + 1)).slice(-2) + "-"
            + ('0' + this.state.date.getDate()).slice(-2)

        this.setState({ formErrors }, async () =>
        {
            if (formErrors.length === 0)
                if (type == "Expenses")
                    await this.props.apiPostExpense({ date, amount, account, category, concept });
                else
                    await this.props.apiPostIncome({ date, amount, account, category, concept });

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
            type, formErrors } = this.state

        const { accounts, categories, isLoadingAccounts, isLoadingCategories } = this.props
        return (
            <SafeAreaView style={Views.container}>
                <Header title={type === "Expenses" ? "Añadir gasto" : "Añadir ingreso"} goBack={true} />
                <ImageBackground source={localAssets.background} resizeMode="cover"
                    style={[Views.imageHeader, styles.header]} blurRadius={40}>
                    {isLoadingCategories ? <ActivityIndicator /> :
                        <Dropdown
                            style={Inputs.halfDropdown}
                            data={[{ name: "Gasto", value: "Expenses" }, { name: "Ingreso", value: "Incomes" }]}
                            value={type}
                            labelField="name"
                            valueField="value"
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            maxHeight={300}
                            placeholder="Seleccionar..."
                            onChange={async (item) =>
                            {
                                this._handleChange('type', item.value)
                                await this.props.apiGetCategoriesByType(item.value)
                            }}
                        />}
                    <TouchableOpacity onPress={() => this._add()} style={Icons.headerSaveIcon}>
                        <MaterialCommunityIcons name="content-save" size={Style.DEVICE_FIVE_PERCENT_WIDTH} color={Color.button} />
                    </TouchableOpacity >
                </ImageBackground>

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
                            <TextInputValidator
                                error={formErrors}
                                errorKey="amount"
                                inputValue={amount}
                                keyboardType="numeric"
                                onChange={value => this._handleChange('amount', value)}
                                placeholder="Cantidad"
                                title="Cantidad"
                                errorStyle={{ marginBottom: 100 }}
                                style={{ width: Style.DEVICE_NINETY_PERCENT_WIDTH }}
                            />
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
                                        valueField="value"
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