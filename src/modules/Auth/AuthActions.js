import { } from './Types'
import Types from './Types'

import { logout, postLogin } from '../../services/api/API';


export const apiPostLogin = () => async (dispatch, getState) =>
{

    const { email, password, formErrors } = getState().AuthReducer;

    dispatch(setAuthDataState({ prop: 'isLoading', value: true }));
    await dispatch(
        postLogin(email, password, (tag, response) =>
        {
            console.log('postLogin - ERROR: ', response);
            dispatch({ type: Types.POST_LOGIN_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('postLogin - SUCCESS: ', response);
            dispatch({
                type: Types.POST_LOGIN_SUCCESS,
                payload: response.data.token,
            });
            dispatch(setAuthDataState({ prop: 'isLogged', value: true }))

        })
    );
    dispatch(setAuthDataState({ prop: 'isLoading', value: false }));

};


export const apiLogout = () => async (dispatch, getState) =>
{

    await dispatch(
        logout((tag, response) =>
        {
            console.log('Logout - ERROR: ', response);
            dispatch({ type: Types.GET_LOGOUT_FAILED });
        }, (tag, response) =>
        {
            console.log('postLogin - SUCCESS: ', response);
            dispatch(clearDataLogin())

            dispatch({
                type: Types.GET_LOGOUT_SUCCESS,
            });
        })
    );

};


export const apiGetRefreshToken = () => async (dispatch, getState) =>
{
    dispatch(clearDataLogin())

    await dispatch(
        logout((tag, response) =>
        {
            console.log('Logout - ERROR: ', response);
            dispatch({ type: Types.GET_LOGOUT_FAILED });
        }, (tag, response) =>
        {
            console.log('postLogin - SUCCESS: ', response);
            dispatch({
                type: Types.GET_LOGOUT_SUCCESS,
            });
        })
    );

};


export const clearDataLogin = () => ({
    type: Types.CLEAR_DATA_LOGIN,
});

export const setAuthDataState = ({ prop, value }) => ({
    type: Types.SET_DATA_LOGIN,
    payload: { prop, value },
});
