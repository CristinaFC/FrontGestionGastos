import { Actions } from 'react-native-router-flux';


export default class Routing
{
    static navBar = 'NavBar';
    static settings = 'settings';
    static profile = 'profile';
    static home = 'home';
    static auth = 'auth';
    static login = 'login';
    static logout = 'logout';
    static register = 'register';
    static forgotPassword = 'forgotPassword';

    // EXPENSES
    static expenses = 'expenses';
    static addExpense = 'addExpense';
    static historyExpenses = 'historyExpenses';
    static detailsExpense = 'detailsExpense';

    // INCOMES
    static incomes = 'incomes';
    static addIncome = 'addIncome';
    static historyIncomes = 'historyIncomes';
    static detailsIncome = 'detailsIncome';

    //CATEGORIES
    static categories = 'categories';
    static categoryDetails = 'categoryDetails';
    static addCategory = 'addCategory';

    // ACCOUNTS
    static accounts = 'accounts';
    static addAccount = 'addAccount';
    static accountDetails = 'accountDetails';
    static editAccount = 'editAccount';

    // GRAPHS
    static graphs = 'graphs';
    static incomeGraphs = 'incomeGraphs';
    static expenseGraphs = 'expenseGraphs';



}