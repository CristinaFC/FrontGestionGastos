import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, ActivityIndicator, Switch, SafeAreaView, ScrollView } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { accountIcons } from './constants';

import
{
    apiPutAccountById,
    apiGetAccountById,
    apiDeleteAccount,
    setAccountDataState,
    clearAccountData
} from "../../modules/Accounts/AccountActions";
import { connect } from "react-redux";
import * as Color from '../../assets/styles/Colors';
import { Views } from "../../assets/styles/Views";
import { TextInputValidator } from "../../components/TextInputValidator";
import SubmitButton from "../../components/SubmitButton";
import Header from "../../components/Header";
import { localAssets } from "../../assets/images/assets";

import FormValidatorsManager from "../../utils/validators/FormValidatorsManager";
import DatePicker from 'react-native-date-picker'
import { HelpModal } from "../../components/Modals/HelpModal";
import { Texts } from "../../assets/styles/Texts";
import { Style } from "../../assets/styles/Style";


class EditAccount extends Component
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
            isBalance: false,
            formErrors: [],
            openModal: false
        }
        this.id = props.route.params.id;
        // this.props.clearAccountData()
    }

    async componentDidMount()
    {
        await this._getAccount()
    }

    async _getAccount()
    {
        await this.props.apiGetAccountById(this.id);
        let { name, icon, isBalance, totalExpenses, totalIncomes, totalAmount } = this.props.account
        totalIncomes = totalIncomes.toString()
        totalExpenses = totalExpenses.toString()
        totalAmount = totalAmount.toString()
        this.setState({ name, icon, isBalance, totalExpenses, totalIncomes, totalAmount })
    }

    _handleSubmit()
    {
        const { name, icon, isBalance } = this.state
        const formErrors = FormValidatorsManager.formAccount({ name, icon, isBalance })

        this.setState({ formErrors })

        if (formErrors.length === 0)
            this.props.apiPutAccountById(this.id, { name, icon, isBalance });
    }

    _handleChange = (name, value) => { this.setState({ [name]: value }) }
    _handleSwitch() { this.setState({ isBalance: !this.state.isBalance }) }
    _handleModal() { this.setState({ openModal: !this.state.openModal }) }
    _deleteAccount() { this.props.apiDeleteAccount(this.id) }

    render()
    {
        const { isLoadingAccount } = this.props;

        const { formErrors, name, icon, openModal, isBalance } = this.state;

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Editar cuenta" rightAction={() => this._deleteAccount()} rightIcon="delete" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>


                    {isLoadingAccount ? <ActivityIndicator /> :
                        <View style={styles.form}>
                            <TextInputValidator
                                error={formErrors}
                                errorKey="name"
                                inputValue={name}
                                keyboardType="ascii-capable"
                                onChange={value => this._handleChange('name', value)}
                                placeholder="Nombre de la cuenta"
                                title="Nombre:"
                            />
                            <View style={styles.switcher}>
                                <View style={{ flexDirection: 'row', height: 50 }}>
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
                            <HelpModal openModal={openModal} action={() => this._handleModal()} text="Todos los ingresos y los gastos relacionados con esta cuenta se reflejarán en el saldo total" />



                            <Text style={Texts.inputTitle}>{icon === "" ?
                                <Text style={Texts.errorText}>*</Text> : null}Seleccionar un icono:</Text>
                            {accountIcons.forEach((item) =>
                            {

                                return (
                                    <TouchableOpacity
                                        style={(icon === item) ? styles.touchableIconSelected : styles.touchableIcon}
                                        onPress={() => this.setState({ icon: item })}>
                                        <MaterialCommunityIcons
                                            name={item} size={30}
                                            color={(icon === item) ? Color.button : Color.firstText} />
                                    </TouchableOpacity>
                                )
                            })}
                            <FlatList
                                style={{ height: 150, flexGrow: 0, marginTop: "5%" }}
                                columnWrapperStyle={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', padding: "1%" }}
                                numColumns={6}
                                contentContainerStyle={{ width: "100%", justifyContent: 'center' }}
                                data={accountIcons}
                                renderItem={({ item }) =>
                                    <TouchableOpacity style={(icon === item) ? styles.touchableIconSelected : styles.touchableIcon}
                                        onPress={() => this.setState({ icon: item })}>
                                        <MaterialCommunityIcons
                                            name={item} size={30}
                                            color={(icon === item) ? Color.button : Color.firstText} />
                                    </TouchableOpacity>}
                            />

                            <SubmitButton title="Guardar" onPress={() => this._handleSubmit()} />
                        </View>}
                </ImageBackground >
            </SafeAreaView >
        )

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollview: {
        width: Style.DEVICE_WIDTH,
        flexDirection: 'column',
        alignItems: 'center'
    },
    switcher: {
        flexDirection: 'row',
        height: 20,
        marginTop: 50,
        marginBottom: 20,
        width: "80%",
        justifyContent: 'space-between'
    },
    form: {
        width: Style.DEVICE_EIGHTY_PERCENT_WIDTH,
        height: 360,
        paddingVertical: 40,
        marginTop: "10%",
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: 'rgba(236, 236, 236, .8)',
    },
    touchableIcon: {
        borderWidth: 1,
        borderColor: Color.firstText,
        margin: "1%",
        alignItems: 'center',
        padding: 2,
        borderRadius: 10
    },
    touchableIconSelected: {
        borderWidth: 1,
        borderColor: Color.button,
        margin: "1%",
        alignItems: 'center',
        padding: 2,
        borderRadius: 10
    },
});

const mapStateToProps = ({ AccountReducer, }) =>
{

    const { account, isLoadingAccount } = AccountReducer;

    return { account, isLoadingAccount };

};

const mapStateToPropsAction = {
    apiGetAccountById,
    apiPutAccountById,
    apiDeleteAccount,
    setAccountDataState,
    clearAccountData
};
export default connect(mapStateToProps, mapStateToPropsAction)(EditAccount);
