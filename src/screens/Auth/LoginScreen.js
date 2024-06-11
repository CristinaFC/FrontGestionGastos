import React, { Component } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, ImageBackground, View, Pressable, ActivityIndicator } from 'react-native';
import Routing from '../../navigation/Routing';
import SplashScreen from 'react-native-splash-screen'

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
import { Style } from '../../assets/styles/Style';


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
        SplashScreen.hide();
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
        let invalidEmailOrPassword = formErrors?.find(error => error.status === 401)
        let notFoundUser = formErrors?.find(error => error.status === 404)
        return (
            <SafeAreaView style={styles.container} >
                {isLoading ?
                    <ActivityIndicator />
                    : <Animated.View style={[styles.fadingContainer, { opacity: this.fadeAnim, }, styles.container]}>

                        <View style={Forms.loginFormContainer}>
                            {notFoundUser &&
                                <Text style={{ color: Color.orange, marginTop: 10 }}>
                                    {notFoundUser?.message}
                                </Text>

                            }
                            <TextInputValidator
                                error={formErrors}
                                errorKey="email"
                                inputValue={this.state.email}
                                keyboardType="email-address"
                                onChange={value => this._handleChange('email', value)}
                                placeholder="Email"
                                title="Email"
                                style={{ width: "90%" }}
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
                                style={{ width: "90%", marginBottom: 5 }}
                            />
                            {invalidEmailOrPassword &&
                                <Text style={{ color: Color.orange, width: "90%" }}>
                                    {invalidEmailOrPassword?.message}
                                </Text>
                            }
                            {/* <ForgotPassword formErrors={formErrors} /> */}
                            <SubmitButton
                                title={"Iniciar sesión"}
                                onPress={() => this._apiPostLogin()}
                            />

                        </View>
                    </Animated.View>
                }

                {/* </ImageBackground > */}

            </SafeAreaView >
        );
    }
}



const ForgotPassword = ({ formErrors }) =>
{
    const navigation = useNavigation()

    return (
        <Pressable
            style={{ marginTop: formErrors?.length > 0 ? 10 : 0, width: "85%" }}
            onPress={() => navigation.navigate(Routing.forgotPassword)}
        ><Text style={{ textAlign: 'right' }}>¿Has olvidado tu contraseña?</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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