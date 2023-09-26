import Types from './Types'

import { deleteIncome, getIncomeById, getIncomes, getIncomesByAccount, getRecentIncomes, postIncome, putIncomeById } from '../../services/api/API';
import * as RootRouting from '../../navigation/RootRouting'
import Routing from '../../navigation/Routing';

export const apiGetIncomes = () => async (dispatch, getState) =>
{
    dispatch(setIncomeDataState({ prop: 'isLoadingIncomes', value: true }));
    await dispatch(
        getIncomes((tag, response) =>
        {
            console.log('getIncomes - ERROR: ', response);
            dispatch({ type: Types.GET_INCOMES_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getIncomes - SUCCESS: ', response);
            dispatch({
                type: Types.GET_INCOMES_SUCCESS,
                payload: response.data.incomes,
            });
        }))

    dispatch(setIncomeDataState({ prop: 'isLoadingIncomes', value: false }))

};

export const apiGetRecentIncomes = (limit) => async (dispatch, getState) =>
{
    dispatch(setIncomeDataState({ prop: 'isLoadingIncomes', value: true }));
    await dispatch(
        getRecentIncomes(limit, (tag, response) =>
        {
            console.log('getRecentIncomes - ERROR: ', response);
            dispatch({ type: Types.GET_INCOMES_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getRecentIncomes - SUCCESS: ', response);
            dispatch({
                type: Types.GET_INCOMES_SUCCESS,
                payload: response.data.incomes,
            });
        }))

    dispatch(setIncomeDataState({ prop: 'isLoadingIncomes', value: false }))

};

export const apiGetIncomesByAccount = (id) => async (dispatch, getState) =>
{

    dispatch(setIncomeDataState({ prop: 'isLoadingIncomes', value: true }));

    await dispatch(
        getIncomesByAccount(id, (tag, response) =>
        {
            console.log('getIncomesByAccount - ERROR: ', response);
            dispatch({ type: Types.GET_INCOMES_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getIncomesByAccount - SUCCESS: ', response);
            dispatch({
                type: Types.GET_INCOMES_SUCCESS,
                payload: response.data.incomes,
            });
        }))

    dispatch(setIncomeDataState({ prop: 'isLoadingIncomes', value: false }))

};
export const apiGetIncomeById = (id) => async (dispatch, getState) =>
{

    dispatch(setIncomeDataState({ prop: 'isLoadingIncome', value: true }));

    await dispatch(
        getIncomeById(id, (tag, response) =>
        {
            console.log('getIncomeById - ERROR: ', response);
            dispatch({ type: Types.GET_INCOME_DETAILS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getIncomeById - SUCCESS: ', response);
            dispatch({
                type: Types.GET_INCOME_DETAILS_SUCCESS,
                payload: response.data.income,
            });
        }))

    dispatch(setIncomeDataState({ prop: 'isLoadingIncome', value: false }))

};

export const apiPutIncomeById = (id, params) => async (dispatch, getState) =>
{

    dispatch(setIncomeDataState({ prop: 'isLoadingIncome', value: true }));
    await dispatch(
        putIncomeById(id, params, (tag, response) =>
        {
            console.log('putIncomeById - ERROR: ', response);
            dispatch({ type: Types.PUT_DATA_INCOME_FAIL, payload: response });
        }, (tag, response) =>
        {
            console.log('putIncomeById - SUCCESS: ', response);
            dispatch({
                type: Types.PUT_DATA_INCOME_SUCCESS,
                payload: response.data.income,
            });
        }))


    dispatch(clearIncomeData())
    dispatch(apiGetIncomes())
    RootRouting.goBack()
    dispatch(setIncomeDataState({ prop: 'isLoadingIncome', value: false }));

};

export const apiPostIncome = (params) => async (dispatch, getState) =>
{

    dispatch(setIncomeDataState({ prop: 'isLoadingIncome', value: true }));
    await dispatch(
        postIncome(params, (tag, response) =>
        {
            console.log('postIncome - ERROR: ', response);
            dispatch({ type: Types.POST_INCOME_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('postIncome - SUCCESS: ', response);
            dispatch({ type: Types.POST_INCOME_SUCCESS, payload: response });
            RootRouting.navigate(Routing.incomes)
            dispatch(apiGetRecentIncomes(4))

        })
    );
    dispatch(setIncomeDataState({ prop: 'isLoadingIncome', value: false }));
};

export const apiDeleteIncome = (id) => async (dispatch, getState) =>
{

    await dispatch(
        deleteIncome(id, (tag, response) =>
        {
            console.log('deleteIncome - ERROR: ', response);
            dispatch({ type: Types.DELETE_INCOME_FAIL, payload: response });
        }, (tag, response) =>
        {
            console.log('deleteIncome - SUCCESS: ', response);
            dispatch({ type: Types.DELETE_INCOME_SUCCESS, payload: response });


        })
    );
    RootRouting.navigate(Routing.historyIncomes)
    RootRouting.removeRouteFromStack(Routing.detailsIncome)
    dispatch(apiGetIncomes())

};

export const clearIncomeData = () => ({
    type: Types.CLEAR_DATA_INCOME,
});

export const setIncomeDataState = ({ prop, value }) => ({
    type: Types.PUT_DATA_INCOME,
    payload: { prop, value },
});
