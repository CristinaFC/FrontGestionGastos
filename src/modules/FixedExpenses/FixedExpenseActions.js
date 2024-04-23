import Types from './Types'

import { getFixedExpenseById, getFixedExpenses, postFixedExpense, putFixedExpenseById } from '../../services/api/API';
import * as RootRouting from '../../navigation/RootRouting'
import Routing from '../../navigation/Routing';


export const apiGetFixedExpenses = () => async (dispatch, getState) =>
{

    dispatch(setFixedExpenseDataState({ prop: 'isLoadingFixedExpenses', value: true }));
    await dispatch(
        getFixedExpenses((tag, response) =>
        {
            console.log('apiGetFixedExpenses - ERROR: ', response);
            dispatch({ type: Types.GET_FIXED_EXPENSES_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('apiGetFixedExpenses - SUCCESS: ', response);
            dispatch({
                type: Types.GET_FIXED_EXPENSES_SUCCESS,
                payload: response.data.expenses,
            });
        }))

    dispatch(setFixedExpenseDataState({ prop: 'isLoadingFixedExpenses', value: false }))

};


export const apiPostFixedExpense = (params) => async (dispatch, getState) =>
{

    dispatch(setFixedExpenseDataState({ prop: 'isLoadingFixedExpenses', value: true }));
    await dispatch(
        postFixedExpense(params, (tag, response) =>
        {
            console.log('apiPostFixedExpense - ERROR: ', response);
            dispatch({ type: Types.POST_FIXED_EXPENSE_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('apiPostFixedExpense - SUCCESS: ', response);
            dispatch({ type: Types.POST_FIXED_EXPENSE_SUCCESS, payload: response });
            RootRouting.navigate(Routing.menuExpenses)
            dispatch(apiGetFixedExpenses())
        })
    );
    dispatch(setFixedExpenseDataState({ prop: 'isLoadingFixedExpenses', value: false }));
};

export const apiGetFixedExpenseById = (id) => async (dispatch, getState) =>
{

    dispatch(setFixedExpenseDataState({ prop: 'isLoadingFixedExpense', value: true }));

    await dispatch(
        getFixedExpenseById(id, (tag, response) =>
        {
            console.log('getFixedExpenseById - ERROR: ', response);
            dispatch({ type: Types.GET_FIXED_EXPENSE_DETAILS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getFixedExpenseById - SUCCESS: ', response);
            dispatch({
                type: Types.GET_FIXED_EXPENSE_DETAILS_SUCCESS,
                payload: response.data.expense,
            });
        }))

    dispatch(setFixedExpenseDataState({ prop: 'isLoadingFixedExpense', value: false }))

};
export const apiPutFixedExpenseById = (id, params) => async (dispatch, getState) =>
{

    dispatch(setFixedExpenseDataState({ prop: 'isLoadingFixedExpense', value: true }));
    await dispatch(
        putFixedExpenseById(id, params, (tag, response) =>
        {
            console.log('putFixedExpenseById - ERROR: ', response);
            dispatch({ type: Types.PUT_DATA_FIXED_EXPENSE_FAIL, payload: response });
        }, (tag, response) =>
        {
            console.log('putFixedExpenseById - SUCCESS: ', response);
            dispatch({
                type: Types.PUT_DATA_FIXED_EXPENSE_SUCCESS,
                payload: response.data.expense,
            });
            dispatch(clearFixedExpenseData())
            dispatch(apiGetFixedExpenses())
            RootRouting.goBack()
        }))



    dispatch(setFixedExpenseDataState({ prop: 'isLoadingFixedExpense', value: true }));

};


export const clearFixedExpenseData = () => ({
    type: Types.CLEAR_DATA_FIXED_EXPENSE,
});

export const setFixedExpenseDataState = ({ prop, value }) => ({
    type: Types.PUT_DATA_FIXED_EXPENSE,
    payload: { prop, value },
});
