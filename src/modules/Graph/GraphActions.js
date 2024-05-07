import Types from './Types'

import
{
    getExpensesByAccountPerMonthGraph as getExpensesByAccountPerMonthGraph,
    getExpensesByAccountPerYearGraph,
    getExpensesByCategoryAndDate,
    getExpensesByYear,
    getExpensesDateComparation,
    getExpensesGroupedByCategory,
    getGraphOverview,
    getIncomesByAccountPerMonthGraph,
    getIncomesByAccountPerYearGraph,
    getIncomesByCategories,
    getIncomesByCategoryAndDate,
    getIncomesByYear,
    getIncomesDateComparation,
    getIncomesGroupedByCategory
} from '../../services/api/API';

export const apiGetGraphOverview = () => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingOverview', value: true }));
    await dispatch(
        getGraphOverview((tag, response) =>
        {
            console.log('getGraphOverview - ERROR: ', response);
            dispatch({ type: Types.GET_OVERVIEW_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getGraphOverview - SUCCESS: ', response);
            dispatch({
                type: Types.GET_OVERVIEW_GRAPHS_SUCCESS,
                payload: response.data,
            });
        }))

    dispatch(setGraphDataState({ prop: 'isLoadingOverview', value: false }))

};

// INCOMES

export const apiGetIncomesByCategoryAndDate = (month, year) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: true }));
    await dispatch(
        getIncomesByCategoryAndDate(month, year, (tag, response) =>
        {
            console.log('getIncomesByCategoryAndDate - ERROR: ', response);
            dispatch({ type: Types.GET_INCOME_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getIncomesByCategoryAndDate - SUCCESS: ', response);
            dispatch({
                type: Types.GET_INCOME_GRAPHS_SUCCESS,
                payload: response.data.incomes,
            });
            dispatch(setGraphDataState({ prop: 'errors', value: null }))

        }))

    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: false }))

};

export const apiGetIncomesByYear = (year, category) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: true }));
    await dispatch(
        getIncomesByYear(year, category, (tag, response) =>
        {
            console.log('getIncomesByYear - ERROR: ', response);
            dispatch({ type: Types.GET_INCOME_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getIncomesByYear - SUCCESS: ', response);
            dispatch({
                type: Types.GET_INCOME_GRAPHS_SUCCESS,
                payload: response.data.incomes,
            });
            dispatch(setGraphDataState({ prop: 'errors', value: null }))

        }))

    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: false }))

};

export const apiGetIncomesDateComparation = (year, yearTwo, month, monthTwo) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: true }));
    await dispatch(
        getIncomesDateComparation(year, yearTwo, month, monthTwo, (tag, response) =>
        {
            console.log('getIncomesDateComparation - ERROR: ', response);
            dispatch({ type: Types.GET_INCOME_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getIncomesDateComparation - SUCCESS: ', response);
            dispatch({
                type: Types.GET_INCOME_GRAPHS_SUCCESS,
                payload: response.data.incomes,
            });
            dispatch(setGraphDataState({ prop: 'errors', value: null }))

        }))

    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: false }))

};

export const apiGetIncomesByAccountPerMonth = (account, month, year) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: true }));
    await dispatch(
        getIncomesByAccountPerMonthGraph(account, month, year, (tag, response) =>
        {
            console.log('getIncomesByAccountGraph - ERROR: ', response);
            dispatch({ type: Types.GET_INCOME_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getIncomesByAccountGraph - SUCCESS: ', response);
            dispatch({
                type: Types.GET_INCOME_GRAPHS_SUCCESS,
                payload: response.data.incomes,
            });
            dispatch(setGraphDataState({ prop: 'errors', value: null }))

        }))

    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: false }))

};
export const apiGetIncomesByAccountPerYear = (account, year) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: true }));
    await dispatch(
        getIncomesByAccountPerYearGraph(account, year, (tag, response) =>
        {
            console.log('getIncomesByAccountGraph - ERROR: ', response);
            dispatch({ type: Types.GET_INCOME_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getIncomesByAccountGraph - SUCCESS: ', response);
            dispatch({
                type: Types.GET_INCOME_GRAPHS_SUCCESS,
                payload: response.data.incomes,
            });
            dispatch(setGraphDataState({ prop: 'errors', value: null }))

        }))

    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: false }))

};


