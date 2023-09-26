
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Switch } from 'react-native';
import * as Color from '../../assets/styles/Colors';
import { Views } from '../../assets/styles/Views';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import { FlatList } from 'react-native-gesture-handler';
import { apiGetExpenseById, apiPutExpenseById } from '../../modules/Expense/ExpenseActions';
import { apiGetAccounts } from '../../modules/Accounts/AccountActions';
import { apiGetCategoriesByType } from '../../modules/Category/CategoryActions';

import { connect } from 'react-redux';
import { Item } from '../../components/Item';
import { Dropdown } from 'react-native-element-dropdown';
import { TextInputValidator } from '../../components/TextInputValidator';
import DatePicker from 'react-native-date-picker'
import SubmitButton from '../../components/SubmitButton';
import FormValidatorsManager from '../../utils/validators/FormValidatorsManager';
import { ExpenseForm } from '../../components/ExpenseForm';


class DetailsExpenseScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            amount: '',
            description: '',
            date: new Date(),
            category: [],
            account: [],
            formErrors: [],
            showDate: false,
            fixed: false
        }
        this.id = props.route.params.id;

    }
    async _getData()
    {
        await this.props.apiGetExpenseById(this.id);
        let { amount, description, date, category, account, fixed } = this.props.expense
        date = new Date(date)
        amount = amount.toString().replace('.', ',')

        this.setState({ amount, description, date, category, account, fixed })
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
    _handleDateChange(value)
    {
        this.setState({
            date: value,
            showDate: false
        });

    }

    _editExpense()
    {
        const date =
            this.state.date.getFullYear() + "-"
            + ('0' + (this.state.date.getMonth() + 1)).slice(-2) + "-"
            + ('0' + this.state.date.getDate()).slice(-2)

        const amount = this.state.amount.replace(',', '.')

        const account = this.state.account._id ? this.state.account._id : this.state.account.uid
        const category = this.state.category._id ? this.state.category._id : this.state.category.uid
        const { description, fixed } = this.state

        const formErrors = FormValidatorsManager.formExpenseIncome({ amount, account, category, description })
        this.setState({ formErrors })

        if (formErrors.length === 0)
            this.props.apiPutExpenseById(this.id, { date, amount, account, category, description, fixed });
    }

    render()
    {
        const { isLoadingExpense, categories, accounts } = this.props;
        const { amount, description, date, category, account, formErrors, showDate, fixed } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <Header goBack={true} title="Detalles" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    {isLoadingExpense
                        ? <ActivityIndicator />
                        :

                        <View style={styles.form}>

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
                            <View style={{ width: "100%", marginVertical: 35, height: 30, alignItems: "center" }}>

                                <Text style={styles.text}>Fecha:</Text>
                                <TouchableOpacity onPress={() => this.setState({ showDate: true })} style={styles.datePicker}>
                                    <Text style={styles.dateData}>{date.toLocaleDateString('es-ES')}</Text>
                                </TouchableOpacity >
                                <DatePicker
                                    modal
                                    locale='es'
                                    open={showDate}
                                    date={date}
                                    mode="date"
                                    onConfirm={(date) => { this._handleDateChange(date) }}
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
                                    style={styles.dropdown}
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
                                    style={styles.dropdown}
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
                            <SubmitButton title="Guardar" onPress={() => this._editExpense()} />
                        </View>
                    }
                </ImageBackground>
            </SafeAreaView >
        );
    }
}




const mapStateToProps = ({ ExpenseReducer, AccountReducer, CategoryReducer }) =>
{

    const { expense, isLoadingExpense } = ExpenseReducer;
    const { accounts } = AccountReducer;
    const { categories } = CategoryReducer;
    return { expense, isLoadingExpense, accounts, categories };

};

const mapStateToPropsAction = {
    apiGetExpenseById,
    apiPutExpenseById,
    apiGetCategoriesByType,
    apiGetAccounts
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
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
    },
    switcher: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "80%",
        marginTop: 25,
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

export default connect(mapStateToProps, mapStateToPropsAction)(DetailsExpenseScreen);

