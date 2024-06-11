
import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { apiGetAccounts, apiDeleteAccount, apiTransfer } from '../../modules/Accounts/AccountActions';
import * as Color from '../../assets/styles/Colors';
import Header from '../../components/Header';
import { connect } from 'react-redux';
import { Views } from '../../assets/styles/Views';
import { Dropdown } from 'react-native-element-dropdown';
import { Dropdown as DropdownStyle } from '../../assets/styles/Dropdown';
import { Style } from '../../assets/styles/Style';
import SubmitButton from '../../components/SubmitButton';
import { TextInputValidator } from '../../components/TextInputValidator';
import { Texts } from '../../assets/styles/Texts';
import ConceptAndCategory from '../../components/ConceptAndCategory';
import { apiGetCategories } from '../../modules/Category/CategoryActions';
import FormValidatorsManager from '../../utils/validators/FormValidatorsManager';

class AccountTransferScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            warning: false,
            fromAccount: '',
            toAccount: '',
            concept: '',
            amount: '',
            formErrors: []
        }
    }

    componentDidMount()
    {
        this._getData()
    }

    async _getData()
    {
        await this.props.apiGetAccounts();
        await this.props.apiGetCategories()
    }

    async _deleteAccount(accountId)
    {
        await this.props.apiDeleteAccount(accountId);
    }

    _handleChange = (name, value) => { this.setState({ [name]: value }) }
    _handleSubmit = () =>
    {
        const { fromAccount, toAccount, concept } = this.state;
        const amount = this.state.amount.replace(',', '.')
        const formErrors = FormValidatorsManager.formTranfer({ fromAccount, toAccount, amount, concept })
        this.setState({ formErrors })
        if (formErrors.length == 0)
            this.props.apiTransfer({ fromAccount: fromAccount.uid, toAccount: toAccount.uid, amount, concept })
    }

    render()
    {
        const { isLoadingAccounts, accounts, categories } = this.props;
        const { fromAccount, toAccount, amount, formErrors = [], concept } = this.state
        const sameAccountError = formErrors.find(err => err.key === 'sameAccount')?.value
        return (
            <View style={Views.container}>
                <Header
                    goBack={true}
                    title="Transferencia" />

                {isLoadingAccounts
                    ? <ActivityIndicator />
                    : <View style={Views.container}>
                        {accounts && categories &&
                            <View style={styles.container}>
                                <TextInputValidator
                                    multiline={true}
                                    numberOfLines={4}
                                    error={formErrors}
                                    errorKey="concept"
                                    inputValue={concept}
                                    keyboardType="ascii-capable"
                                    onChange={value => this._handleChange('concept', value)}
                                    placeholder="Concepto"
                                    title="Concepto"
                                    style={styles.input}
                                />

                                <TextInputValidator
                                    error={formErrors}
                                    errorKey="amount"
                                    inputValue={amount}
                                    keyboardType="numeric"
                                    onChange={value =>
                                    {
                                        this._handleChange('amount', value)
                                    }}
                                    placeholder="Cantidad"
                                    title="Cantidad"
                                    errorStyle={{ marginBottom: 100 }}
                                    style={styles.input}
                                />
                                <Text style={[Texts.inputTitle, { width: Style.DEVICE_NINETY_PERCENT_WIDTH, marginTop: 10 }]}>Cuenta origen</Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    data={accounts}
                                    value={fromAccount}
                                    placeholderStyle={DropdownStyle.placeholderStyle}
                                    labelField="name"
                                    valueField="uid"
                                    maxHeight={300}
                                    placeholder="Cuenta origen"
                                    onChange={(value) => this._handleChange('fromAccount', value)}
                                />
                                <Text style={[Texts.inputTitle, { width: Style.DEVICE_NINETY_PERCENT_WIDTH, marginTop: 20 }]}>Cuenta destino</Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    data={accounts}
                                    value={toAccount}
                                    placeholderStyle={DropdownStyle.placeholderStyle}
                                    labelField="name"
                                    valueField="uid"
                                    maxHeight={300}
                                    placeholder="Cuenta destino"
                                    onChange={(value) => this._handleChange('toAccount', value)}
                                />
                                {formErrors.length > 0 && <Text style={[Texts.errorText, { width: Style.DEVICE_NINETY_PERCENT_WIDTH, }]}>{sameAccountError}</Text>}

                                <SubmitButton title="Transferir" onPress={() => this._handleSubmit()} />
                            </View>
                        }

                    </View>
                }

            </View>
        )

    }
}

const styles = StyleSheet.create({
    dropdown: {
        width: Style.DEVICE_NINETY_PERCENT_WIDTH,
        height: 45,
        borderBottomWidth: 1,
        borderColor: Color.firstText
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10
    },
    input: {
        width: Style.DEVICE_NINETY_PERCENT_WIDTH
    }
})

const mapStateToProps = ({ AccountReducer, CategoryReducer }) =>
{
    const { isLoadingCategories, categories } = CategoryReducer
    const { isLoadingAccounts, accounts } = AccountReducer;

    return { isLoadingAccounts, accounts, isLoadingCategories, categories };

};

const mapStateToPropsAction = {
    apiGetAccounts,
    apiDeleteAccount,
    apiGetCategories,
    apiTransfer
};




export default connect(mapStateToProps, mapStateToPropsAction)(AccountTransferScreen);