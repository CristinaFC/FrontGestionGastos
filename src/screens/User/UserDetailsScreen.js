import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import
{
    apiGetUser,
    apiPutUser,
    apiDeleteUser,

} from "../../modules/User/UserActions";
import { connect } from "react-redux";
import * as Color from '../../assets/styles/Colors';
import { Views } from "../../assets/styles/Views";
import { TextInputValidator } from "../../components/TextInputValidator";
import SubmitButton from "../../components/SubmitButton";
import Header from "../../components/Header";
import { localAssets } from "../../assets/images/assets";
import { icons, options } from "./constants";
import FormValidatorsManager from "../../utils/validators/FormValidatorsManager";
import SuccessModal from "../../components/Modals/SuccessModal";
import WarningModal from "../../components/Modals/WarningModal";

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

    componentDidMount()
    {
        this._getUser()
    }

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
        if (formErrors.length === 0)
            this.props.apiPutUser({ name, lastName, email });

    }

    _handleChange = (name, value) =>
    {
        this.setState({ [name]: value })
    }

    _deleteUser()
    {
        this.props.apiDeleteUser()
    }

    render()
    {
        const { isLoading } = this.props;

        const { formErrors, name, lastName, email, deleting } = this.state;

        return (
            <View style={styles.container}>
                <Header
                    goBack={true}
                    title="Perfil"
                    rightAction={() => this._deleteUser()}
                    rightIcon="delete" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    {isLoading ? <ActivityIndicator />
                        : <View style={styles.userContainer}>

                            <TextInputValidator
                                error={formErrors}
                                errorKey="name"
                                inputValue={name}
                                keyboardType="ascii-capable"
                                onChange={value => this._handleChange('name', value)}
                                placeholder="Nombre"
                                title="Nombre"
                            />

                            <TextInputValidator
                                error={formErrors}
                                errorKey="lastName"
                                inputValue={lastName}
                                keyboardType="ascii-capable"
                                onChange={value => this._handleChange('lastName', value)}
                                placeholder="Apellido"
                                title="Apellido"
                            />

                            <TextInputValidator
                                error={formErrors}
                                errorKey="email"
                                inputValue={email}
                                keyboardType="ascii-capable"
                                onChange={value => this._handleChange('email', value)}
                                placeholder="Correo"
                                title="Correo"
                            />
                            <SubmitButton onPress={() => this._handleSubmit()} title="Guardar" />

                            {/* {deleting ? <WarningModal
                                text="¿Desea eliminar su cuenta?"
                                buttom="Eliminar"
                                onPress={() => this._deleteUser()} /> : null} */}
                        </View>}

                </ImageBackground >
            </View>
        )

    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
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

    const { user, isLoading } = UserReducer;

    return { user, isLoading };

};

const mapStateToPropsAction = {
    apiGetUser,
    apiPutUser,
    apiDeleteUser
};
export default connect(mapStateToProps, mapStateToPropsAction)(UserDetailsScreen);
