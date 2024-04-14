import Types from './Types'

import { getRecipients, postRecipient } from '../../services/api/API';
import * as RootRouting from '../../navigation/RootRouting'
import Routing from '../../navigation/Routing';


export const apiGetRecipients = () => async (dispatch, getState) =>
{

    dispatch(setRecipientDataState({ prop: 'isLoadingRecipients', value: true }));
    await dispatch(
        getRecipients((tag, response) =>
        {
            console.log('apiGetRecipients - ERROR: ', response);
            dispatch({ type: Types.GET_RECIPIENTS_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('apiGetRecipients - SUCCESS: ', response);
            dispatch({
                type: Types.GET_RECIPIENTS_SUCCESS,
                payload: response.data.recipients,
            });
        }))

    dispatch(setRecipientDataState({ prop: 'isLoadingRecipients', value: false }))

};


export const apiPostRecipient = (params) => async (dispatch, getState) =>
{

    dispatch(setRecipientDataState({ prop: 'isLoadingRecipients', value: true }));
    await dispatch(
        postRecipient(params, (tag, response) =>
        {
            console.log('apiPostRecipient - ERROR: ', response);
            dispatch({ type: Types.POST_RECIPIENT_FAILED, payload: response });
        }, (tag, response) =>
        {
            console.log('apiPostRecipient - SUCCESS: ', response);
            dispatch({ type: Types.POST_RECIPIENT_SUCCESS, payload: response });
            dispatch(clearRecipientData())
        })
    );
    dispatch(setRecipientDataState({ prop: 'isLoadingRecipients', value: false }));
};

// export const apiGetRecipientById = (id) => async (dispatch, getState) =>
// {

//     dispatch(setRecipientDataState({ prop: 'isLoadingRecipient', value: true }));

//     await dispatch(
//         getRecipientById(id, (tag, response) =>
//         {
//             console.log('getRecipientById - ERROR: ', response);
//             dispatch({ type: Types.GET_RECIPIENT_DETAILS_FAILED, payload: response });
//         }, (tag, response) =>
//         {
//             console.log('getRecipientById - SUCCESS: ', response);
//             dispatch({
//                 type: Types.GET_RECIPIENT_DETAILS_SUCCESS,
//                 payload: response.data.recipient,
//             });
//         }))

//     dispatch(setRecipientDataState({ prop: 'isLoadingRecipient', value: false }))

// };
// export const apiPutRecipientById = (id, params) => async (dispatch, getState) =>
// {

//     dispatch(setRecipientDataState({ prop: 'isLoadingRecipient', value: true }));
//     await dispatch(
//         putRecipientById(id, params, (tag, response) =>
//         {
//             console.log('putRecipientById - ERROR: ', response);
//             dispatch({ type: Types.PUT_DATA_RECIPIENT_FAIL, payload: response });
//         }, (tag, response) =>
//         {
//             console.log('putRecipientById - SUCCESS: ', response);
//             dispatch({
//                 type: Types.PUT_DATA_RECIPIENT_SUCCESS,
//                 payload: response.data.recipient,
//             });
//         }))


//     dispatch(clearRecipientData())
//     dispatch(apiGetRecipients())
//     RootRouting.goBack()
//     dispatch(setRecipientDataState({ prop: 'isLoadingRecipient', value: true }));

// };


export const clearRecipientData = () => ({
    type: Types.CLEAR_DATA_RECIPIENT,
});

export const setRecipientDataState = ({ prop, value }) => ({
    type: Types.PUT_DATA_RECIPIENT,
    payload: { prop, value },
});
