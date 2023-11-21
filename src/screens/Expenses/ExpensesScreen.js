
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
import { apiGetRecentExpenses, clearExpenseData, apiDeleteExpense } from '../../modules/Expense/ExpenseActions';
import { connect } from 'react-redux';
import { Item } from '../../components/Item';
import Switcher from '../../components/Switcher';
import FixedExpenses from '../FixedExpenses/FixedExpenses';

class ExpensesScreen extends Component
{

    constructor(props) { super(props); }

    componentDidMount()
    {
        this._getData()
    }

    _getData() { this.props.apiGetRecentExpenses(4) }
    componentWillUnmount() { this.props.clearExpenseData() }

    render()
    {
        const { expenses, isLoadingExpenses } = this.props;

        return (
            <SafeAreaView style={Views.container}>
                <View style={Views.menuView}>
                    <MenuView />
                </View>

                <Text style={{ fontSize: 16, color: Color.white, width: "90%", fontWeight: 'bold', textDecorationLine: 'underline' }}>Recientes</Text>
                {isLoadingExpenses
                    ? <ActivityIndicator />
                    : <View style={styles.container}>
                        {expenses !== (undefined || null) ?
                            <FlatList
                                contentContainerStyle={{ alignItems: 'center' }}
                                data={expenses?.slice(0, 4)}
                                renderItem={({ item }) =>
                                    <Item item={item}
                                        action={() =>
                                            RootRouting.navigate(Routing.detailsExpense, { id: item.uid })}
                                        deleteAction={() => this.props.apiDeleteExpense(item.uid)} />
                                } />

                            : null}
                    </View>
                }
            </SafeAreaView >
        );
    }

}

const MenuView = () =>
{
    return (
        <View style={Views.row}>
            <MenuButton title="Añadir" onPress={() => RootRouting.navigate(Routing.addExpense)} />
            <MenuButton title="Historial" onPress={() => RootRouting.navigate(Routing.historyExpenses)} />
        </View>
    )
}

const mapStateToProps = ({ ExpenseReducer }) =>
{

    const { expenses, isLoadingExpenses } = ExpenseReducer;

    return { expenses, isLoadingExpenses };

};

const mapStateToPropsAction = {
    apiGetRecentExpenses,
    clearExpenseData,
    apiDeleteExpense
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

export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesScreen);