import { } from './Types'
import Types from './Types'

import { deleteUser, getUser, postUser, putUser } from '../../services/api/API';
import * as RootRouting from '../../navigation/RootRouting'
import Routing from '../../navigation/Routing';
import { setAuthDataState } from '../Auth/AuthActions';


export const apiPostUser = () => async (dispatch, getState) =>
{
    const { name, lastName, email, password, formErrors } = getState().UserReducer;



    if (formErrors === null)
    {

        dispatch(setUserDataState({ prop: 'isLoading', value: true }));
        await dispatch(
            postUser({ name, lastName, email, password, role: "user" }, (tag, response) =>
            {
                console.log('postUser - ERROR: ', response);
                dispatch({ type: Types.POST_USER_FAILED, payload: response });
            }, (tag, response) =>
            {
                console.log('postUser - SUCCESS: ', response);
                dispatch({
                    type: Types.POST_USER_SUCCESS,
                    payload: response,
                });


            })
        );
    } else
    {
        console.log('Formulario no enviado')
    }
    dispatch(setUserDataState({ prop: 'isLoading', value: false }));

};

export const apiGetUser = () => async (dispatch, getState) =>
{

    dispatch(setUserDataState({ prop: 'isLoading', value: true }));
    await dispatch(
        getUser((tag, response) =>
        {
            console.log('getUser - ERROR: ', response);
            dispatch({ type: Types.GET_USER_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getUser - SUCCESS: ', response);
            dispatch({
                type: Types.GET_USER_SUCCESS,
                payload: response.data.user
            });
        }))

    dispatch(setUserDataState({ prop: 'isLoading', value: false }));
};

export const apiPutUser = (params) => async (dispatch, getState) =>
{
    dispatch(setUserDataState({ prop: 'isLoading', value: true }));
    await dispatch(
        putUser(params, (tag, response) =>
        {
            console.log('putUser - ERROR: ', response);
            dispatch({ type: Types.PUT_DATA_USER_FAIL, payload: response });
        }, (tag, response) =>
        {
            console.log('putUser - SUCCESS: ', response);
            dispatch({
                type: Types.PUT_DATA_USER_SUCCESS,
                payload: response,
            });

            RootRouting.goBack();
        })
    );
    dispatch(setUserDataState({ prop: 'isLoading', value: false }));
}

export const apiDeleteUser = () => async (dispatch, getState) =>
{

    await dispatch(
        deleteUser((tag, response) =>
        {
            console.log('deleteUser - ERROR: ', response);
            dispatch({ type: Types.DELETE_USER_FAIL, payload: response });
        }, (tag, response) =>
        {
            console.log('deleteUser - SUCCESS: ', response);
            dispatch({ type: Types.DELETE_USER_SUCCESS, payload: response });
            dispatch(setAuthDataState({ prop: 'isLogged', value: false }))
        })
    );
};


export const clearDataUser = () => ({
    type: Types.CLEAR_DATA_USER,
});

export const setUserDataState = ({ prop, value }) => ({
    type: Types.PUT_DATA_USER,
    payload: { prop, value },
});
