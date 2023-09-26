import Types from './Types';

const INITIAL_STATE = {
    name: '',
    isBalance: false,
    icon: '',
    totalAmount: '',
    totalExpenses: '',
    totalIncomes: '',
    accounts: null,
    account: [],
    errors: [],
    isLoadingAccounts: false,
    isLoadingAccount: false,
};

export default (state = INITIAL_STATE, action) =>
{
    switch (action.type)
    {
        case Types.CLEAR_DATA_ACCOUNT:
            return { ...state, ...INITIAL_STATE };

        /** POST **/

        case Types.POST_ACCOUNT_SUCCESS:
            return { ...state, account: action.payload };

        case Types.POST_ACCOUNT_FAILED:
            return { ...state, errors: action.payload };

        /** PUT **/

        case Types.PUT_DATA_ACCOUNT:
            return { ...state, [action.payload.prop]: action.payload.value };

        case Types.PUT_DATA_ACCOUNT_FAIL:
            return { ...state, errors: action.payload };

        case Types.PUT_DATA_ACCOUNT_SUCCESS:
            return { ...state, account: action.payload };

        /** GET **/

        case Types.GET_ACCOUNTS_SUCCESS:
            return { ...state, accounts: action.payload };

        case Types.GET_ACCOUNTS_FAILED:
            return { ...state, errors: action.payload };

        case Types.GET_ACCOUNT_DETAILS_SUCCESS:
            return { ...state, account: action.payload };

        case Types.GET_ACCOUNT_DETAILS_FAILED:
            return { ...state, errors: action.payload };

        /** DELETE **/

        case Types.DELETE_ACCOUNT_SUCCESS:
            return { ...state, account: action.payload };

        case Types.DELETE_ACCOUNT_FAIL:
            return { ...state, errors: action.payload };

        default:
            return state;
    }
};

