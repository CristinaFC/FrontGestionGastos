
import React, { Component } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, ImageBackground } from "react-native";

import { connect } from "react-redux";
import Routing from "../../navigation/Routing";

import { Views } from "../../assets/styles/Views";

import { apiGetCategories, clearCategoriesData } from "../../modules/Category/CategoryActions";
import * as RootRouting from '../../navigation/RootRouting';
import { localAssets } from "../../assets/images/assets";
import Header from "../../components/Header";
import { Option } from "../../components/Option";


class CategoriesScreen extends Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount() { this._getCategories() }

    componentDidUpdate(prevProps) { if (prevProps !== this.props) this.forceUpdate() }

    _getCategories()
    {
        this.props.apiGetCategories();
    }

    render()
    {
        const { isLoadingCategories, categories } = this.props;
        if (isLoadingCategories) return <ActivityIndicator />
        return (
            <View style={styles.container}>
                <Header goBack={true}
                    rightIcon="plus"
                    rightAction={() => RootRouting.navigate(Routing.addCategory)}
                    title="Categorías" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <View style={styles.container}>
                        {categories?.length > 0 ?

                            <FlatList
                                contentContainerStyle={{ alignItems: 'center' }}
                                data={categories}
                                renderItem={({ item }) =>
                                    <Option action={() => item.readOnly ? null :
                                        RootRouting.navigate(Routing.categoryDetails, { id: item.uid })}
                                        title={item.name} icon={item.icon} readOnly={item.readOnly} />
                                }
                            />
                            : null}
                    </View>
                </ImageBackground>
            </View>
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
    clearCategoriesData
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
});

export default connect(mapStateToProps, mapStateToPropsAction)(CategoriesScreen);