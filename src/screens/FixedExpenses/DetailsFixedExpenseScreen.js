
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Color from '../../assets/styles/Colors';
import { Views } from '../../assets/styles/Views';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import { apiGetFixedExpenseById, apiPutExpenseById } from '../../modules/FixedExpenses/FixedExpenseActions';
import { apiGetAccounts } from '../../modules/Accounts/AccountActions';
import { apiGetCategoriesByType } from '../../modules/Category/CategoryActions';
import { connect } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import { TextInputValidator } from '../../components/TextInputValidator';
import DatePicker from 'react-native-date-picker'
import SubmitButton from '../../components/SubmitButton';
import FormValidatorsManager from '../../utils/validators/FormValidatorsManager';
import { Inputs } from '../../assets/styles/Inputs';
import { HorizontalLine } from '../../components/HorizontalLine';
import { Texts } from '../../assets/styles/Texts';
import { periods } from '../Expenses/constants';
import CheckBox from '@react-native-community/checkbox';

class DetailsFixedExpenseScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            amount: '',
            account: '',
            category: '',
            description: '',
            date: new Date(),
            formErrors: [],
            showDate: false,
            period: '',
            hasEndDate: false,
            dateEndOf: new Date(),
            showDateEndOf: false
        }
        this.id = props.route.params.id;

    }
    async _getData()
    {
        await this.props.apiGetFixedExpenseById(this.id);
        console.log("----------------------------------------------------")
        console.log(this.props)
        let { date, amount, account, category, description,
            showDate, formErrors, period, hasEndDate, dateEndOf, showDateEndOf } = this.props.fixedExpense
        date = new Date(date)
        dateEndOf = dateEndOf ? new Date(dateEndOf) : new Date()

        amount = amount.toString().replace('.', ',')

        this.setState({
            date, amount, account, category, description,
            showDate, formErrors, period, hasEndDate, dateEndOf, showDateEndOf
        })
        this.props.apiGetCategoriesByType("Expenses")
        this.props.apiGetAccounts()
    }

    async componentDidMount()
    {
        await this._getData()
    }

    _handleChange(name, value) 
    {
        this.setState({ [name]: value })
    }

    _handleDateChange(name, value)
    {
        const datePicker = `show${name.charAt(0).toUpperCase() + name.slice(1)}`

        this.setState({
            [name]: value,
            [datePicker]: false
        });
    }

    _editExpense()
    {

        const account = this.state.account._id ? this.state.account._id : this.state.account.uid
        const category = this.state.category._id ? this.state.category._id : this.state.category.uid

        const amount = this.state.amount.replace(',', '.')
        let { description, dateEndOf, period, date, hasEndDate } = this.state

        const formErrors = FormValidatorsManager.formFixedExpense({ amount, account, category, dateEndOf, period, date, hasEndDate })

        date = this.state.date.getFullYear() + "-"
            + ('0' + (this.state.date.getMonth() + 1)).slice(-2) + "-"
            + ('0' + this.state.date.getDate()).slice(-2)
        dateEndOf = dateEndOf ? this.state.dateEndOf.getFullYear() + "-"
            + ('0' + (this.state.date.getMonth() + 1)).slice(-2) + "-"
            + ('0' + this.state.date.getDate()).slice(-2) : null
        this.setState({ formErrors }, () =>
        {
            if (formErrors.length === 0)
                this.props.apiPutExpenseById(this.id, { date, amount, account, category, description, period, hasEndDate, endDate });
        })

    }

    render()
    {
        const { accounts, categories, isLoadingAccounts, isLoadingCategories, isLoadingFixedExpense } = this.props

        const { date, amount, account, category, description,
            showDate, formErrors = [], period, hasEndDate, dateEndOf, showDateEndOf } = this.state

        const periodError = formErrors.find(e => e.key === "period")?.value
        const dateError = formErrors.find(e => e.key === "date")?.value
        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Detalles" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    {isLoadingFixedExpense || isLoadingAccounts || isLoadingCategories
                        ? <ActivityIndicator />
                        :

                        <ScrollView style={styles.form} contentContainerStyle={{
                            flexGrow: 1, alignItems: 'center', justifyContent: 'space-around'
                        }}>

                            <TextInputValidator
                                error={formErrors}
                                errorKey="amount"
                                inputValue={amount}
                                keyboardType="numeric"
                                onChange={value => this._handleChange('amount', value)}
                                placeholder="Cantidad"
                                title="Cantidad"
                                errorStyle={{ marginBottom: 100 }}
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
                            {dateError ? <Text Text style={Texts.errorText}>{dateError}</Text> : null}
                            <HorizontalLine />
                            <View style={styles.dropdownContainer}>
                                <Text style={styles.dropdownText}>
                                    {formErrors.find(error => error.key === "category") !== undefined ?
                                        <Text style={Texts.errorText}>*</Text> : null}
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
                                        <Text style={Texts.errorText}>*</Text> : null}Cuenta:
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
                            <HorizontalLine />

                            <Dropdown
                                style={Inputs.fullDropdown}
                                data={periods}
                                value={period}
                                labelField="name"
                                valueField="value"
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                maxHeight={300}
                                placeholder="Seleccionar periodo"
                                onChange={item =>
                                {
                                    this._handleChange('period', item.value)
                                }}
                            />
                            {periodError ? <Text Text style={Texts.errorText}>{periodError}</Text> : null}

                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    value={hasEndDate}
                                    onValueChange={() => this.setState({ hasEndDate: !hasEndDate })}
                                    style={styles.checkbox}
                                /><Text style={styles.text}>¿Tiene fecha final?</Text>
                            </View>
                            {hasEndDate ?
                                <>
                                    <View style={Inputs.fullDropdown}>
                                        <TouchableOpacity onPress={() => this.setState({ showDateEndOf: true })} style={styles.datePicker}>
                                            <Text style={styles.dateData}>{dateEndOf?.toLocaleDateString('es-ES')}</Text>
                                        </TouchableOpacity >
                                        <DatePicker
                                            modal
                                            locale='es'
                                            open={showDateEndOf}
                                            date={dateEndOf}
                                            mode="date"
                                            onConfirm={(date) => this._handleDateChange('dateEndOf', date)}
                                            onCancel={() => { this.setState({ showDateEndOf: false }) }}
                                        />

                                    </View>
                                    <Text style={Texts.errorText}>{formErrors.find(e => e.key === "dateEndOf")?.value}</Text>
                                </>
                                : null}
                            <SubmitButton title="Guardar" onPress={() => this._editExpense()} />
                        </ScrollView>
                    }
                </ImageBackground>
            </SafeAreaView >
        );
    }
}




const mapStateToProps = ({ FixedExpenseReducer, AccountReducer, CategoryReducer }) =>
{

    const { fixedExpense, isLoadingFixedExpense } = FixedExpenseReducer;
    const { accounts, isLoadingAccounts } = AccountReducer;
    const { categories, isLoadingCategories } = CategoryReducer;
    return { fixedExpense, isLoadingFixedExpense, accounts, isLoadingAccounts, categories, isLoadingCategories };

};

const mapStateToPropsAction = {
    apiGetFixedExpenseById,
    apiPutExpenseById,
    apiGetCategoriesByType,
    apiGetAccounts
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkbox: {
        marginLeft: 25
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
        flexGrow: 0,
        width: "90%",
        height: "95%",
        paddingVertical: 20,
        borderRadius: 20,
        backgroundColor: 'rgba(236, 236, 236, .8)',

    }

});

export default connect(mapStateToProps, mapStateToPropsAction)(DetailsFixedExpenseScreen);

