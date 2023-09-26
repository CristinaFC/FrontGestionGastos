import Types from './Types';

const INITIAL_STATE = {
    isLoadingBalance: false,
    errors: [],
    balance: []
};

export default (state = INITIAL_STATE, action) =>
{

    switch (action.type)
    {
        case Types.CLEAR_DATA_LOGIN:
            return { ...state, ...INITIAL_STATE };

        case Types.PUT_DATA_BALANCE:
            return { ...state, [action.payload.prop]: action.payload.value };

        case Types.GET_BALANCE_FAILED:
            return { ...state, errors: action.payload }

        case Types.GET_BALANCE_SUCCESS:
            return { ...state, balance: action.payload }

        default:
            return state
    }
};

