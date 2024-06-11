
import React, { Component } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, ImageBackground } from "react-native";

import { connect } from "react-redux";
import Routing from "../../navigation/Routing";

import { Views } from "../../assets/styles/Views";

import { apiDeleteCategory, apiGetCategories, clearCategoriesData } from "../../modules/Category/CategoryActions";
import * as RootRouting from '../../navigation/RootRouting';
import { localAssets } from "../../assets/images/assets";
import Header from "../../components/Header";
import { Option } from "../../components/Option";
import WarningModal from "../../components/Modals/WarningModal";


class CategoriesScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            warning: false,
            categoryId: ''
        }
    }
    componentDidMount() { this._getCategories() }

    componentDidUpdate(prevProps) { if (prevProps !== this.props) this.forceUpdate() }

    _getCategories() { this.props.apiGetCategories(); }
    async _deleteCategory(id) { await this.props.apiDeleteCategory(id); }

    render()
    {
        const { warning, categoryId } = this.state
        const { isLoadingCategories, categories } = this.props;

        return (
            <View style={Views.container}>
                <Header goBack={true}
                    rightIcon="plus"
                    rightAction={() => RootRouting.navigate(Routing.addCategory)}
                    title="Categorías" />

                <View style={Views.container}>
                    {categories?.length > 0 && !isLoadingCategories ?

                        <FlatList
                            contentContainerStyle={{ alignItems: 'center' }}
                            data={categories}
                            renderItem={({ item }) =>
                                <Option action={() => item.type != "ExpenseIncome" &&
                                    RootRouting.navigate(Routing.categoryDetails, { id: item.uid })}
                                    title={item.name} icon={item.icon} readOnly={item.readOnly}
                                    rightIcons={item.type != "ExpenseIncome" && ["delete"]}
                                    rightActions={[() => this.setState({ warning: true, categoryId: item.uid })]} />
                            }
                        />
                        : <ActivityIndicator />}
                </View>
                {warning && <WarningModal
                    text="Está a punto de eliminar una categoría. Los gastos o ingresos relacionados a esta categoría se eliminarán también de forma permanente. ¿Desea continuar?"
                    button="Eliminar"
                    onPressCancel={() => this.setState({ warning: false })}
                    onPress={() =>
                    {
                        this._deleteCategory(categoryId)
                        this.setState({ warning: false })
                    }} />
                }
            </View >
        )

    }
}


const mapStateToProps = ({ CategoryReducer }) =>
{

    const { categories, isLoadingCategories } = CategoryReducer;

    return { categories, isLoadingCategories };

};

const mapStateToPropsAction = {
    apiGetCategories,
    clearCategoriesData,
    apiDeleteCategory
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
});

export default connect(mapStateToProps, mapStateToPropsAction)(CategoriesScreen);