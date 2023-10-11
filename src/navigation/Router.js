import React from 'react';
import Routing from './Routing';
import HomeScreen from '../screens/HomeScreen';
import { AddExpenseScreen, DetailsExpenseScreen, HistoryExpensesScreen, MainExpensesScreen } from '../screens/Expenses';
import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import { AddIncomeScreen, DetailsIncomeScreen, HistoryIncomesScreen, MainIncomesScreen } from '../screens/Incomes';

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
import ExpensesByCategoryAndDateGraphScreen from '../screens/Graphs/Expenses/ExpensesByCategoryAndDateGraphScreen';
import ExpensesGraphsMenuScreen from '../screens/Graphs/Expenses/ExpensesGraphsMenuScreen';
import ExpensesByYearGraphScreen from '../screens/Graphs/Expenses/ExpensesByYearGraphsScreen';
import ExpensesByAccountAndDateGraphScreen from '../screens/Graphs/Expenses/ExpensesByAccountAndDateGraphScreen';



const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const MainRouter = () =>
{
  const { isLogged } = useSelector(state => state.AuthReducer);
  return (
    <Stack.Navigator>
      {isLogged ?
        <>
          <Stack.Screen component={HomeScreen} name={Routing.home} options={{ headerShown: false }} />

          <Stack.Screen component={MainExpensesScreen} options={{ headerShown: false }} name={Routing.expenses} />
          <Stack.Screen component={AddExpenseScreen} options={{ headerShown: false }} name={Routing.addExpense} />
          <Stack.Screen component={DetailsExpenseScreen} options={{ headerShown: false }} name={Routing.detailsExpense} />
          <Stack.Screen component={HistoryExpensesScreen} options={{ headerShown: false }} name={Routing.historyExpenses} />

          <Stack.Screen component={MainIncomesScreen} options={{ headerShown: false }} name={Routing.incomes} />
          <Stack.Screen component={AddIncomeScreen} options={{ headerShown: false }} name={Routing.addIncome} />
          <Stack.Screen component={DetailsIncomeScreen} options={{ headerShown: false }} name={Routing.detailsIncome} />
          <Stack.Screen component={HistoryIncomesScreen} options={{ headerShown: false }} name={Routing.historyIncomes} />

          <Stack.Screen component={MainAccountsScreen} options={{ headerShown: false }} name={Routing.accounts} />
          <Stack.Screen component={AddAccountScreen} options={{ headerShown: false }} name={Routing.addAccount} />
          <Stack.Screen component={AccountDetailsScreen} options={{ headerShown: false }} name={Routing.accountDetails} />
          <Stack.Screen component={EditAccountScreen} options={{ headerShown: false }} name={Routing.editAccount} />

          <Stack.Screen component={MainGraphsScreen} options={{ headerShown: false }} name={Routing.graphs} />
          <Stack.Screen component={IncomesGraphsScreen} options={{ headerShown: false }} name={Routing.incomeGraphs} />
          <Stack.Screen component={ExpensesGraphsMenuScreen} options={{ headerShown: false }} name={Routing.expenseGraphsMenu} />
          <Stack.Screen component={ExpensesByCategoryAndDateGraphScreen} options={{ headerShown: false }} name={Routing.expensesByCategoryAndDateGraphScreen} />
          <Stack.Screen component={ExpensesByYearGraphScreen} options={{ headerShown: false }} name={Routing.expensesByYearGraphScreen} />
          <Stack.Screen component={ExpensesByAccountAndDateGraphScreen} options={{ headerShown: false }} name={Routing.expensesByAccountAndDateGraphScreen} />


          <Stack.Screen component={CategoriesScreen} options={{ headerShown: false }} name={Routing.categories} />
          <Stack.Screen component={CategoryDetailsScreen} options={{ headerShown: false }} name={Routing.categoryDetails} />
          <Stack.Screen component={AddCategoryScreen} options={{ headerShown: false }} name={Routing.addCategory} />

          <Stack.Screen component={SettingsScreen} options={{ headerShown: false }} name={Routing.settings} />
          <Stack.Screen component={UserDetailsScreen} options={{ headerShown: false }} name={Routing.profile} />
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
