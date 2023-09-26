
import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from "react-native";

import { connect } from "react-redux";
import { apiPostCategory, setCategoryDataState, clearCategoriesData } from "../../modules/Category/CategoryActions";
import { Views } from "../../assets/styles/Views";

import * as Color from '../../assets/styles/Colors';
import { Dropdown } from 'react-native-element-dropdown';


import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from "../../components/Header";
import { TextInputValidator } from "../../components/TextInputValidator";
import FormValidatorsManager from "../../utils/validators/FormValidatorsManager";
import { localAssets } from "../../assets/images/assets";
import SubmitButton from "../../components/SubmitButton";
import { icons, options } from "./constants";
import { Texts } from "../../assets/styles/Texts";
import { Buttons } from "../../assets/styles/Buttons";
import { Style } from "../../assets/styles/Style";


class AddCategoryScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            name: '',
            icon: '',
            type: '',
            formErrors: []
        }
    }


    _handleChange = (name, value) =>
    {
        this.setState({ [name]: value })
    }

    _validateFields()
    {
        const { name, icon, type } = this.state
        const formErrors = FormValidatorsManager.formCategory({ name, icon, type })
        this.setState({ formErrors })
    }

    _addCategory()
    {
        this._validateFields()
        const { name, icon, type, formErrors } = this.state
        if (formErrors.length === 0)
        {
            this.props.apiPostCategory({ name, icon, type });
        }
    }

    render()
    {
        const { formErrors, name, type, icon, pressed } = this.state;
        const { errors } = this.props;
        const typeError = formErrors.find(error => error.key === 'type')
        const iconError = formErrors.find(error => error.key === 'icon')

        return (
            <View style={styles.container}>
                <Header goBack={true} title="Añadir categoría" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>

                    <View style={styles.categoryContainer}>
                        <TextInputValidator
                            error={formErrors}
                            errorKey="name"
                            inputValue={name}
                            keyboardType="ascii-capable"
                            onChange={value => this._handleChange('name', value)}
                            placeholder="Nombre"
                            title="Nombre"
                        />
                        <Text style={styles.text}>Tipo</Text>
                        <Dropdown
                            style={styles.dropdown}
                            data={options}
                            value={type}
                            labelField="name"
                            valueField="value"
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            maxHeight={300}
                            placeholder="Seleccionar..."
                            onChange={item =>
                            {
                                this._handleChange('type', item.value)
                            }}
                        />
                        {typeError !== undefined ? <Text style={styles.error}>{typeError.value}</Text> : null}
                        <Text style={{ width: "80%", fontSize: 16 }}>Seleccione un icono para la categoría:</Text>
                        {iconError !== undefined ? <Text style={styles.error}>{iconError.value}</Text> : null}
                        <FlatList
                            style={{ height: 150, flexGrow: 0 }}
                            columnWrapperStyle={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', padding: "1%" }}
                            numColumns={6}
                            contentContainerStyle={{ width: "100%", justifyContent: 'center' }}
                            data={icons}
                            renderItem={({ item }) =>
                                <TouchableOpacity style={(pressed && icon === item) ? Buttons.touchableIconSelected : Buttons.touchableIcon} onPress={() => { this.setState({ pressed: true, icon: item }) }}>
                                    <MaterialCommunityIcons
                                        name={item}
                                        size={30}
                                        color={(pressed && icon === item) ? Color.button : Color.firstText} />
                                </TouchableOpacity>}
                        />

                        <SubmitButton onPress={() => this._addCategory()} title="Añadir" />

                    </View>
                </ImageBackground >

            </View>
        )

    }
}


const mapStateToProps = ({ CategoryReducer }) =>
{

    const { isLoadingCategory, errors } = CategoryReducer;

    return { isLoadingCategory, errors };

};

const mapStateToPropsAction = {
    apiPostCategory,
    setCategoryDataState,
    clearCategoriesData
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
    },
    categoryContainer: {
        // display: 'flex',
        width: "80%",
        height: 550,
        justifyContent: 'space-between',
        paddingVertical: 35,
        marginTop: "10%",
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: 'rgba(236, 236, 236, .8)',
    },
    text: {
        fontSize: Style.FONT_SIZE_SMALL,
        fontFamily: Style.FONT_FAMILY,
        letterSpacing: 0.1,
        width: "80%",
        color: Color.firstText,
        marginTop: 40, marginBottom: 0
    },
    error: {
        width: "80%",
        color: Color.orange,
        marginBottom: 10
    },
    dropdown: {
        width: "80%",
        height: 45,
        borderBottomColor: Color.firstText,
        borderBottomWidth: 0.5,
        marginBottom: 5
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: Color.firstText
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },

});

export default connect(mapStateToProps, mapStateToPropsAction)(AddCategoryScreen);