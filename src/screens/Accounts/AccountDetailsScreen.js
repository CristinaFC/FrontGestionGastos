import React, { Component } from "react";
import { View, StyleSheet, ImageBackground, ActivityIndicator, SafeAreaView, Switch, Text, TouchableOpacity } from "react-native";
import
{
    apiPutAccountById,
    apiGetAccountById,
} from "../../modules/Accounts/AccountActions";
import { connect } from "react-redux";
import { Views } from "../../assets/styles/Views";
import Header from "../../components/Header";
import { localAssets } from "../../assets/images/assets";

import * as Color from '../../assets/styles/Colors'
import { Style } from "../../assets/styles/Style";
import { Texts } from "../../assets/styles/Texts";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { toTwoDecimals } from "../../services/api/Helpers";
import { TextInputValidator } from "../../components/TextInputValidator";
import FormValidatorsManager from "../../utils/validators/FormValidatorsManager";
import { HelpModal } from "../../components/Modals/HelpModal";

class AccountDetails extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            name: '',
            icon: '',
            initAmount: '0',
            formErrors: [],
            totalAmount: '',
            totalIncomes: '',
            totalExpenses: '',
            openModal: false,
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
        let initAmount = this.props.account?.initAmountRef?.amount
        totalIncomes = totalIncomes?.toString()
        totalExpenses = totalExpenses?.toString()
        totalAmount = totalAmount?.toString()
        this.setState({ name, icon, isBalance, totalExpenses, totalIncomes, totalAmount, initAmount: initAmount?.toString().replace('.', ',') })

    }

    _handleSubmit()
    {
        const { name, icon, isBalance, initAmount } = this.state
        const formErrors = FormValidatorsManager.formAccount({ name, icon, isBalance, initAmount })
        this.setState({ formErrors })

        if (formErrors.length === 0)
            this.props.apiPutAccountById(this.id, { name, icon, isBalance, initAmount });
    }
    _handleModal() { this.setState({ openModal: !this.state.openModal }) }
    _handleSwitch() { this.setState({ isBalance: !this.state.isBalance }) }
    render()
    {
        const { isLoadingAccount } = this.props;
        const { totalAmount, totalExpenses, totalIncomes } = this.props.account;

        const { name, initAmount, isBalance, formErrors, openModal } = this.state

        return (
            <View style={Views.container}>
                <Header goBack={true} title="Detalles" rightAction={() => this._handleSubmit()} rightIcon="content-save" />
                <ImageBackground source={localAssets.background} resizeMode="cover"
                    style={[Views.imageHeader, { paddingHorizontal: 0, paddingVertical: 0, height: 80 }]}
                    blurRadius={40}>
                    <Balance totalAmount={totalAmount} totalExpenses={totalExpenses} totalIncomes={totalIncomes} />
                </ImageBackground >
                <SafeAreaView style={styles.safeContainer}>
                    <View contentContainerStyle={Views.scrollview}>
                        {isLoadingAccount ? <ActivityIndicator /> :
                            <View style={Views.content}>
                                <View style={{ marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <TextInputValidator
                                        error={formErrors}
                                        errorKey="name"
                                        inputValue={name}
                                        keyboardType="ascii-capable"
                                        onChange={value => this._handleChange('name', value)}
                                        placeholder="Nombre de la cuenta"
                                        title="Nombre"
                                        style={{ width: Style.DEVICE_NINETY_PERCENT_WIDTH }}
                                    />
                                    <TextInputValidator
                                        error={formErrors}
                                        errorKey="initAmount"
                                        inputValue={initAmount}
                                        editable={false}
                                        keyboardType="numeric"
                                        onChange={value => this._handleChange('initAmount', value)}
                                        placeholder="Saldo inicial"
                                        title="Saldo inicial"
                                        errorStyle={{ marginBottom: 100 }}
                                        style={{ width: Style.DEVICE_NINETY_PERCENT_WIDTH }}
                                    />
                                    <View style={Views.swticherContainer}>
                                        <View style={{ flexDirection: 'row', height: 50, width: Style.DEVICE_HALF_WIDTH }}>
                                            <Text style={Texts.inputTitle}>Incluir con el saldo:
                                                <TouchableOpacity onPress={() => this._handleModal()} style={{ height: 17 }}>
                                                    <MaterialCommunityIcons name="help" size={10} color={Color.button} />
                                                </TouchableOpacity>
                                            </Text>
                                        </View>
                                        <Switch
                                            style
                                            trackColor={{ false: Color.orange, true: Color.button }}
                                            thumbColor={Color.white}
                                            onValueChange={() => this._handleSwitch()}
                                            value={isBalance}
                                        />
                                    </View>
                                </View>
                                <HelpModal openModal={openModal} action={() => this._handleModal()} text="Todos los ingresos y los gastos relacionados con esta cuenta se reflejarán en el saldo total" />
                            </View>}
                    </View>
                </SafeAreaView>
            </View >
        )

    }
}

const Balance = ({ totalAmount, totalExpenses, totalIncomes }) =>
{
    totalAmount = toTwoDecimals(totalAmount)
    totalExpenses = toTwoDecimals(totalExpenses)
    totalIncomes = toTwoDecimals(totalIncomes)

    return (
        <View style={styles.overviewContent}>
            <View style={styles.overview}>
                <Text style={styles.overviewTitle}>Saldo</Text>
                <Text style={totalAmount >= 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{totalAmount.replace('.', ',')}€
                </Text>
            </View>
            <View style={styles.overview}>
                <Text style={styles.overviewTitle}>Ingresos</Text>
                <Text style={totalIncomes > 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{totalIncomes.replace('.', ',')}€</Text>
            </View>
            <View style={styles.overview}>
                <Text style={styles.overviewTitle}>Gastos</Text>
                <Text style={totalExpenses <= 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{totalExpenses.replace('.', ',')}€</Text>
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
    },
    overview: {
        width: "32%",
        marginLeft: 2,
        height: "100%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Color.borderButton,
        backgroundColor: Color.white,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 5
    },
    overviewTitle: {
        fontSize: Style.FONT_SIZE_TITLE, color: Color.firstText, marginBottom: 5
    },
    overviewContent: {
        flexDirection: 'row',
        height: "100%",
        width: "100%",
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5
    },
});

const mapStateToProps = ({ AccountReducer, IncomeReducer, ExpenseReducer }) =>
{

    const { account, isLoadingAccount } = AccountReducer;

    return { account, isLoadingAccount };

};

const mapStateToPropsAction = {
    apiGetAccountById,
    apiPutAccountById,
};
export default connect(mapStateToProps, mapStateToPropsAction)(AccountDetails);
