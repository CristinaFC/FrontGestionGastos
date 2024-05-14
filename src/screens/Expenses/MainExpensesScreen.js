
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Views } from '../../assets/styles/Views';
import Header from '../../components/Header';
import { clearExpenseData } from '../../modules/Expense/ExpenseActions';
import { connect } from 'react-redux';
import Switcher from '../../components/Switcher';
import FixedExpenses from '../FixedExpenses/FixedExpenses';
import ExpensesScreen from './ExpensesScreen';

class MainExpensesScreen extends Component
{

    constructor(props) { super(props); }

    componentWillUnmount() { this.props.clearExpenseData() }

    render()
    {

        return (
            <SafeAreaView style={Views.container}>
                <Header title="Gastos" />
                <View style={Views.image}>
                    <Switcher
                        LeftScreen={ExpensesScreen}
                        lButtonName={"Gastos"}
                        RightScreen={FixedExpenses}
                        rButtonName={"Gastos fijos"} />
                </View>
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
    clearExpenseData,
};


export default connect(mapStateToProps, mapStateToPropsAction)(MainExpensesScreen);