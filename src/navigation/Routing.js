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

    //FIXED EXPENSES
    static fixedExpenses = 'fixedExpenses';
    static addFixedExpense = 'addFixedExpense';
    static editFixedExpense = 'editFixedExpense';

    // EXPENSES
    static expenses = 'expenses';
    static menuExpenses = 'menuExpenses';
    static fixedExpenses = 'fixedExpenses';
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

    // RECIPIENTS
    static recipients = 'recipients';
    static addRecipient = 'addRecipient';

    // GRAPHS
    static graphs = 'graphs';

    static expensesPerMonthsGraphScreen = 'expensesPerMonthsGraphScreen';
    static expensesPerYearGraphScreen = 'expensesPerYearGraphScreen';
    static expensesByCategoryAndYearGraphScreen = 'expensesByCategoryAndYearGraphScreen';
    static expensesByAccountGraphScreen = 'expensesByAccountGraphScreen';
    static expensesDatesComparationGraphScreen = 'expensesDatesComparationGraphScreen';

    static incomesByCategoryAndDateGraphScreen = 'incomesByCategoryAndDateGraphScreen';
    static incomesByYearGraphScreen = 'incomesByYearGraphScreen';
    static incomesByAccountAndDateGraphScreen = 'incomesByAccountAndDateGraphScreen';
    static incomesDatesComparationGraphScreen = 'incomesDatesComparationGraphScreen';

    static expenseGraphsMenu = 'expenseGraphsMenu';
    static incomesGraphsMenu = 'incomesGraphsMenu';




}