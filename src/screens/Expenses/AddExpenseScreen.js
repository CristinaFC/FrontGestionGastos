
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Switch, ActivityIndicator, ScrollView } from 'react-native';
import Header from '../../components/Header';
import { Views } from '../../assets/styles/Views';
import { localAssets } from '../../assets/images/assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormValidatorsManager from '../../utils/validators/FormValidatorsManager';
import * as Color from '../../assets/styles/Colors';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker'

import { TextInputValidator } from '../../components/TextInputValidator';
import SubmitButton from '../../components/SubmitButton';
import { connect } from 'react-redux';

import { apiPostExpense } from '../../modules/Expense/ExpenseActions';
import { Dropdown } from 'react-native-element-dropdown';

import { apiGetAccounts } from '../../modules/Accounts/AccountActions';
import { apiGetCategoriesByType } from '../../modules/Category/CategoryActions';
import { periods } from './constants';
import { Inputs } from '../../assets/styles/Inputs';

class AddExpenseScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            amount: '',
            account: '',
            category: '',
            description: '',
            fixed: false,
            date: new Date(),
            formErrors: [],
            showDate: false,
            period: '',
            endOf: false,
            dateEndOf: new Date(),
            showDateEndOf: false
        }
    }
    componentDidMount()
    {
        this.props.apiGetCategoriesByType("Expenses")
        this.props.apiGetAccounts()
    }

    _handleSwitch() { this.setState({ fixed: !this.state.fixed }) }

    _addExpense()
    {
        const date =
            this.state.date.getFullYear() + "-"
            + ('0' + (this.state.date.getMonth() + 1)).slice(-2) + "-"
            + ('0' + this.state.date.getDate()).slice(-2)


        const account = this.state.account.uid
        const category = this.state.category.uid
        const amount = this.state.amount.replace(',', '.')
        const { description, fixed, endOf, period } = this.state

        const dateEndOf = endOf ?
            this.state.dateEndOf.getFullYear() + "-"
            + ('0' + (this.state.date.getMonth() + 1)).slice(-2) + "-"
            + ('0' + this.state.date.getDate()).slice(-2) : null

        const formErrors = FormValidatorsManager.formExpenseIncome({ date, amount, account, category })

        this.setState({ formErrors })
        if (formErrors.length === 0)
            this.props.apiPostExpense({ date, amount, account, category, description, fixed, dateEndOf, period });
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
        const { date, amount, account, category, description,
            group, showDate, formErrors, fixed, period, endOf, dateEndOf, showDateEndOf } = this.state
        const { accounts, categories, isLoadingAccounts, isLoadingCategories } = this.props

        if (isLoadingAccounts || isLoadingCategories) return <ActivityIndicator />
        console.log(this.state)
        return (
            <SafeAreaView style={styles.container} >
                <Header title="Añadir gasto" goBack={true} />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <ScrollView style={styles.form} contentContainerStyle={{
                        alignItems: "center",
                        justifyContent: 'space-between', flexGrow: 2
                    }}>

                        <TextInputValidator
                            error={formErrors}
                            errorKey="amount"
                            inputValue={amount}
                            keyboardType="numeric"
                            onChange={value => this._handleChange('amount', value)}
                            placeholder="Cantidad"
                            title="Cantidad"
                        />

                        <TextInputValidator
                            multiline={true}
                            numberOfLines={4}
                            error={formErrors}
                            errorKey="description"
                            inputValue={description}
                            keyboardType="ascii-capable"
                            onChange={value => this._handleChange('description', value)}
                            placeholder="Descripción"
                            title="Descripción"
                        />

                        <Text style={[styles.text, { marginTop: 30 }]}>Fecha:</Text>
                        <View style={Inputs.fullDropdown}>
                            <TouchableOpacity onPress={() => this.setState({ showDate: true })} style={styles.datePicker}>
                                <Text style={styles.dateData}>{date.toLocaleDateString('es-ES')}</Text>
                            </TouchableOpacity >
                            <DatePicker
                                modal
                                locale='es'
                                open={showDate}
                                date={date}
                                mode="date"
                                onConfirm={(date) => { this._handleDateChange('date', date) }}
                                onCancel={() => { this.setState({ showDate: false }) }}
                            />
                        </View>
                        <View style={styles.dropdownContainer}>
                            <Text style={styles.dropdownText}>
                                {formErrors.find(error => error.key === "category") !== undefined ?
                                    <Text style={styles.errorText}>*</Text> : null}
                                Categoría:
                            </Text>
                            <Dropdown
                                style={Inputs.halfDropdown}
                                data={categories}
                                value={category}
                                labelField="name"
                                valueField="value"
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                maxHeight={300}
                                placeholder="Seleccionar..."
                                onChange={item =>
                                {
                                    this._handleChange('category', item)
                                }}
                            />
                        </View>

                        <View style={styles.dropdownContainer}>
                            <Text style={styles.dropdownText}>
                                {formErrors.find(error => error.key === "account") !== undefined ?
                                    <Text style={styles.errorText}>*</Text> : null}Cuenta:
                            </Text>
                            <Dropdown
                                style={Inputs.halfDropdown}
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
                        <View
                            style={{
                                width: "80%",
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 10
                            }}
                        />
                        <View style={styles.switcher}>
                            <Text style={styles.text} >Gasto fijo:</Text>
                            <Switch
                                style
                                trackColor={{ false: Color.orange, true: Color.button }}
                                thumbColor={Color.white}
                                onValueChange={() => this._handleSwitch()}
                                value={fixed}
                            />
                        </View>
                        {fixed ?
                            <>
                                <Dropdown
                                    style={Inputs.fullDropdown}
                                    data={periods}
                                    value={period}
                                    labelField="name"
                                    valueField="value"
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    maxHeight={300}
                                    placeholder="Seleccionar..."
                                    onChange={item =>
                                    {
                                        this._handleChange('period', item.value)
                                    }}
                                />

                                <View style={styles.checkboxContainer}>
                                    <CheckBox
                                        value={endOf}
                                        onValueChange={() => this.setState({ endOf: !endOf })}
                                        style={styles.checkbox}
                                    /><Text style={styles.text}>¿Tiene fecha final?</Text>
                                </View>
                                {endOf ?
                                    <View style={Inputs.fullDropdown}>
                                        <TouchableOpacity onPress={() => this.setState({ showDateEndOf: true })} style={styles.datePicker}>
                                            <Text style={styles.dateData}>{dateEndOf.toLocaleDateString('es-ES')}</Text>
                                        </TouchableOpacity >
                                        <DatePicker
                                            modal
                                            locale='es'
                                            open={showDateEndOf}
                                            date={dateEndOf}
                                            mode="date"
                                            onConfirm={(date) => this._handleDateChange('dateEndOf', date)}
                                            onCancel={() => { this.setState({ showDateEndOf: false }) }}
                                        /></View> : null}
                            </>
                            : null}

                        <SubmitButton title="Añadir" onPress={() => this._addExpense()} />
                    </ScrollView>
                </ImageBackground>
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
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center'
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkbox: {
        marginLeft: 25
    },
    errorText: {
        marginLeft: "10%",
        color: Color.orange,
        fontSize: 16,
        alignSelf: 'flex-start'
    },
    inputText: {
        width: "80%",
        color: Color.firstText,
        fontSize: 16,
        marginBottom: "-3%",
    },
    text: {
        width: "80%",
        color: Color.firstText,
        fontSize: 16,
        marginBottom: 0,
    },
    switcher: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "80%",
        marginTop: 10,
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
        width: "100%",
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
        width: "90%",
        paddingVertical: 10,
        marginVertical: "10%",
        borderRadius: 20,
        backgroundColor: 'rgba(236, 236, 236, .8)',
        flexDirection: 'column',
    }

});

export default connect(mapStateToProps, mapStateToPropsAction)(AddExpenseScreen);