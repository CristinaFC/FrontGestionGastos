import React, { Component } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, ImageBackground, View, Pressable, ActivityIndicator } from 'react-native';
import Routing from '../../navigation/Routing';

import { apiPostLogin, setAuthDataState, clearDataLogin } from '../../modules/Auth/AuthActions';
import SubmitButton from '../../components/SubmitButton';

import { TextInputValidator } from '../../components/TextInputValidator';
import { Forms } from '../../assets/styles/Forms';
import * as Color from '../../assets/styles/Colors';

import { fadeIn } from '../../assets/styles/Animation'
import { useNavigation } from '@react-navigation/native';
import FormValidatorsManager from '../../utils/validators/FormValidatorsManager';

import { connect } from 'react-redux';
import { localAssets } from '../../assets/images/assets';
import { Views } from '../../assets/styles/Views';


class LoginScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: [],
            formErrors: []
        };
        this.fadeAnim = new Animated.Value(0);
    }


    componentDidMount()
    {
        fadeIn(this.fadeAnim);
        this.props.clearDataLogin()
    }

    _setData(formErrors)
    {
        this.props.setLoginDataState({ prop: 'formErrors', value: formErrors })
        this.setState({ formErrors })
    }

    _apiPostLogin()
    {
        const { email, password } = this.state
        const formErrors = FormValidatorsManager.formLogin({ email, password });

        this._setData(formErrors);
        if (formErrors === null) this.props.apiPostLogin()
    }

    _handleChange = (name, value) =>
    {
        this.props.setLoginDataState({ prop: name, value: value })
        this.setState({ [name]: value })
    }


    render()
    {
        const { formErrors, isLoading } = this.props
        let invalidEmailOrPassword = formErrors?.find(error => error.status === 401) || []

        return (
            <SafeAreaView style={styles.container} >
                <ImageBackground source={localAssets.background} resizeMode="cover" style={styles.image} blurRadius={40}>
                    {isLoading ?
                        <ActivityIndicator />
                        : <Animated.View style={[styles.fadingContainer, { opacity: this.fadeAnim, }, styles.container]}>

                            <View style={Forms.loginFormContainer}>
                                {invalidEmailOrPassword ?
                                    <Text style={{ color: Color.orange, marginTop: 10 }}>
                                        {invalidEmailOrPassword?.message}
                                    </Text>
                                    : null
                                }
                                <TextInputValidator
                                    error={formErrors}
                                    errorKey="email"
                                    inputValue={this.state.email}
                                    keyboardType="email-address"
                                    onChange={value => this._handleChange('email', value)}
                                    placeholder="Email"
                                    title="Email"
                                />
                                <TextInputValidator
                                    error={formErrors}
                                    errorKey="password"
                                    inputValue={this.state.password}
                                    keyboardType="ascii-capable"
                                    onChange={value => this._handleChange('password', value)}
                                    placeholder="Contraseña"
                                    secureTextEntry={true}
                                    title="Contraseña"
                                />
                                <ForgotPassword formErrors={formErrors} />
                                <SubmitButton
                                    title={"Iniciar sesión"}
                                    onPress={() => this._apiPostLogin()}
                                />

                            </View>
                        </Animated.View>
                    }

                </ImageBackground >

            </SafeAreaView >
        );
    }
}



const ForgotPassword = ({ formErrors }) =>
{
    const navigation = useNavigation()

    return (
        <Pressable
            style={{ alignSelf: 'flex-end', marginRight: '12%', marginTop: formErrors?.length > 0 ? 50 : "5%" }}
            onPress={() => navigation.navigate(Routing.forgotPassword)}
        ><Text>¿Has olvidado tu contraseña?</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const mapStateToProps = ({ AuthReducer }) =>
{

    const { errors, formErrors, isLoading } = AuthReducer;

    return { errors, formErrors, isLoading };

};

const mapStateToPropsAction = {
    apiPostLogin,
    setLoginDataState: setAuthDataState,
    clearDataLogin
};
export default connect(mapStateToProps, mapStateToPropsAction)(LoginScreen);