export const apiGetIncomesGroupedByCategory = (year) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: true }));
    await dispatch(
        getIncomesGroupedByCategory(year, (tag, response) =>
        {
            console.log('getIncomesGroupedByCategory - ERROR: ', response);
            dispatch({ type: Types.GET_INCOME_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getIncomesGroupedByCategory - SUCCESS: ', response);
            dispatch({
                type: Types.GET_INCOME_GRAPHS_SUCCESS,
                payload: response.data.incomes,
            });
        }))

    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: false }))

};


// EXPENSES
export const apiGetExpensesByCategoryAndDate = (month, year) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: true }));
    await dispatch(
        getExpensesByCategoryAndDate(month, year, (tag, response) =>
        {
            console.log('getExpensesByCategoryAndDate - ERROR: ', response);
            dispatch({ type: Types.GET_EXPENSE_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getExpensesByCategoryAndDate - SUCCESS: ', response);
            dispatch({
                type: Types.GET_EXPENSE_GRAPHS_SUCCESS,
                payload: response.data.expenses,
            });
            dispatch(setGraphDataState({ prop: 'errors', value: null }))

        }))

    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: false }))

};

export const apiGetExpensesByYear = (year, category) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: true }));
    await dispatch(
        getExpensesByYear(year, category, (tag, response) =>
        {
            console.log('getExpensesByYear - ERROR: ', response);
            dispatch({ type: Types.GET_EXPENSE_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getExpensesByYear - SUCCESS: ', response);
            dispatch({
                type: Types.GET_EXPENSE_GRAPHS_SUCCESS,
                payload: response.data.expenses,
            });
            dispatch(setGraphDataState({ prop: 'errors', value: null }))

        }))

    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: false }))

};

export const apiGetExpensesDateComparation = (year, yearTwo, month, monthTwo) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: true }));
    await dispatch(
        getExpensesDateComparation(year, yearTwo, month, monthTwo, (tag, response) =>
        {
            console.log('getExpensesDateComparation - ERROR: ', response);
            dispatch({ type: Types.GET_EXPENSE_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getExpensesDateComparation - SUCCESS: ', response);
            dispatch({
                type: Types.GET_EXPENSE_GRAPHS_SUCCESS,
                payload: response.data.expenses,
            });
            dispatch(setGraphDataState({ prop: 'errors', value: null }))

        }))

    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: false }))

};

export const apiGetExpensesByAccountPerMonth = (account, month, year) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: true }));
    await dispatch(
        getExpensesByAccountPerMonthGraph(account, month, year, (tag, response) =>
        {
            console.log('apiGetExpensesByAccountPerMonth - ERROR: ', response);
            dispatch({ type: Types.GET_EXPENSE_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('apiGetExpensesByAccountPerMonth - SUCCESS: ', response);
            dispatch({
                type: Types.GET_EXPENSE_GRAPHS_SUCCESS,
                payload: response.data.expenses,
            });
            dispatch(setGraphDataState({ prop: 'errors', value: null }))

        }))

    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: false }))

};
export const apiGetExpensesByAccountPerYear = (account, year) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: true }));
    await dispatch(
        getExpensesByAccountPerYearGraph(account, year, (tag, response) =>
        {
            console.log('getExpensesByAccountPerYearGraph - ERROR: ', response);
            dispatch({ type: Types.GET_EXPENSE_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getExpensesByAccountPerYearGraph - SUCCESS: ', response);
            dispatch({
                type: Types.GET_EXPENSE_GRAPHS_SUCCESS,
                payload: response.data.expenses,
            });
            dispatch(setGraphDataState({ prop: 'errors', value: null }))

        }))

    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: false }))

};
export const apiGetExpensesGroupedByCategory = (year) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: true }));
    await dispatch(
        getExpensesGroupedByCategory(year, (tag, response) =>
        {
            console.log('getExpensesGroupedByCategory - ERROR: ', response);
            dispatch({ type: Types.GET_EXPENSE_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getExpensesGroupedByCategory - SUCCESS: ', response);
            dispatch({
                type: Types.GET_EXPENSE_GRAPHS_SUCCESS,
                payload: response.data.expenses,
            });
        }))

    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: false }))

};


export const clearGraphData = () => ({
    type: Types.CLEAR_DATA_GRAPH,
});

export const setGraphDataState = ({ prop, value }) => ({
    type: Types.PUT_DATA_GRAPH,
    payload: { prop, value },
});
