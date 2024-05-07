
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { MenuButton } from '../../components/MenuButton';
import * as RootRouting from '../../navigation/RootRouting'

import * as Color from '../../assets/styles/Colors';
import { Views } from '../../assets/styles/Views';
import { localAssets } from '../../assets/images/assets';
import Routing from '../../navigation/Routing';
import { FlatList } from 'react-native-gesture-handler';
import { apiGetRecentExpenses, clearExpenseData, apiDeleteExpense } from '../../modules/Expense/ExpenseActions';
import { connect } from 'react-redux';
import { Item } from '../../components/Item';
import { Texts } from '../../assets/styles/Texts';
import { MenuView } from '../../components/MenuView';

class ExpensesScreen extends Component
{

    constructor(props) { super(props); }

    componentDidMount()
    {
        this._getData()
    }

    _getData() { this.props.apiGetRecentExpenses(5) }
    componentWillUnmount() { this.props.clearExpenseData() }

    render()
    {
        const { expenses, isLoadingExpenses } = this.props;

        return (
            <SafeAreaView style={Views.container}>
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeader} blurRadius={40}>
                    <MenuView
                        leftTitle="Añadir"
                        leftOnPress={() => RootRouting.navigate(Routing.addExpense, { type: "Expenses" })}
                        rightTitle="Historial"
                        rightOnPress={() => RootRouting.navigate(Routing.historyExpenses)} />
                </ImageBackground>
                <View style={Views.recentsTitleContainer}>
                    <Text style={Texts.recentsText}>Recientes</Text>
                </View>
                {isLoadingExpenses
                    ? <ActivityIndicator />
                    : <View style={styles.container}>
                        {expenses !== (undefined || null) ?
                            <FlatList
                                contentContainerStyle={{ alignItems: 'center' }}
                                data={expenses}
                                renderItem={({ item }) =>
                                    <Item item={item}
                                        hasDeleteAction={false}
                                        action={() =>
                                            RootRouting.navigate(Routing.detailsExpense, { id: item.uid, type: "expense" })}
                                    />
                                } />

                            : null}
                    </View>
                }
            </SafeAreaView >
        );
    }

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
});

export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesScreen);