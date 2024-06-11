import Tags from './Tags';
import Config from 'react-environment';
import axios from 'axios';

import { BASE_URL } from "@env"

import { clearDataLogin } from '../../modules/Auth/AuthActions';
import { Alert } from 'react-native';
import Routing from '../../navigation/Routing';
import * as RootRouting from '../../navigation/RootRouting'


const DEL = 'DELETE';
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';


// EXTERNAL

export const getCurrencyExchange = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `api.frankfurter.app/latest`;
    let config = {}

    return dispatch(launchAsyncTask(Tags.GET_CURRENCY_EXCHANGE, GET, url, config, params, callbackError, callbackSuccess));
};
// GRAPHS

export const getGraphOverview = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/graphs/overview`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_GRAPH, GET, url, config, params, callbackError, callbackSuccess));
};
export const getIncomesGroupedByCategory = (year, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/incomes?year=${year}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_INCOMES, GET, url, config, params, callbackError, callbackSuccess));
};
export const getIncomesByCategoryAndDate = (month, year, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/graphs/incomes?month=${month}&year=${year}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_GRAPH, GET, url, config, params, callbackError, callbackSuccess));
};

export const getIncomesByYear = (year, category, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/graphs/incomes?year=${year}&category=${category}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_GRAPH, GET, url, config, params, callbackError, callbackSuccess));
};
export const getIncomesByAccountPerMonthGraph = (account, month, year, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/graphs/incomes?month=${month}&year=${year}&account=${account}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_GRAPH, GET, url, config, params, callbackError, callbackSuccess));
};

export const getIncomesByAccountPerYearGraph = (account, year, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/graphs/incomes?year=${year}&account=${account}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_GRAPH, GET, url, config, params, callbackError, callbackSuccess));
};
export const getIncomesDateComparation = (year, yearTwo, month, monthTwo, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/graphs/incomes?year=${year}&yearTwo=${yearTwo}&month=${month}&monthTwo=${monthTwo}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_GRAPH, GET, url, config, params, callbackError, callbackSuccess));
};

export const getExpensesByCategoryAndDate = (month, year, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/graphs/expenses?month=${month}&year=${year}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_GRAPH, GET, url, config, params, callbackError, callbackSuccess));
};

export const getExpensesByYear = (year, category, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/graphs/expenses?year=${year}&category=${category}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_GRAPH, GET, url, config, params, callbackError, callbackSuccess));
};
export const getExpensesByAccountPerMonthGraph = (account, month, year, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/graphs/expenses?month=${month}&year=${year}&account=${account}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_GRAPH, GET, url, config, params, callbackError, callbackSuccess));
};

export const getExpensesByAccountPerYearGraph = (account, year, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/graphs/expenses?year=${year}&account=${account}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_GRAPH, GET, url, config, params, callbackError, callbackSuccess));
};
export const getExpensesDateComparation = (year, yearTwo, month, monthTwo, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/graphs/expenses?year=${year}&yearTwo=${yearTwo}&month=${month}&monthTwo=${monthTwo}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_GRAPH, GET, url, config, params, callbackError, callbackSuccess));
};
// AUTH
export const postLogin = (email, password, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/auth/login`;

    let config = {};
    let params = {
        email,
        password,
    };

    return dispatch(launchAsyncTask(Tags.POST_LOGIN, POST, url, config, params, callbackError, callbackSuccess));
};
export const logout = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};

    let url = `${BASE_URL}/api/auth/logout`;
    const { authToken } = getState().AuthReducer

    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };


    return dispatch(launchAsyncTask(Tags.GET_LOGOUT, GET, url, config, params, callbackError, callbackSuccess));
};
export const refreshToken = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let url = `${BASE_URL}/api/auth/refresh`;
    const { refreshToken } = getState().AuthReducer


    let config = {
        headers: { Authorization: 'Bearer ' + refreshToken },
    };

    let params = {};

    return dispatch(launchAsyncTask(Tags.REFRESH_TOKEN, POST, url, config, params, callbackError, callbackSuccess));
};

//  ACCOUNTS
export const postAccount = (params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/accounts`;
    const { authToken } = getState().AuthReducer


    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.POST_ACCOUNT, POST, url, config, params, callbackError, callbackSuccess));
};
export const getAccounts = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/accounts`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_ACCOUNTS, GET, url, config, params, callbackError, callbackSuccess));
};
export const transfer = (params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let url = `${BASE_URL}/api/accounts/transfer`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.TRANSFER, POST, url, config, params, callbackError, callbackSuccess));
};
export const deleteAccount = (id, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/accounts/${id}`;
    const { authToken } = getState().AuthReducer
    let params = {};
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.DELETE_ACCOUNT, DEL, url, config, params, callbackError, callbackSuccess));
};
export const getAccountById = (id, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/accounts/${id}`
    const { authToken } = getState().AuthReducer
    let params = {};

    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_ACCOUNT_BY_ID, GET, url, config, params, callbackError, callbackSuccess));
};
export const putAccountById = (id, params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/accounts/${id}`;
    const { authToken } = getState().AuthReducer


    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.PUT_ACCOUNT, PUT, url, config, params, callbackError, callbackSuccess));
};

// FIXED EXPENSES
export const postFixedExpense = (params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/fixedExpenses`;
    const { authToken } = getState().AuthReducer


    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.POST_FIXED_EXPENSE, POST, url, config, params, callbackError, callbackSuccess));
};
export const getFixedExpenses = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/fixedExpenses`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_FIXED_EXPENSES, GET, url, config, params, callbackError, callbackSuccess));
};
export const getFixedExpenseById = (id, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/fixedExpenses/${id}`;
    const { authToken } = getState().AuthReducer
    let params = {};

    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_FIXED_EXPENSE_BY_ID, GET, url, config, params, callbackError, callbackSuccess));
};
export const putFixedExpenseById = (id, params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/fixedExpenses/${id}`;
    const { authToken } = getState().AuthReducer

    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.PUT_FIXED_EXPENSE, PUT, url, config, params, callbackError, callbackSuccess));
};

//  RECIPIENTS
export const postRecipient = (params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/recipients`;
    const { authToken } = getState().AuthReducer


    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.POST_RECIPIENT, POST, url, config, params, callbackError, callbackSuccess));
};
export const getRecipients = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/recipients`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_RECIPIENTS, GET, url, config, params, callbackError, callbackSuccess));
};


//  EXPENSES
export const postExpense = (params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/expenses`;
    const { authToken } = getState().AuthReducer


    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.POST_EXPENSE, POST, url, config, params, callbackError, callbackSuccess));
};
export const getExpensesGroupedByCategory = (year, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/expenses?year=${year}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_EXPENSES, GET, url, config, params, callbackError, callbackSuccess));
};
export const getExpenses = (month, year, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/expenses?month=${month}&year=${year}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_EXPENSES, GET, url, config, params, callbackError, callbackSuccess));
};
export const getExpensesByCategory = (categoryId, month, year, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/expenses?category=${categoryId}&month=${month}&year=${year}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_EXPENSES, GET, url, config, params, callbackError, callbackSuccess));
};
export const getRecentExpenses = (limit, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/expenses?recents=true&limit=${limit}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_EXPENSES, GET, url, config, params, callbackError, callbackSuccess));
};
export const getExpensesByAccount = (id, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/expenses?account=${id}`;
    const { authToken } = getState().AuthReducer
    let params = {};

    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_EXPENSES, GET, url, config, params, callbackError, callbackSuccess));
};
export const getExpenseById = (id, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/expenses/${id}`;
    const { authToken } = getState().AuthReducer
    let params = {};

    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_EXPENSE_BY_ID, GET, url, config, params, callbackError, callbackSuccess));
};
export const putExpenseById = (id, params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/expenses/${id}`;
    const { authToken } = getState().AuthReducer


    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.PUT_EXPENSE, PUT, url, config, params, callbackError, callbackSuccess));
};
export const deleteExpense = (id, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/expenses/${id}`;
    const { authToken } = getState().AuthReducer
    let params = {};
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.DELETE_EXPENSE, DEL, url, config, params, callbackError, callbackSuccess));
};

