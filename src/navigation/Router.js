import React from 'react';
import Routing from './Routing';
import HomeScreen from '../screens/HomeScreen';
import { AddExpenseOrIncomeScreen, DetailsExpenseScreen, HistoryExpensesScreen, MainExpensesScreen } from '../screens/Expenses';
import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import { DetailsIncomeScreen, HistoryIncomesScreen, MainIncomesScreen } from '../screens/Incomes';

import AuthScreen from '../screens/Auth/AuthScreen';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/User/RegisterScreen';

import { useSelector } from 'react-redux';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { useNavigation } from '@react-navigation/native';
import AddCategoryScreen from '../screens/Categories/AddCategoryScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import CategoryDetailsScreen from '../screens/Categories/CategoryDetailsScreen';
import UserDetailsScreen from '../screens/User/UserDetailsScreen';


import { AccountDetailsScreen, AddAccountScreen, DetailsAccountScreen, MainAccountsScreen } from '../screens/Accounts';
import EditAccountScreen from '../screens/Accounts/EditAccountScreen';
import MainGraphsScreen from '../screens/Graphs/MainGraphsScreen';
import IncomesGraphsScreen from '../screens/Graphs/IncomesGraphsScreen';
import ExpensesPerMonthsGraphScreen from '../screens/Graphs/Expenses/ExpensesPerMonthsGraphScreen';
import ExpensesGraphsMenuScreen from '../screens/Graphs/Expenses/ExpensesGraphsMenuScreen';
import ExpensesByCategoryAndYearGraphScreen from '../screens/Graphs/Expenses/ExpensesByCategoryAndYearGraphsScreen';
import ExpensesByAccountGraphScreen from '../screens/Graphs/Expenses/ExpensesByAccountGraphScreen';
import ExpensesDatesComparationGraphScreen from '../screens/Graphs/Expenses/ExpensesDatesComparationGraphScreen';
import IncomesGraphsMenuScreen from '../screens/Graphs/Incomes/IncomesGraphsMenuScreen';
import IncomesByCategoryAndDateGraphScreen from '../screens/Graphs/Incomes/IncomesByCategoryAndDateGraphScreen';
import IncomesByAccountGraphScreen from '../screens/Graphs/Incomes/IncomesByAccountGraphScreen';
import FixedExpenses from '../screens/FixedExpenses/FixedExpenses';
import ExpensesScreen from '../screens/Expenses/ExpensesScreen';
import AddFixedExpenseScreen from '../screens/FixedExpenses/AddFixedExpenseScreen';
import DetailsFixedExpenseScreen from '../screens/FixedExpenses/DetailsFixedExpenseScreen';
import ExpensesPerYearGraphScreen from '../screens/Graphs/Expenses/ExpensesPerYearGraphScreen';
import RecipientsScreen from '../screens/Recipients/RecipientsScreen';



