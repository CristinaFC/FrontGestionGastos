import Types from './Types'

import * as RootRouting from '../../navigation/RootRouting'
import Routing from '../../navigation/Routing';
import { getExpensesByCategoryAndDate, getExpensesByYear, getIncomesByCategoryAndDate } from '../../services/api/API';

export const apiGetIncomesByCategoryAndDate = () => async (dispatch, getState) =>
{
    dispatch(setGraphDataState({ prop: 'isLoadingIncomes', value: true }));
    await dispatch(
        getIncomesByCategoryAndDate((tag, response) =>
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


export const clearGraphData = () => ({
    type: Types.CLEAR_DATA_GRAPH,
});

export const setGraphDataState = ({ prop, value }) => ({
    type: Types.PUT_DATA_GRAPH,
    payload: { prop, value },
});
