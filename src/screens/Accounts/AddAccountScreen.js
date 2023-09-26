
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Text, View, FlatList, TouchableOpacity, Switch, Pressable } from 'react-native';
import Header from '../../components/Header';
import { Views } from '../../assets/styles/Views';
import { localAssets } from '../../assets/images/assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormValidatorsManager from '../../utils/validators/FormValidatorsManager';
import { accountIcons } from './constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Color from '../../assets/styles/Colors';

import { TextInputValidator } from '../../components/TextInputValidator';
import SubmitButton from '../../components/SubmitButton';
import { connect } from 'react-redux';
import DatePicker from 'react-native-date-picker'
import { apiPostAccount } from '../../modules/Accounts/AccountActions'
import { HelpModal } from '../../components/Modals/HelpModal';
import { Texts } from '../../assets/styles/Texts';

class AddAccountScreen extends Component
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
            openModal: false,
            iconPressed: false,
        }
    }

    _addAccount()
    {
        const { name, icon, isBalance } = this.state
        const formErrors = FormValidatorsManager.formAccount({ name, icon, isBalance })

        this.setState({ formErrors })

        if (formErrors.length === 0)
            this.props.apiPostAccount({ name, icon, isBalance });

    }

    _handleChange = (name, value) => { this.setState({ [name]: value }) }
    _handleSwitch() { this.setState({ isBalance: !this.state.isBalance }) }
    _handleModal() { this.setState({ openModal: !this.state.openModal }) }


    render()
    {
        const { name, icon, isBalance, openModal, formErrors, iconPressed } = this.state
        const iconError = formErrors.find(error => error.key === 'icon')

        return (
            <SafeAreaView style={styles.container} >
                <Header title="Añadir cuenta" goBack={true} />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
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

                        <Text style={Texts.inputTitle}>
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
                        />
                        <SubmitButton title="Añadir" onPress={() => this._addAccount()} />
                    </View>
                </ImageBackground>
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

    container: {
        flex: 1,
        alignItems: 'center',
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
        width: "80%",
        height: 360,
        paddingVertical: 15,
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

export default connect(mapStateToProps, mapStateToPropsAction)(AddAccountScreen);