//  INCOMES
export const postIncome = (params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/incomes`;
    const { authToken } = getState().AuthReducer


    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.POST_INCOME, POST, url, config, params, callbackError, callbackSuccess));
};
export const getIncomes = (month, year, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/incomes?month=${month}&year=${year}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_INCOMES, GET, url, config, params, callbackError, callbackSuccess));
};
export const getIncomesByCategory = (categoryId, month, year, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/incomes?category=${categoryId}&month=${month}&year=${year}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_INCOMES, GET, url, config, params, callbackError, callbackSuccess));
};
export const getRecentIncomes = (limit, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/incomes?recents=true&limit=${limit}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_INCOMES, GET, url, config, params, callbackError, callbackSuccess));
};
export const getIncomesByAccount = (id, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let url = `${BASE_URL}/api/incomes?account=${id}`;
    const { authToken } = getState().AuthReducer
    let params = {};

    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_INCOMES, GET, url, config, params, callbackError, callbackSuccess));
};
export const getIncomeById = (id, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/incomes/${id}`;
    const { authToken } = getState().AuthReducer
    let params = {};

    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_INCOME_BY_ID, GET, url, config, params, callbackError, callbackSuccess));
};
export const putIncomeById = (id, params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/incomes/${id}`;
    const { authToken } = getState().AuthReducer


    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.PUT_INCOME, PUT, url, config, params, callbackError, callbackSuccess));
};
export const deleteIncome = (id, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/incomes/${id}`;
    const { authToken } = getState().AuthReducer
    let params = {};
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.DELETE_INCOME, DEL, url, config, params, callbackError, callbackSuccess));
};


//  BALANCE
export const getBalance = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/balances`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_BALANCE, GET, url, config, params, callbackError, callbackSuccess));
};
export const getPrediction = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/balances/prediction`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_PREDICTION, GET, url, config, params, callbackError, callbackSuccess));
};

//  USER
export const postUser = (params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/users`;
    let config = {};

    return dispatch(launchAsyncTask(Tags.POST_USER, POST, url, config, params, callbackError, callbackSuccess));
};

export const putUser = (params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let url = `${BASE_URL}/api/users`;

    const { authToken } = getState().AuthReducer

    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };
    return dispatch(launchAsyncTask(Tags.PUT_USER, PUT, url, config, params, callbackError, callbackSuccess));
};

export const getUser = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/users/`;
    const { authToken } = getState().AuthReducer

    let params = {};

    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_USER, GET, url, config, params, callbackError, callbackSuccess));
};

export const deleteUser = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/users`;
    const { authToken } = getState().AuthReducer
    let params = {};
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.DELETE_USER, DEL, url, config, params, callbackError, callbackSuccess));
};

//  CATEGORIES
export const getCategories = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/categories`

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_CATEGORIES, GET, url, config, params, callbackError, callbackSuccess));
};

export const getCategoriesByType = (type, callbackError, callbackSuccess) => async (dispatch, getState) =>
{
    let params = {};
    let url = `${BASE_URL}/api/categories?type=${type}`;

    const { authToken } = getState().AuthReducer
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_CATEGORIES, GET, url, config, params, callbackError, callbackSuccess));
};

export const getCategoryById = (id, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/categories/${id}`;
    const { authToken } = getState().AuthReducer
    let params = {};

    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_CATEGORY_BY_ID, GET, url, config, params, callbackError, callbackSuccess));
};
export const getCategoriesWithLimit = (callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/categories?limit=true`;
    const { authToken } = getState().AuthReducer
    let params = {};

    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.GET_CATEGORIES, GET, url, config, params, callbackError, callbackSuccess));
};

