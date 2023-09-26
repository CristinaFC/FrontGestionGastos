
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MenuButton } from '../../components/MenuButton';
import * as RootRouting from '../../navigation/RootRouting'

import * as Color from '../../assets/styles/Colors';
import { Texts } from '../../assets/styles/Texts';
import { Views } from '../../assets/styles/Views';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import Routing from '../../navigation/Routing';
import { FlatList } from 'react-native-gesture-handler';
import { apiGetRecentIncomes } from '../../modules/Income/IncomeActions';
import { connect } from 'react-redux';
import { Item } from '../../components/Item';

class MainIncomesScreen extends Component
{

    constructor(props) { super(props); }

    componentDidMount()
    {
        this._getData()
    }

    _getData() { this.props.apiGetRecentIncomes(4) }

    render()
    {
        const { incomes, isLoadingIncomes } = this.props;

        return (
            <SafeAreaView style={styles.container}>
                <Header goBack={true} title="Ingresos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <View style={Views.menuView}>
                        <MenuView />
                    </View>
                    <Text style={{ fontSize: 16, color: Color.white, width: "90%", fontWeight: 'bold', textDecorationLine: 'underline' }}>Recientes</Text>
                    {isLoadingIncomes
                        ? <ActivityIndicator />
                        :
                        <View style={styles.container}>

                            {incomes !== (undefined || null) ?

                                <FlatList
                                    contentContainerStyle={{ alignItems: 'center' }}
                                    data={incomes.slice(0, 4)}
                                    renderItem={({ item }) =>
                                        <Item item={item}
                                            action={() => RootRouting.navigate(Routing.detailsIncome, { id: item.uid })} />
                                    } />

                                : null}
                        </View>
                    }
                </ImageBackground>
            </SafeAreaView >
        );
    }

}

const MenuView = () =>
{
    return (
        <View style={Views.row}>
            <MenuButton title="Añadir" onPress={() => RootRouting.navigate(Routing.addIncome)} />
            <MenuButton title="Historial" onPress={() => RootRouting.navigate(Routing.historyIncomes)} />
        </View>
    )
}

const mapStateToProps = ({ IncomeReducer }) =>
{

    const { incomes, isLoadingIncomes } = IncomeReducer;

    return { incomes, isLoadingIncomes };

};

const mapStateToPropsAction = {
    apiGetRecentIncomes,
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        // display: 'flex',
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 10, padding: "5%",
        marginTop: "5%",
        backgroundColor: 'rgba(236, 236, 236, .8)',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: "row",
        margin: "2%",
        alignItems: 'center',
    },
    title: {
        width: "60%",
        justifyContent: 'center',
        alignItems: 'flex-start',
        display: 'flex',
        paddingLeft: 0,
    },
    rightButton: {
        width: "20%",
        alignItems: 'flex-end',
        justifyContent: 'center',
        display: 'flex'
    }

});

export default connect(mapStateToProps, mapStateToPropsAction)(MainIncomesScreen);