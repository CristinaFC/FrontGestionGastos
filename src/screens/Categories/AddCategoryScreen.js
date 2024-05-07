
import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, SafeAreaView, Modal, ScrollView } from "react-native";
import CheckBox from '@react-native-community/checkbox';

import { connect } from "react-redux";
import { apiPostCategory, setCategoryDataState, clearCategoriesData } from "../../modules/Category/CategoryActions";
import { Views } from "../../assets/styles/Views";

import * as Color from '../../assets/styles/Colors';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Header from "../../components/Header";
import { TextInputValidator } from "../../components/TextInputValidator";
import FormValidatorsManager from "../../utils/validators/FormValidatorsManager";
import { localAssets } from "../../assets/images/assets";

import EmojiSelector, { Categories } from 'react-native-emoji-selector'
import { icons, options } from "./constants";
import { Texts } from "../../assets/styles/Texts";
import { Buttons } from "../../assets/styles/Buttons";
import { Style } from "../../assets/styles/Style";
import { Inputs } from "../../assets/styles/Inputs";
import { Icons } from "../../assets/styles/Icons";
import CategoriesModal from "../../components/Modals/CategoriesModal";
import { Modals } from "../../assets/styles/Modals";


class AddCategoryScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            name: '',
            icon: '',
            type: '',
            formErrors: [],
            limit: '',
            showIconsModal: false
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
        const { name, icon, type, formErrors, limit } = this.state
        let dataToSend = { name, icon, type }
        if (formErrors.length === 0)
        {
            console.log(type)
            if (type == "Incomes")
                this.props.apiPostCategory(dataToSend);
            else this.props.apiPostCategory({ ...dataToSend, limit })
        }
    }

    _handleIconPress = () =>
    {
        this.setState(prevState => ({ showIconsModal: !prevState.showIconsModal }));
    }


    render()
    {
        const { formErrors, name, type, icon, pressed, showIconsModal, limit } = this.state;

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Añadir categoría"
                    rightIcon="content-save"
                    rightAction={() => this._addCategory()} />
                <View style={styles.container}>
                    <View style={styles.nameAndIconContainer}>
                        <TextInputValidator
                            multiline={true}
                            numberOfLines={4}
                            error={formErrors}
                            errorKey="name"
                            inputValue={name}
                            keyboardType="ascii-capable"
                            onChange={value => this._handleChange('name', value)}
                            placeholder="Nombre"
                            title="Nombre"
                            style={{ width: Style.DEVICE_EIGHTY_PERCENT_WIDTH }}
                        />

                        {formErrors.some(error => error.key === "icon") && (
                            <Text style={styles.error}>*</Text>
                        )}
                        <TouchableOpacity onPress={() => this._handleIconPress()} style={[styles.categoryIcon]}>
                            {icon.length > 0 ? <MaterialCommunityIcons name={icon} size={25} color={Color.button} />
                                : <Icon name="tag" size={Style.DEVICE_FIVE_PERCENT_WIDTH} color={Color.firstText} />
                            }
                        </TouchableOpacity >
                    </View>
                    <Modal
                        visible={showIconsModal}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => this._handleIconPress()}
                    >
                        <View style={Modals.modalContainer}>
                            <View style={Modals.modalContent}>
                                <TouchableOpacity style={Modals.closeButton} onPress={() => this._handleIconPress()}>
                                    <MaterialCommunityIcons name="close" size={20} color={Color.orange} />
                                </TouchableOpacity>
                                <FlatList
                                    style={{ height: 150, flexGrow: 0 }}
                                    columnWrapperStyle={styles.columnWrapperStyle}
                                    numColumns={6}
                                    contentContainerStyle={styles.contentContainerStyle}
                                    data={icons}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity style={(pressed && icon === item) ? Buttons.touchableIconSelected : Buttons.touchableIcon} onPress={() => { this.setState({ pressed: true, icon: item }) }}>
                                            <MaterialCommunityIcons
                                                name={item}
                                                size={30}
                                                color={(pressed && icon === item) ? Color.button : Color.firstText} />
                                        </TouchableOpacity>}
                                />
                            </View>
                        </View>
                    </Modal>
                    <Text style={styles.text}>
                        {formErrors.some(error => error.key === "type") && <Text style={Texts.errorText}>*</Text>}
                        Tipo:
                    </Text>

                    <Dropdown
                        style={[Inputs.fullDropdown, styles.dropdown]}
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
                    {type === "Expenses" && <TextInputValidator
                        error={formErrors}
                        errorKey="limit"
                        inputValue={limit}
                        keyboardType="numeric"
                        onChange={value => this._handleChange('limit', value)}
                        placeholder="Límite"
                        title="Límite"
                        style={{ width: Style.DEVICE_NINETY_PERCENT_WIDTH }}
                    />}

                </View>
            </SafeAreaView>
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
    dropdown: {
        width: Style.DEVICE_NINETY_PERCENT_WIDTH,
        marginBottom: 10
    },
    contentContainerStyle: {
        width: "100%",
        justifyContent: 'center'
    },
    columnWrapperStyle: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: "1%"
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    nameAndIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: Style.DEVICE_NINETY_PERCENT_WIDTH
    },
    text: {
        fontSize: Style.FONT_SIZE_SMALL,
        fontFamily: Style.FONT_FAMILY,
        letterSpacing: 0.1,
        width: Style.DEVICE_NINETY_PERCENT_WIDTH,
        color: Color.firstText,
    },
    error: {
        color: Color.orange,
        marginBottom: 10
    },
    icon: {
        marginRight: 5,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: Color.firstText
    },
});

export default connect(mapStateToProps, mapStateToPropsAction)(AddCategoryScreen);