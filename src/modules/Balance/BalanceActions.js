import { getBalance } from '../../services/api/API';
import Types from './Types'


export const apiGetBalance = () => async (dispatch, getState) =>
{
    dispatch(setBalanceState({ prop: 'isLoadingBalance', value: true }));
    await dispatch(
        getBalance((tag, response) =>
        {
            console.log('getBalance - ERROR: ', response);
            dispatch({ type: Types.GET_BALANCE_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getBalance - SUCCESS: ', response);
            dispatch({
                type: Types.GET_BALANCE_SUCCESS,
                payload: response.data.balance,
            });
        }))

    dispatch(setBalanceState({ prop: 'isLoadingBalance', value: false }))
};

export const clearBalanceData = () => ({
    type: Types.CLEAR_DATA_BALANCE,
});

export const setBalanceState = () => ({ prop, value }) => ({
    type: Types.PUT_DATA_BALANCE,
    payload: { prop, value },
});
