import Types from './Types';

const INITIAL_STATE = {
    name: '',
    recipientInfo: [],
    recipient: {},
    recipients: [],
    isLoadingRecipients: true,
    errors: []
};

export default (state = INITIAL_STATE, action) =>
{
    switch (action.type)
    {
        case Types.CLEAR_DATA_RECIPIENT:
            return { ...state, ...INITIAL_STATE };

        /** POST **/

        case Types.POST_RECIPIENT_SUCCESS:
            return { ...state, recipient: action.payload };

        case Types.POST_RECIPIENT_FAILED:
            return { ...state, errors: action.payload.data.errors };


        /** PUT **/

        case Types.PUT_DATA_RECIPIENT:
            return { ...state, [action.payload.prop]: action.payload.value };


        /** GET **/

        case Types.GET_RECIPIENTS_SUCCESS:
            return { ...state, recipients: action.payload };

        case Types.GET_RECIPIENTS_FAILED:
            return { ...state, errors: action.payload };

        case Types.GET_RECIPIENT_DETAILS_SUCCESS:
            return { ...state, recipient: action.payload };

        case Types.GET_RECIPIENT_DETAILS_FAILED:
            return { ...state, errors: action.payload };
        /** DELETE **/

        case Types.DELETE_EXPENSE_SUCCESS:
            return { ...state, recipient: action.payload };

        case Types.DELETE_EXPENSE_FAIL:
            return { ...state, errors: action.payload };

        default:
            return state;
    }
};

