
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import Header from '../../components/Header';
import { Views } from '../../assets/styles/Views';
import { localAssets } from '../../assets/images/assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormValidatorsManager from '../../utils/validators/FormValidatorsManager';
import * as Color from '../../assets/styles/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import CheckBox from '@react-native-community/checkbox';

import { TextInputValidator } from '../../components/TextInputValidator';
import { connect } from 'react-redux';
import { apiPostRecipient, apiGetRecipients } from '../../modules/Recipients/RecipientActions';

import { apiPostFixedExpense } from '../../modules/FixedExpenses/FixedExpenseActions';
import { Dropdown } from 'react-native-element-dropdown';

import { apiGetAccounts } from '../../modules/Accounts/AccountActions';
import { apiGetCategoriesByType } from '../../modules/Category/CategoryActions';
import { Periods } from '../Expenses/constants';
import { Inputs } from '../../assets/styles/Inputs';
import { Texts } from '../../assets/styles/Texts';
import { Style } from '../../assets/styles/Style';
import { Icons } from '../../assets/styles/Icons';
import ConceptAndCategory from '../../components/ConceptAndCategory';
import DateInput from '../../components/DateInput';
import RecipientForm from '../../components/RecipientForm';

class AddFixedExpenseScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            amount: '',
            account: '',
            category: '',
            concept: '',
            initDate: new Date(),
            formErrors: [],
            period: '',
            hasEndDate: false,
            endDate: new Date(),
            showCategoriesModal: false,
            recipientModal: false,
            recipient: ''
        }
    }
    componentDidMount()
    {
        this.props.apiGetCategoriesByType("Expenses")
        this.props.apiGetAccounts()
        this.props.apiGetRecipients()
        this.setState({ recipients: this.props.recipients })
    }

    _addRecipient(fields)
    {
        this.props.apiPostRecipient(fields)
    }
    _addExpense()
    {
        const account = this.state.account.uid
        const category = this.state.category.uid
        const amount = this.state.amount.replace(',', '.')

        let { concept, hasEndDate, period, endDate, initDate, recipient } = this.state
        const formErrors = FormValidatorsManager.formFixedExpense({
            initDate, amount, account, category, hasEndDate, endDate, period, concept
        })

        initDate = this.state.initDate.getFullYear() + "-"
            + ('0' + (this.state.initDate.getMonth() + 1)).slice(-2) + "-"
            + ('0' + this.state.initDate.getDate()).slice(-2)
        endDate = hasEndDate ? this.state.endDate.getFullYear() + "-"
            + ('0' + (this.state.endDate.getMonth() + 1)).slice(-2) + "-"
            + ('0' + this.state.endDate.getDate()).slice(-2) : null

        if (!hasEndDate) endDate = null

        let dataToSend = {
            initDate,
            amount,
            account,
            category,
            concept,
            period,
            hasEndDate,
            recipient
        };

        if (hasEndDate) dataToSend.endDate = endDate;

        this.setState({ formErrors }, () =>
        {
            if (formErrors.length === 0)
                this.props.apiPostFixedExpense(dataToSend);
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
        const { initDate, amount, account, category, concept, recipient,
            formErrors, period, hasEndDate, endDate, recipientModal, recipients } = this.state

        const { accounts, categories, isLoadingAccounts, isLoadingCategories, isLoadingRecipients } = this.props

        const initDateError = formErrors.find(error => error.key === "initDate")
        const endDateError = formErrors.find(error => error.key === "endDate")
        return (
            <SafeAreaView style={Views.container}>
                <Header title="Añadir gasto" goBack={true} />
                <ImageBackground source={localAssets.background} resizeMode="cover"
                    style={[Views.imageHeader, styles.iconHeader, { height: 50 }]} blurRadius={40}>
                    <TouchableOpacity onPress={() => this._addExpense()} style={Icons.headerSaveIcon}>
                        <MaterialCommunityIcons name="content-save" size={Style.DEVICE_FIVE_PERCENT_WIDTH} color={Color.button} />
                    </TouchableOpacity >
                </ImageBackground>


                {isLoadingCategories || isLoadingAccounts || isLoadingRecipients ? <ActivityIndicator /> :
                    <ScrollView style={{ marginTop: 10, }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} >
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
                        <View style={{ width: Style.DEVICE_NINETY_PERCENT_WIDTH }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: Style.DEVICE_NINETY_PERCENT_WIDTH }}>
                                <DateInput
                                    date={initDate}
                                    onChange={(date) => { this._handleDateChange('initDate', date) }}
                                    style={{ width: Style.DEVICE_FORTY_PERCENT_WIDTH }}
                                    title='Fecha Inicio'
                                />
                                <DateInput
                                    date={endDate}
                                    onChange={(date) => { this._handleDateChange('endDate', date) }}
                                    style={{ width: Style.DEVICE_FORTY_PERCENT_WIDTH }}
                                    title='Fecha Fin'
                                    disabled={!hasEndDate}
                                />
                            </View>
                            {initDateError !== undefined ?
                                <Text style={Texts.errorText}>{initDateError.value}</Text> : null}
                            {endDateError !== undefined ?
                                <Text style={Texts.errorText}>{endDateError.value}</Text> : null}
                        </View>

                        <View style={styles.checkboxContainer}>
                            <CheckBox
                                value={hasEndDate}
                                onValueChange={() => this.setState({ hasEndDate: !hasEndDate })}
                            /><Text style={styles.text}>¿Tiene fecha final?</Text>
                        </View>
                        <View style={{ width: Style.DEVICE_NINETY_PERCENT_WIDTH, marginTop: 10 }}>
                            <Text style={Texts.inputTitle}>
                                {formErrors.find(error => error.key === "period") !== undefined ?
                                    <Text style={Texts.errorText}>*</Text> : null}Periodo:
                            </Text>
                            <Dropdown
                                style={Inputs.fullDropdown}
                                data={Periods}
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
                        </View>
                        <View style={{ width: Style.DEVICE_NINETY_PERCENT_WIDTH, marginTop: 10 }}>
                            <Text style={Texts.inputTitle}>
                                {formErrors.find(error => error.key === "account") !== undefined ?
                                    <Text style={Texts.errorText}>*</Text> : null}Cuenta:
                            </Text>
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
                        <View style={styles.recipientContainer}>
                            <View style={{ flexDirection: 'column', width: Style.DEVICE_EIGHTY_PERCENT_WIDTH }}>
                                <Text style={Texts.inputTitle}>
                                    {formErrors.find(error => error.key === "recipient") !== undefined ?
                                        <Text style={Texts.errorText}>*</Text> : null}Destinatario:
                                </Text>

                                <Dropdown
                                    style={Inputs.fullDropdown}
                                    data={recipients}
                                    value={recipient}
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
                            <TouchableOpacity onPress={() => this.setState({ recipientModal: true })} style={styles.addRecipientButton}>
                                <MaterialCommunityIcons name="plus" size={25} color={Color.button} />
                            </TouchableOpacity >
                        </View>
                        <Modal
                            visible={recipientModal}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => this.setState({ recipientModal: false })}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <RecipientForm
                                        onSubmit={(fields) =>
                                        {
                                            this._addRecipient(fields);
                                            this.setState({ recipientModal: false });
                                            this.props.apiGetRecipients()
                                        }}
                                        recipient={null}
                                        title="Nuevo destinatario"
                                        closeModal={() => this.setState({ recipientModal: false })}
                                    />
                                </View>
                            </View>

                        </Modal>
                    </ScrollView>
                }
            </SafeAreaView >
        );
    }
}

