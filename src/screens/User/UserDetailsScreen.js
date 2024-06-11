import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import
{
    apiGetUser,
    apiPutUser,
    apiDeleteUser,
    clearDataUser,

} from "../../modules/User/UserActions";
import { connect } from "react-redux";
import * as Color from '../../assets/styles/Colors';
import { Views } from "../../assets/styles/Views";
import { TextInputValidator } from "../../components/TextInputValidator";
import Header from "../../components/Header";
import FormValidatorsManager from "../../utils/validators/FormValidatorsManager";
import WarningModal from "../../components/Modals/WarningModal";
import { Style } from "../../assets/styles/Style";
import { Buttons } from "../../assets/styles/Buttons";
import { Texts } from "../../assets/styles/Texts";

class UserDetailsScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            name: '',
            lastName: '',
            email: '',
            formErrors: [],
            deleting: false
        }
    }

    componentDidMount() { this._getUser() }

    componentWillUnmount() { this.props.clearDataUser() }

    async _getUser()
    {
        await this.props.apiGetUser();
        const { name, lastName, email } = this.props.user
        this.setState({ name, lastName, email })
    }

    _handleSubmit()
    {
        const { name, lastName, email } = this.state
        const formErrors = FormValidatorsManager.formProfile({ name, lastName, email })
        this.setState({ formErrors })

        if (formErrors.length === 0) this.props.apiPutUser({ name, lastName, email });

    }

    _handleChange = (name, value) =>
    {
        this.setState({ [name]: value })
    }

    async _deleteUser()
    {
        await this.props.apiDeleteUser()
    }

    render()
    {
        const { isLoading, errors } = this.props;

        const { formErrors, name, lastName, email, deleting } = this.state;
        const alreadyExists = errors.find(err => err.status === 409)?.message
        return (
            <View style={Views.container}>
                <Header
                    goBack={true}
                    title="Perfil"
                    rightAction={() => this._handleSubmit()}
                    rightIcon="content-save" />

                <View style={styles.container}>
                    {isLoading ? <ActivityIndicator />
                        : <View style={styles.container}>

                            <TextInputValidator
                                error={formErrors}
                                errorKey="name"
                                inputValue={name}
                                keyboardType="ascii-capable"
                                onChange={value => this._handleChange('name', value)}
                                placeholder="Nombre"
                                title="Nombre"
                                style={{ width: Style.DEVICE_NINETY_PERCENT_WIDTH }}
                            />

                            <TextInputValidator
                                error={formErrors}
                                errorKey="lastName"
                                inputValue={lastName}
                                keyboardType="ascii-capable"
                                onChange={value => this._handleChange('lastName', value)}
                                placeholder="Apellido"
                                title="Apellido"
                                style={{ width: Style.DEVICE_NINETY_PERCENT_WIDTH }}
                            />

                            <TextInputValidator
                                error={formErrors}
                                errorKey="email"
                                inputValue={email}
                                keyboardType="ascii-capable"
                                onChange={value => this._handleChange('email', value)}
                                placeholder="Correo"
                                title="Correo"
                                style={{ width: Style.DEVICE_NINETY_PERCENT_WIDTH }}
                            />
                            <Text style={Texts.errorText}>{alreadyExists}</Text>
                            <TouchableOpacity onPress={() => this._handleChange('deleting', true)} style={Buttons.orangeButton}>
                                <Text style={{ color: Color.white }}>Eliminar cuenta</Text>
                            </TouchableOpacity >
                            {deleting && <WarningModal
                                text="Está a punto de eliminar su cuenta. Le recordamos que si elimina su cuenta, se perderán sus datos para siempre. ¿Desea continuar?"
                                button="Eliminar"
                                onPressCancel={() => this.setState({ deleting: false })}
                                onPress={() => this._deleteUser()} />}
                        </View>}
                </View>

            </View>
        )

    }
}

const styles = StyleSheet.create({

    container: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    userContainer: {
        width: "80%",
        height: 350,
        paddingTop: "5%",
        paddingBottom: "5%",
        marginTop: "10%",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'rgba(236, 236, 236, .8)',
    },
    text: {
        width: "80%",
        fontSize: 16,
        marginTop: 5
    },
    error: {
        width: "80%",
        color: Color.orange,
        paddingTop: 5,
        marginBottom: 10
    },


});

const mapStateToProps = ({ UserReducer }) =>
{

    const { user, isLoading, errors } = UserReducer;

    return { user, isLoading, errors };

};

const mapStateToPropsAction = {
    apiGetUser,
    apiPutUser,
    apiDeleteUser,
    clearDataUser
};
export default connect(mapStateToProps, mapStateToPropsAction)(UserDetailsScreen);
