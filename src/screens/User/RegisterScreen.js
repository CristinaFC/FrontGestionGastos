import React, { Component } from 'react';
import { Animated, SafeAreaView, StyleSheet, View, Text, ImageBackground } from 'react-native';
import SubmitButton from '../../components/SubmitButton';

import { Forms } from '../../assets/styles/Forms';
import * as Color from '../../assets/styles/Colors';

import { apiPostUser, setUserDataState, clearDataUser } from '../../modules/User/UserActions';

import { connect } from 'react-redux';
import { fadeIn } from '../../assets/styles/Animation';
import * as RootRouting from '../../navigation/RootRouting'

import { TextInputValidator } from '../../components/TextInputValidator';
import FormValidatorsManager from '../../utils/validators/FormValidatorsManager';
import Routing from '../../navigation/Routing';
import SuccessModal from '../../components/Modals/SuccessModal';
import { localAssets } from '../../assets/images/assets';
import { Views } from '../../assets/styles/Views';
import { Style } from '../../assets/styles/Style';


class RegisterScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            name: '',
            lastName: '',
            email: '',
            password: '',
            formErrors: [],
        };
        this.fadeAnim = new Animated.Value(0);
        this._apiPostUser = this._apiPostUser.bind(this);
    }

    componentDidMount()
    {
        fadeIn(this.fadeAnim);
        this.props.clearDataUser()
    }


    _apiPostUser()
    {
        const { name, lastName, email, password } = this.state

        const formErrors = FormValidatorsManager.formRegister({ name, lastName, email, password });

        this.setState({ formErrors })

        if (formErrors === null) this.props.apiPostUser({ name, lastName, email, password });


    }


    _handleChange = (name, value) =>
    {
        this.props.setUserDataState({ prop: name, value: value })
        this.setState({ [name]: value })
    }

    render()
    {

        const { errors = [], registerSuccess } = this.props
        const { formErrors } = this.state

        let errorEntityAlreadyExists;
        if (errors instanceof Array)
            errorEntityAlreadyExists = errors.find(error => error.status === 409)

        return (

            <SafeAreaView style={styles.container}>
                <ImageBackground source={localAssets.background} resizeMode="cover" style={styles.image} blurRadius={40}>
                    <Animated.View style={[styles.fadingContainer, { opacity: this.fadeAnim, }, styles.container]}>
                        {registerSuccess ?
                            <SuccessModal
                                text="Su cuenta se ha creado correctamente"
                                buttom="Iniciar sesión"
                                onPress={() => { RootRouting.navigate(Routing.login), this.props.setUserDataState({ prop: 'registerSuccess', value: false }) }} /> : null}
                        <View style={Forms.registerFormContainer}>

                            <TextInputValidator
                                error={formErrors}
                                errorText={'Campo obligatorio'}
                                errorKey="name"
                                inputValue={this.state.name}
                                keyboardType="ascii-capable"
                                onChange={value => this._handleChange('name', value)}
                                placeholder="Nombre"
                                title="Nombre"
                                style={{ width: Style.DEVICE_EIGHTY_PERCENT_WIDTH }}
                            />

                            <TextInputValidator
                                error={formErrors}
                                errorKey="lastName"
                                errorText={'Campo obligatorio'}
                                inputValue={this.state.lastName}
                                keyboardType="ascii-capable"
                                onChange={value => this._handleChange('lastName', value)}
                                placeholder="Apellido"
                                title="Apellido"
                                style={{ width: Style.DEVICE_EIGHTY_PERCENT_WIDTH }}
                            />

                            <TextInputValidator
                                error={formErrors}
                                errorKey="email"
                                // errorText={'Formato de email no válido'}
                                inputValue={this.state.email}
                                keyboardType="email-address"
                                onChange={value => this._handleChange('email', value)}
                                placeholder="Email"
                                title="Email"
                                style={{ width: Style.DEVICE_EIGHTY_PERCENT_WIDTH }}
                            />

                            <TextInputValidator
                                error={formErrors}
                                errorKey="password"
                                errorText={'La contraseña debe contener al menos 6 caracteres'}
                                inputValue={this.state.password}
                                keyboardType="ascii-capable"
                                onChange={value => this._handleChange('password', value)}
                                placeholder="Contraseña"
                                secureTextEntry={true}
                                title="Contraseña"
                                style={{ width: Style.DEVICE_EIGHTY_PERCENT_WIDTH }}
                            />
                            {errorEntityAlreadyExists !== undefined ?
                                <Text style={{ color: Color.orange, marginTop: '10%' }}>
                                    {errorEntityAlreadyExists.message}
                                </Text>
                                : null}
                            <SubmitButton
                                title="Crear cuenta"
                                onPress={() => { this._apiPostUser() }} />
                        </View>
                    </Animated.View>
                </ImageBackground>
            </ SafeAreaView>
        );

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        width: '100%',

        alignItems: 'center',
        justifyContent: 'center',
    },
});

const mapStateToProps = ({ UserReducer }) =>
{

    const { errors, formErrors, registerSuccess } = UserReducer;

    return { formErrors, errors, registerSuccess }

};

const mapStateToPropsAction = {
    apiPostUser,
    setUserDataState,
    clearDataUser
};

export default connect(mapStateToProps, mapStateToPropsAction)(RegisterScreen)