const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const MainRouter = () =>
{
  let { isLogged, email } = useSelector(state => state.AuthReducer);
  if (isLogged == true && email == '') isLogged = false;
  return (
    <Stack.Navigator>
      {isLogged ?
        <>
          <Stack.Screen component={HomeScreen} name={Routing.home} options={{ headerShown: false }} />

          {/* FIXED EXPENSES */}
          <Stack.Screen component={FixedExpenses} options={{ headerShown: false }} name={Routing.fixedExpenses} />
          <Stack.Screen component={AddFixedExpenseScreen} options={{ headerShown: false }} name={Routing.addFixedExpense} />
          <Stack.Screen component={DetailsFixedExpenseScreen} options={{ headerShown: false }} name={Routing.editFixedExpense} />

          {/* EXPENSES */}

          <Stack.Screen component={MainExpensesScreen} options={{ headerShown: false }} name={Routing.menuExpenses} />
          <Stack.Screen component={ExpensesScreen} options={{ headerShown: false }} name={Routing.expenses} />
          <Stack.Screen component={AddExpenseOrIncomeScreen} options={{ headerShown: false }} name={Routing.addExpense} />
          <Stack.Screen component={DetailsExpenseScreen} options={{ headerShown: false }} name={Routing.detailsExpense} />
          <Stack.Screen component={HistoryExpensesScreen} options={{ headerShown: false }} name={Routing.historyExpenses} />

          {/* INCOMES */}
          <Stack.Screen component={MainIncomesScreen} options={{ headerShown: false }} name={Routing.incomes} />
          <Stack.Screen component={AddExpenseOrIncomeScreen} options={{ headerShown: false }} name={Routing.addIncome} />
          <Stack.Screen component={DetailsIncomeScreen} options={{ headerShown: false }} name={Routing.detailsIncome} />
          <Stack.Screen component={HistoryIncomesScreen} options={{ headerShown: false }} name={Routing.historyIncomes} />

          {/* ACCOUNTS */}

          <Stack.Screen component={MainAccountsScreen} options={{ headerShown: false }} name={Routing.accounts} />
          <Stack.Screen component={AddAccountScreen} options={{ headerShown: false }} name={Routing.addAccount} />
          <Stack.Screen component={AccountDetailsScreen} options={{ headerShown: false }} name={Routing.accountDetails} />
          <Stack.Screen component={EditAccountScreen} options={{ headerShown: false }} name={Routing.editAccount} />

          {/* GRAPHS*/}

          <Stack.Screen component={MainGraphsScreen} options={{ headerShown: false }} name={Routing.graphs} />
          <Stack.Screen component={IncomesGraphsMenuScreen} options={{ headerShown: false }} name={Routing.incomesGraphsMenu} />
          <Stack.Screen component={IncomesByCategoryAndDateGraphScreen} options={{ headerShown: false }} name={Routing.incomesByCategoryAndDateGraphScreen} />

          <Stack.Screen component={IncomesByAccountGraphScreen} options={{ headerShown: false }} name={Routing.incomesByAccountAndDateGraphScreen} />

          <Stack.Screen component={ExpensesGraphsMenuScreen} options={{ headerShown: false }} name={Routing.expenseGraphsMenu} />
          <Stack.Screen component={ExpensesPerMonthsGraphScreen} options={{ headerShown: false }} name={Routing.expensesPerMonthsGraphScreen} />
          <Stack.Screen component={ExpensesPerYearGraphScreen} options={{ headerShown: false }} name={Routing.expensesPerYearGraphScreen} />
          <Stack.Screen component={ExpensesByCategoryAndYearGraphScreen} options={{ headerShown: false }} name={Routing.expensesByCategoryAndYearGraphScreen} />
          <Stack.Screen component={ExpensesByAccountGraphScreen} options={{ headerShown: false }} name={Routing.expensesByAccountGraphScreen} />
          <Stack.Screen component={ExpensesDatesComparationGraphScreen} options={{ headerShown: false }} name={Routing.expensesDatesComparationGraphScreen} />

          {/* CATEGORIES */}

          <Stack.Screen component={CategoriesScreen} options={{ headerShown: false }} name={Routing.categories} />
          <Stack.Screen component={CategoryDetailsScreen} options={{ headerShown: false }} name={Routing.categoryDetails} />
          <Stack.Screen component={AddCategoryScreen} options={{ headerShown: false }} name={Routing.addCategory} />

          <Stack.Screen component={SettingsScreen} options={{ headerShown: false }} name={Routing.settings} />
          <Stack.Screen component={UserDetailsScreen} options={{ headerShown: false }} name={Routing.profile} />

          {/* RECIPIENTS */}
          <Stack.Screen component={RecipientsScreen} options={{ headerShown: false }} name={Routing.recipients} />


        </> :
        <>
          <Stack.Screen name={Routing.auth} options={{ headerShown: false }} component={AuthScreen} />
          <Stack.Screen name={Routing.login} options={{ headerShown: false }} component={LoginScreen} />
          <Stack.Screen name={Routing.register} options={{ headerShown: false }} component={RegisterScreen} />
        </>
      }


    </Stack.Navigator >
  );
};

export const MyDrawer = () =>
{

  return (
    <Drawer.Navigator initialRouteName={Routing.home}>

      {/* <Drawer.Screen
        name={Routing.categories}
        component={CategoriesScreen}
        options={{ drawerLabel: 'Categorías' }}
      /> */}
      <Drawer.Screen
        name={Routing.categories}
        component={CategoriesScreen}
        options={{ drawerLabel: 'gGastos' }}
      />
      <Drawer.Screen
        name={Routing.home}
        component={HomeScreen}
        options={{ drawerLabel: 'gGastos' }}
      />
    </Drawer.Navigator>
  )
}
export default MainRouter;
