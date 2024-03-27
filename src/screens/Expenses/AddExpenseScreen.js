
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator, ScrollView } from 'react-native';
import Header from '../../components/Header';
import { Views } from '../../assets/styles/Views';
import { localAssets } from '../../assets/images/assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormValidatorsManager from '../../utils/validators/FormValidatorsManager';
import * as Color from '../../assets/styles/Colors';
import DatePicker from 'react-native-date-picker'

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
import Icon from 'react-native-vector-icons/FontAwesome5';

class AddExpenseScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            amount: '',
            account: '',
            category: '',
            type: 'Expenses',
            description: '',
            date: new Date(),
            formErrors: [],
            showDate: false,
            categoryModal: false,
        }
    }

    componentDidMount()
    {
        this.props.apiGetCategoriesByType("Expenses")
        this.props.apiGetAccounts()
    }

    _addExpense()
    {
        const account = this.state.account.uid
        const category = this.state.category.uid
        const amount = this.state.amount.replace(',', '.')
        let { description, date } = this.state

        const formErrors = FormValidatorsManager.formExpenseIncome({ date, amount, account, category, description })

        date = this.state.date.getFullYear() + "-"
            + ('0' + (this.state.date.getMonth() + 1)).slice(-2) + "-"
            + ('0' + this.state.date.getDate()).slice(-2)

        this.setState({ formErrors }, () =>
        {
            if (formErrors.length === 0)
                this.props.apiPostExpense({ date, amount, account, category, description });
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
            category, description, categoryModal,
            type, showDate, formErrors } = this.state

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
                    <TouchableOpacity onPress={() => this._addExpense()} style={[styles.categoryIcon,
                    {}]}>
                        <MaterialCommunityIcons name="content-save" size={Style.DEVICE_FIVE_PERCENT_WIDTH} color={Color.button} />
                    </TouchableOpacity >
                </ImageBackground>

                {
                    (isLoadingAccounts || isLoadingCategories) ? <ActivityIndicator /> :
                        <View style={styles.container} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
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
                                    style={{ width: Style.DEVICE_EIGHTY_PERCENT_WIDTH }}
                                />
                                <TouchableOpacity onPress={() => this.setState({ categoryModal: true })}
                                    style={[styles.categoryIcon, { borderColor: category ? Color.button : Color.firstText }]}>
                                    {category ?
                                        <MaterialCommunityIcons name={category.icon} size={Style.DEVICE_FIVE_PERCENT_WIDTH} color={Color.button} />
                                        : <Icon name="tag" size={Style.DEVICE_FIVE_PERCENT_WIDTH} color={Color.firstText} />
                                    }
                                    {formErrors.find(error => error.key === "category") !== undefined ?
                                        <Text style={{ color: Color.orange, textAlign: 'right' }}>*</Text> : null}
                                </TouchableOpacity >
                                <Modal
                                    visible={categoryModal}
                                    animationType="slide"
                                    transparent={true}
                                    onRequestClose={() => this.setState({ categoryModal: false })}
                                >
                                    <View style={styles.modalContainer}>
                                        <View style={styles.modalContent}>
                                            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => this.setState({ categoryModal: false })}>
                                                <MaterialCommunityIcons name="close" size={20} color={Color.orange} />
                                            </TouchableOpacity>

                                            <ScrollView>
                                                {categories && categories.length > 0 && categories.map(category => (
                                                    <TouchableOpacity
                                                        key={category.id}
                                                        onPress={() => this.setState({ categoryModal: false, category })}
                                                        style={styles.modalCategory}
                                                    >
                                                        <MaterialCommunityIcons name={category.icon} size={20} color={Color.button} />
                                                        <Text style={{ color: Color.firstText, marginLeft: 10 }}>{category.name}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
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
                                <Text style={[Texts.inputTitle]}>Fecha:</Text>
                                <View style={[Inputs.registerInput]}>
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
    categoryIcon: {
        borderWidth: 1,
        width: Style.DEVICE_TEN_PERCENT_WIDTH,
        height: Style.DEVICE_TEN_PERCENT_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: Color.white,
        flexDirection: 'row',
        backgroundColor: Color.white
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

export default connect(mapStateToProps, mapStateToPropsAction)(AddExpenseScreen);