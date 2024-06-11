import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, SafeAreaView } from "react-native";
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
import Header from "../../components/Header";
import { icons, options } from "./constants";
import FormValidatorsManager from "../../utils/validators/FormValidatorsManager";
import { Style } from "../../assets/styles/Style";
import { Inputs } from "../../assets/styles/Inputs";
import { Texts } from "../../assets/styles/Texts";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Modals } from "../../assets/styles/Modals";
import { Buttons } from "../../assets/styles/Buttons";
import { HelpModal } from "../../components/Modals/HelpModal";

class CategoryDetails extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            name: '',
            type: '',
            icon: '',
            limit: '0',
            pressed: false,
            showIconsModal: false,
            formErrors: [],
            openModal: false
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
        const { name, icon, type, monthlyExpenses } = this.props.category
        const date = new Date()
        const limit = monthlyExpenses?.find(monthlyExpense =>
            monthlyExpense.month === date.getMonth() + 1 && monthlyExpense.year === date.getFullYear()
        )?.limit;
        this.setState({ name, type, icon, limit: limit ? limit.toString() : '0' })
    }


    async _validateFields()
    {
        const { name, icon, type, limit } = this.state
        const formErrors = FormValidatorsManager.formCategory({ name, icon, type, limit })
        this.setState({ formErrors })
    }

    async _handleSubmit()
    {
        await this._validateFields()

        const { formErrors, name, icon, type, limit } = this.state
        if (formErrors.length === 0)
            this.props.apiPutCategoryById(this.id, { name, icon, type, limit });
    }

    _handleChange = (name, value) => { this.setState({ [name]: value }) }
    _handleModal() { this.setState({ openModal: !this.state.openModal }) }
    _deleteCategory() { this.props.apiDeleteCategory(this.id) }


    _handleIconPress = () =>
    {
        this.setState(prevState => ({ showIconsModal: !prevState.showIconsModal }));
    }

    render()
    {
        const { isLoadingCategory } = this.props;

        const { formErrors, name, type, icon, pressed, showIconsModal, limit, openModal } = this.state;

        return (
            <SafeAreaView style={Views.container} >
                <Header goBack={true} title="Editar categoría" rightIcon="content-save"
                    rightAction={() => this._handleSubmit()} />
                {isLoadingCategory ? <ActivityIndicator />
                    : <View style={styles.container}>
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
                            disable={true}
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
                            title={<Text style={Texts.inputTitle}>Límite<TouchableOpacity onPress={() => this._handleModal()} style={{ height: 17 }}>
                                <MaterialCommunityIcons name="help" size={10} color={Color.button} />
                            </TouchableOpacity>
                            </Text>}
                            style={{ width: Style.DEVICE_NINETY_PERCENT_WIDTH }}
                        />}
                        <HelpModal openModal={openModal} action={() => this._handleModal()} text="Cuando se añada un gasto en dicha categoría y se haya superado el límite establecido, se le comunicará. Si no quiere establecer ningún límite, deje el valor a 0" />
                    </View>}

            </ SafeAreaView>
        )

    }
}


const styles = StyleSheet.create({
    dropdown: {
        width: Style.DEVICE_NINETY_PERCENT_WIDTH,
        marginBottom: 10,
        opacity: 0.5
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
