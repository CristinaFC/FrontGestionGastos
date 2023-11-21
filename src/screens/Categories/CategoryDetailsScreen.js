import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import
{
    apiPutCategoryById,
    apiGetCategoryById,
    apiDeleteCategory,
    setCategoryDataState,
    clearCategoriesData
} from "../../modules/Category/CategoryActions";
import { connect } from "react-redux";
import * as Color from '../../assets/styles/Colors';
import { Views } from "../../assets/styles/Views";
import { TextInputValidator } from "../../components/TextInputValidator";
import SubmitButton from "../../components/SubmitButton";
import Header from "../../components/Header";
import { localAssets } from "../../assets/images/assets";
import { icons, options } from "./constants";
import FormValidatorsManager from "../../utils/validators/FormValidatorsManager";
import { Style } from "../../assets/styles/Style";
import { Inputs } from "../../assets/styles/Inputs";
import { Texts } from "../../assets/styles/Texts";
import { HorizontalLine } from "../../components/HorizontalLine";

class CategoryDetails extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            name: '',
            type: '',
            icon: '',
            readOnly: '',
            formErrors: []
        }
        this.id = props.route.params.id;
    }

    componentDidMount()
    {
        this._getCategory()
    }

    async _getCategory()
    {
        await this.props.apiGetCategoryById(this.id);
        const { name, icon, type, readOnly } = this.props.category
        this.setState({ name, type, icon, readOnly })
    }


    _validateFields()
    {
        const { name, icon, type } = this.state
        const formErrors = FormValidatorsManager.formCategory({ name, icon, type })
        this.setState({ formErrors })
    }

    _handleSubmit()
    {
        this._validateFields()

        const { formErrors, name, icon, type } = this.state
        if (formErrors.length === 0)
            this.props.apiPutCategoryById(this.id, { name, icon, type });
    }

    _handleChange = (name, value) =>
    {
        this.setState({ [name]: value })
    }

    _deleteCategory()
    {
        this.props.apiDeleteCategory(this.id)
    }

    render()
    {
        const { isLoadingCategory } = this.props;

        const { formErrors, name, type, icon, readOnly } = this.state;

        const typeError = formErrors.find(error => error.key === 'type')
        const iconError = formErrors.find(error => error.key === 'icon')

        return (
            <View style={styles.container} >
                <Header goBack={true} title="Editar categoría" rightAction={() => this._deleteCategory()} rightIcon="delete" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    {isLoadingCategory ? <ActivityIndicator />
                        : <View style={styles.categoryContainer}>
                            <TextInputValidator
                                editable={readOnly ? false : true}
                                error={formErrors}
                                errorKey="name"
                                inputValue={name}
                                keyboardType="ascii-capable"
                                onChange={value => this._handleChange('name', value)}
                                placeholder="Nombre"
                                title="Nombre"
                            />
                            <View style={styles.dropdownContainer}>
                                <Text style={styles.dropdownText}>
                                    {typeError !== undefined ?
                                        <Text style={Texts.errorText}>*</Text> : null}
                                    Tipo:
                                </Text>
                                <Dropdown
                                    style={Inputs.halfDropdown}
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
                                        this._handleChange('type', item)
                                    }}
                                />
                            </View>
                            <HorizontalLine />
                            <Text style={{ width: "80%", marginVertical: "5%", fontSize: 16 }}>Seleccione un icono para la categoría:</Text>
                            <FlatList
                                style={{ height: 150, flexGrow: 0 }}
                                columnWrapperStyle={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', padding: "1%" }}
                                numColumns={6}
                                contentContainerStyle={{ width: "100%", justifyContent: 'center' }}
                                data={icons}
                                renderItem={({ item }) =>
                                    <TouchableOpacity style={(icon === item) ? styles.touchableIconSelected : styles.touchableIcon} onPress={() => { this._handleChange('icon', item) }}>
                                        <MaterialCommunityIcons name={item} size={30} color={(icon === item) ? Color.button : Color.firstText} />
                                    </TouchableOpacity>}
                            />
                            {iconError !== undefined ? <Text style={styles.error}>{iconError.value}</Text> : null}

                            <SubmitButton onPress={() => this._handleSubmit()} title="Guardar" />
                        </View>}
                </ImageBackground >
            </ View>
        )

    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
    },
    categoryContainer: {
        display: 'flex',
        width: "90%",
        height: "70%",
        paddingTop: "5%",
        paddingBottom: "5%",
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
    error: {
        width: "80%",
        color: Color.orange,
        paddingTop: 5,
        marginBottom: 10
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
    text: {
        fontSize: Style.FONT_SIZE_SMALL,
        fontFamily: Style.FONT_FAMILY,
        letterSpacing: 0.1,
        width: "80%",
        color: Color.firstText,
        marginTop: 40, marginBottom: 0
    },
    dropdownContainer: {
        paddingHorizontal: "10%",
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    dropdownText: {
        color: Color.firstText,
        fontSize: 16
    },
});

const mapStateToProps = ({ CategoryReducer }) =>
{

    const { category, isLoadingCategory } = CategoryReducer;

    return { category, isLoadingCategory };

};

const mapStateToPropsAction = {
    apiGetCategoryById,
    apiPutCategoryById,
    apiDeleteCategory,
    setCategoryDataState,
    clearCategoriesData
};
export default connect(mapStateToProps, mapStateToPropsAction)(CategoryDetails);
