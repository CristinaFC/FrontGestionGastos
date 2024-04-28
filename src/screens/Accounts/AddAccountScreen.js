
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import Header from '../../components/Header';
import { Views } from '../../assets/styles/Views';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormValidatorsManager from '../../utils/validators/FormValidatorsManager';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Color from '../../assets/styles/Colors';

import { TextInputValidator } from '../../components/TextInputValidator';
import { connect } from 'react-redux';
import { apiPostAccount } from '../../modules/Accounts/AccountActions'
import { HelpModal } from '../../components/Modals/HelpModal';
import { Texts } from '../../assets/styles/Texts';
import { Style } from '../../assets/styles/Style';

class AddAccountScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            name: '',
            icon: '',
            isBalance: false,
            formErrors: [],
            openModal: false,
            iconPressed: false,
            initAmount: '0'
        }
    }

    async _addAccount()
    {
        const { name, icon, isBalance, initAmount } = this.state
        const formErrors = FormValidatorsManager.formAccount({ name, icon, isBalance, initAmount })
        this.setState({ formErrors })
        if (formErrors.length === 0)
            await this.props.apiPostAccount({ name, icon, isBalance, initAmount });

    }

    _handleChange = (name, value) => { this.setState({ [name]: value }) }
    _handleSwitch() { this.setState({ isBalance: !this.state.isBalance }) }
    _handleModal() { this.setState({ openModal: !this.state.openModal }) }


    render()
    {
        const { name, icon, isBalance, openModal, formErrors, iconPressed, initAmount } = this.state

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true}
                    rightIcon="content-save"
                    rightAction={() => this._addAccount()}
                    title="Añadir cuenta" />
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
                        errorKey="amount"
                        inputValue={initAmount}
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
                    <HelpModal openModal={openModal} action={() => this._handleModal()} text="Todos los ingresos y los gastos relacionados con esta cuenta se reflejarán en el saldo total" />
                </View >

                {/* <Text style={Texts.inputTitle}>
                            {iconError != undefined ? <Text style={Texts.errorText}>*</Text> : null}Seleccionar un icono:
                        </Text>

                        <FlatList
                            style={{ height: 150, flexGrow: 0 }}
                            columnWrapperStyle={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', padding: "1%" }}
                            numColumns={6}
                            contentContainerStyle={{ width: "100%", justifyContent: 'center' }}
                            data={accountIcons}
                            renderItem={({ item }) =>
                                <TouchableOpacity style={(iconPressed && icon === item) ? styles.touchableIconSelected : styles.touchableIcon}
                                    onPress={() => this.setState({ iconPressed: true, icon: item })}>
                                    <MaterialCommunityIcons
                                        name={item} size={30}
                                        color={(iconPressed && icon === item) ? Color.button : Color.firstText} />
                                </TouchableOpacity>}
                        /> */}
            </SafeAreaView >
        );
    }
}


const mapStateToProps = ({ AccountReducer }) =>
{

    const { errors } = AccountReducer;

    return { errors };

};

const mapStateToPropsAction = {
    apiPostAccount
};


const styles = StyleSheet.create({

    iconHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },


    // touchableIcon: {
    //     borderWidth: 1,
    //     borderColor: Color.firstText,
    //     margin: "1%",
    //     alignItems: 'center',
    //     padding: 2,
    //     borderRadius: 10
    // },
    // touchableIconSelected: {
    //     borderWidth: 1,
    //     borderColor: Color.button,
    //     margin: "1%",
    //     alignItems: 'center',
    //     padding: 2,
    //     borderRadius: 10
    // },
});

export default connect(mapStateToProps, mapStateToPropsAction)(AddAccountScreen);