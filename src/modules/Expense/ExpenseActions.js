import Types from './Types'

import { deleteExpense, getExpenseById, getExpenses, getExpensesByAccount, getExpensesByCategory, getRecentExpenses, postExpense, putExpenseById } from '../../services/api/API';
import * as RootRouting from '../../navigation/RootRouting'
import Routing from '../../navigation/Routing';

export const apiGetExpenses = () => async (dispatch, getState) =>
{
    dispatch(setExpenseDataState({ prop: 'isLoadingExpenses', value: true }));
    await dispatch(
        getExpenses((tag, response) =>
        {
            console.log('getExpenses - ERROR: ', response);
            dispatch({ type: Types.GET_EXPENSES_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getExpenses - SUCCESS: ', response);
            dispatch({
                type: Types.GET_EXPENSES_SUCCESS,
                payload: response.data.expenses,
            });
        }))

    dispatch(setExpenseDataState({ prop: 'isLoadingExpenses', value: false }))

};

export const apiGetExpensesByAccount = (id) => async (dispatch, getState) =>
{

    dispatch(setExpenseDataState({ prop: 'isLoadingExpenses', value: true }));

    await dispatch(
        getExpensesByAccount(id, (tag, response) =>
        {
            console.log('getExpensesByAccount - ERROR: ', response);
            dispatch({ type: Types.GET_EXPENSES_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getExpensesByAccount - SUCCESS: ', response);
            dispatch({
                type: Types.GET_EXPENSES_SUCCESS,
                payload: response.data.expenses,
            });
        }))

    dispatch(setExpenseDataState({ prop: 'isLoadingExpenses', value: false }))

};

export const apiGetExpensesByCategory = (categoryId) => async (dispatch, getState) =>
{
    dispatch(setExpenseDataState({ prop: 'isLoadingExpenses', value: true }));
    await dispatch(
        getExpensesByCategory(categoryId, (tag, response) =>
        {
            console.log('getExpenses - ERROR: ', response);
            dispatch({ type: Types.GET_EXPENSES_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getExpenses - SUCCESS: ', response);
            dispatch({
                type: Types.GET_EXPENSES_SUCCESS,
                payload: response.data.expenses,
            });
        }))

    dispatch(setExpenseDataState({ prop: 'isLoadingExpenses', value: false }))

};

export const apiGetRecentExpenses = (limit) => async (dispatch, getState) =>
{
    dispatch(setExpenseDataState({ prop: 'isLoadingExpenses', value: true }));
    await dispatch(
        getRecentExpenses(limit, (tag, response) =>
        {
            console.log('getRecentExpenses - ERROR: ', response);
            dispatch({ type: Types.GET_EXPENSES_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getRecentExpenses - SUCCESS: ', response);
            dispatch({
                type: Types.GET_EXPENSES_SUCCESS,
                payload: response.data.expenses,
            });
        }))

    dispatch(setExpenseDataState({ prop: 'isLoadingExpenses', value: false }))

};

export const apiGetExpenseById = (id) => async (dispatch, getState) =>
{

    dispatch(setExpenseDataState({ prop: 'isLoadingExpense', value: true }));

    await dispatch(
        getExpenseById(id, (tag, response) =>
        {
            console.log('getExpenseById - ERROR: ', response);
            dispatch({ type: Types.GET_EXPENSE_DETAILS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getExpenseById - SUCCESS: ', response);
            dispatch({
                type: Types.GET_EXPENSE_DETAILS_SUCCESS,
                payload: response.data.expense,
            });
        }))

    dispatch(setExpenseDataState({ prop: 'isLoadingExpense', value: false }))

};

export const apiPutExpenseById = (id, params) => async (dispatch, getState) =>
{

    dispatch(setExpenseDataState({ prop: 'isLoadingExpense', value: true }));
    await dispatch(
        putExpenseById(id, params, (tag, response) =>
        {
            console.log('putExpenseById - ERROR: ', response);
            dispatch({ type: Types.PUT_DATA_EXPENSE_FAIL, payload: response });
        }, (tag, response) =>
        {
            console.log('putExpenseById - SUCCESS: ', response);
            dispatch({
                type: Types.PUT_DATA_EXPENSE_SUCCESS,
                payload: response.data.expense,
            });
        }))


    dispatch(clearExpenseData())
    dispatch(apiGetExpenses())
    RootRouting.goBack()
    dispatch(setExpenseDataState({ prop: 'isLoadingExpense', value: false }));

};

export const apiPostExpense = (params) => async (dispatch, getState) =>
{

    dispatch(setExpenseDataState({ prop: 'isLoadingExpense', value: true }));
    await dispatch(
        postExpense(params, (tag, response) =>
        {
            console.log('postExpense - ERROR: ', response);
            dispatch({ type: Types.POST_EXPENSE_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('postExpense - SUCCESS: ', response);
            dispatch({ type: Types.POST_EXPENSE_SUCCESS, payload: response });
            RootRouting.navigate(Routing.expenses)
            dispatch(apiGetRecentExpenses(4))

        })
    );
    dispatch(setExpenseDataState({ prop: 'isLoadingExpense', value: false }));
};

export const apiDeleteExpense = (id) => async (dispatch, getState) =>
{

    await dispatch(
        deleteExpense(id, (tag, response) =>
        {
            console.log('deleteExpense - ERROR: ', response);
            dispatch({ type: Types.DELETE_EXPENSE_FAIL, payload: response });
        }, (tag, response) =>
        {
            console.log('deleteExpense - SUCCESS: ', response);
            dispatch({ type: Types.DELETE_EXPENSE_SUCCESS, payload: response });


        })
    );
    RootRouting.navigate(Routing.accounts)
    dispatch(apiGetExpenses())

};

export const clearExpenseData = () => ({
    type: Types.CLEAR_DATA_EXPENSE,
});

export const setExpenseDataState = ({ prop, value }) => ({
    type: Types.PUT_DATA_EXPENSE,
    payload: { prop, value },
});
