import Types from './Types'

import
{
    getExpensesByAccountGraph,
    getExpensesByCategoryAndDate,
    getExpensesByYear,
    getExpensesDateComparation,
    getIncomesByAccountGraph,
    getIncomesByCategories
} from '../../services/api/API';

// INCOMES
export const apiGetIncomesByCategories = (month, year) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: true }));
    await dispatch(
        getIncomesByCategories(month, year, (tag, response) =>
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
        }))

    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: false }))

};
export const apiGetIncomesByAccount = (account, month, year) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: true }));
    await dispatch(
        getIncomesByAccountGraph(account, month, year, (tag, response) =>
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

export const apiGetExpensesByAccount = (account, month, year) => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingExpenses', value: true }));
    await dispatch(
        getExpensesByAccountGraph(account, month, year, (tag, response) =>
        {
            console.log('getExpensesByAccountGraph - ERROR: ', response);
            dispatch({ type: Types.GET_EXPENSE_GRAPHS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getExpensesByAccountGraph - SUCCESS: ', response);
            dispatch({
                type: Types.GET_EXPENSE_GRAPHS_SUCCESS,
                payload: response.data.expenses,
            });
            dispatch(setGraphDataState({ prop: 'errors', value: null }))

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