const mapStateToProps = ({ AccountReducer, CategoryReducer, RecipientReducer }) =>
{

    const { accounts, isLoadingAccounts } = AccountReducer;
    const { categories, isLoadingCategories } = CategoryReducer
    const { recipients, isLoadingRecipients } = RecipientReducer

    return {
        accounts, categories, isLoadingAccounts, isLoadingCategories,
        recipients, isLoadingRecipients
    };

};

const mapStateToPropsAction = {
    apiPostFixedExpense,
    apiPostRecipient,
    apiGetRecipients,
    apiGetCategoriesByType,
    apiGetAccounts,
};


const styles = StyleSheet.create({
    iconHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    checkboxContainer: {
        width: Style.DEVICE_NINETY_PERCENT_WIDTH,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 5
    },

    recipientContainer:
    {
        width: Style.DEVICE_NINETY_PERCENT_WIDTH,
        marginTop: 20,
        marginBottom: 50,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },

    addRecipientButton:
    {
        borderWidth: 2,
        borderRadius: 100,
        borderColor: Color.button
    },
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
    text: {
        color: Color.firstText,
        fontSize: 16,
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

    form: {
        flexGrow: 0,
        width: "90%",
        height: "95%",
        paddingVertical: 20,
        borderRadius: 20,
        backgroundColor: 'rgba(236, 236, 236, .8)',

    }

});

export default connect(mapStateToProps, mapStateToPropsAction)(AddFixedExpenseScreen);