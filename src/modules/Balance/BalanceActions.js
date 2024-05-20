import { getBalance, getPrediction } from '../../services/api/API';
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

export const apiGetPrediction = () => async (dispatch, getState) =>
{
    dispatch(setBalanceState({ prop: 'isLoadingPrediction', value: true }));
    await dispatch(
        getPrediction((tag, response) =>
        {
            console.log('getPrediction - ERROR: ', response);
            dispatch({ type: Types.GET_PREDICTION_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('getPrediction - SUCCESS: ', response);
            dispatch({
                type: Types.GET_PREDICTION_SUCCESS,
                payload: response.data.prediction,
            });
        }))

    dispatch(setBalanceState({ prop: 'isLoadingPrediction', value: false }))
};

export const clearBalanceData = () => ({
    type: Types.CLEAR_DATA_BALANCE,
});

export const setBalanceState = () => ({ prop, value }) => ({
    type: Types.PUT_DATA_BALANCE,
    payload: { prop, value },
});