export const putCategoryById = (id, params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/categories/${id}`;
    const { authToken } = getState().AuthReducer


    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.PUT_CATEGORY, PUT, url, config, params, callbackError, callbackSuccess));
};

export const postCategory = (params, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/categories`;
    const { authToken } = getState().AuthReducer


    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.POST_CATEGORY, POST, url, config, params, callbackError, callbackSuccess));
};

export const deleteCategory = (id, callbackError, callbackSuccess) => async (dispatch, getState) =>
{

    let url = `${BASE_URL}/api/categories/${id}`;
    const { authToken } = getState().AuthReducer
    let params = {};
    let config = {
        headers: { Authorization: 'Bearer ' + authToken },
    };

    return dispatch(launchAsyncTask(Tags.DELETE_CATEGORY, DEL, url, config, params, callbackError, callbackSuccess));
};



export const launchAsyncTask = (tag, verb, url, config, params, callbackError, callbackSuccess) => async (dispatch) =>
{
    let httpClient = axios.create();
    let baseUrl = Config.BASE_URL;
    let response = null;
    httpClient.defaults.baseURL = baseUrl

    if (verb === DEL)
    {
        await httpClient
            .delete(url, config)
            .then((result) =>
            {
                response = result;
            })
            .catch((error) =>
            {
                response = error.response;
            });
    }

    if (verb === GET)
    {
        await httpClient
            .get(url, config)
            .then((result) =>
            {
                response = result;
            })
            .catch((error) =>
            {
                Alert.alert(
                    `Error`,
                    `Ha ocurrido un error. Reinicie la app e inténtelo más tarde`,
                    [{
                        text: 'Aceptar'
                    }]
                );
                response = error.response;
            });
    }

    if (verb === POST)
    {
        await httpClient
            .post(url, params, config)
            .then((result) =>
            {
                response = result;
            })
            .catch((error) =>
            {
                response = error.response;
            });
    }

    if (verb === PUT)
    {
        await httpClient
            .put(url, params, config)
            .then((result) =>
            {
                response = result;
            })
            .catch((error) =>
            {
                response = error.response;
            });
    }


    dispatch(onResponse(tag, response, callbackError, callbackSuccess));
};

export const onResponse = (tag, response, callbackError, callbackSuccess) => async (dispatch) =>
{
    console.log('TAG: ', tag, ' | Response: ', response);

    if (response === undefined || response === null) return;

    switch (response.status)
    {
        case 200:
            callbackSuccess(tag, response.data);
            break;

        case 400:
            callbackError(tag, response.data);
            break;

        case 401:

            if (response?.data?.message?.match(/expired|jwt|Token/g))
            {
                dispatch(clearDataLogin())
                break;
            }
            console.log(response)

            callbackError(tag, [{ status: 401, message: 'La contraseña no coincide' }]);

            break;

        case 402:
            if (response.data && response.data.error && response.data.error === 'invalidUsername')
            {
                callbackSuccess(tag, response);
            }
            break;

        case 403:
            if (response.data && response.data.response && response.data.response.length > 0)
            {
                callbackError(tag, response);
            }
            break;

        case 404:
            callbackError(tag, [{ status: 404, message: 'No se ha encontrado' }]);
            break;
        case 409:
            callbackError(tag, [{ status: 409, message: 'Ya existe' }]);
            break;
        default:
            Alert.alert(
                `Error`,
                `Ha ocurrido un error. Reinicie la app e inténtelo más tarde`,
                [{
                    text: 'Aceptar',
                    onPress: () => RootRouting.navigate(Routing.home),
                    style: 'cancel',
                }]
            );
            callbackError(tag, response);
            break;
    }
};
