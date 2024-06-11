import Types from './Types'

import { deleteAccount, getAccountById, getAccounts, postAccount, putAccountById, transfer } from '../../services/api/API';
import * as RootRouting from '../../navigation/RootRouting'
import Routing from '../../navigation/Routing';
import { AlertError } from '../../components/Modals/AlertError';
import { Alert } from 'react-native';

export const apiGetAccounts = () => async (dispatch, getState) =>
{
    dispatch(setAccountDataState({ prop: 'isLoadingAccounts', value: true }));
    await dispatch(
        getAccounts((tag, response) =>
        {
            console.log('getAccounts - ERROR: ', response);
            dispatch({ type: Types.GET_ACCOUNTS_FAILED, payload: response });
            if (response.data.status !== 401) <AlertError />
        }, (tag, response) =>
        {
            console.log('getAccounts - SUCCESS: ', response);
            dispatch({
                type: Types.GET_ACCOUNTS_SUCCESS,
                payload: response.data.accounts,
            });
        }))

    dispatch(setAccountDataState({ prop: 'isLoadingAccounts', value: false }))

};

export const apiTransfer = (params) => async (dispatch, getState) =>
{
    await dispatch(
        transfer(params, (tag, response) =>
        {
            console.log('transfer - ERROR: ', response);
            dispatch({ type: Types.TRANSFER_FAILED, payload: response });
            <AlertError />
        }, (tag, response) =>
        {
            console.log('transfer - SUCCESS: ', response);
            dispatch({
                type: Types.TRANSFER_SUCCESS,
                payload: response,
            });
            RootRouting.navigate(Routing.home);
            RootRouting.navigationRef.reset({
                index: 0,
                routes: [{ name: Routing.accounts }],
            });
            dispatch(apiGetAccounts())
        }))
};

export const apiGetAccountById = (id) => async (dispatch, getState) =>
{

    dispatch(setAccountDataState({ prop: 'isLoadingAccount', value: true }));
    await dispatch(
        getAccountById(id, (tag, response) =>
        {
            console.log('getAccountById - ERROR: ', response);
            dispatch({ type: Types.GET_ACCOUNT_DETAILS_FAILED, payload: response });
            <AlertError />
        }, (tag, response) =>
        {
            console.log('getAccountById - SUCCESS: ', response);
            dispatch({
                type: Types.GET_ACCOUNT_DETAILS_SUCCESS,
                payload: response.data.account,
            });
        }))

    dispatch(setAccountDataState({ prop: 'isLoadingAccount', value: false }))

};

export const apiPutAccountById = (id, params) => async (dispatch, getState) =>
{

    dispatch(setAccountDataState({ prop: 'isLoadingAccount', value: true }));
    await dispatch(
        putAccountById(id, params, (tag, response) =>
        {
            console.log('putAccountById - ERROR: ', response);
            dispatch({ type: Types.PUT_DATA_ACCOUNT_FAIL, payload: response });
            <AlertError />
        }, (tag, response) =>
        {
            console.log('putAccountById - SUCCESS: ', response);
            dispatch({
                type: Types.PUT_DATA_ACCOUNT_SUCCESS,
                payload: response.data.account,
            });
            RootRouting.navigate(Routing.home)
            RootRouting.navigationRef.reset({
                index: 0,
                routes: [{ name: Routing.accounts }],
            });
            dispatch(apiGetAccounts())
        }))

    RootRouting.navigate(Routing.accounts)
    dispatch(apiGetAccounts())
    dispatch(setAccountDataState({ prop: 'isLoadingAccount', value: false }));

};

export const apiPostAccount = (params) => async (dispatch, getState) =>
{

    dispatch(setAccountDataState({ prop: 'isLoadingAccount', value: true }));
    await dispatch(
        postAccount(params, (tag, response) =>
        {
            console.log('postAccount - ERROR: ', response);
            dispatch({ type: Types.POST_ACCOUNT_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('postAccount - SUCCESS: ', response);
            dispatch({ type: Types.POST_ACCOUNT_SUCCESS, payload: response });

            RootRouting.navigate(Routing.home)
            RootRouting.navigationRef.reset({
                index: 0,
                routes: [{ name: Routing.accounts }],
            });
            dispatch(apiGetAccounts())

        })
    );

    dispatch(setAccountDataState({ prop: 'isLoadingAccount', value: false }));
};

export const apiDeleteAccount = (id) => async (dispatch, getState) =>
{

    await dispatch(
        deleteAccount(id, (tag, response) =>
        {
            console.log('deleteAccount - ERROR: ', response);
            dispatch({ type: Types.DELETE_ACCOUNT_FAIL, payload: response });
            <AlertError />
        }, (tag, response) =>
        {
            console.log('deleteAccount - SUCCESS: ', response);
            dispatch({ type: Types.DELETE_ACCOUNT_SUCCESS, payload: response });


        })
    );
    RootRouting.navigate(Routing.accounts)
    dispatch(apiGetAccounts())

};

export const clearAccountData = () => ({
    type: Types.CLEAR_DATA_ACCOUNT,
});

export const setAccountDataState = ({ prop, value }) => ({
    type: Types.PUT_DATA_ACCOUNT,
    payload: { prop, value },
});
