import Types from './Types';

const INITIAL_STATE = {
    description: '',
    date: new Date(),
    category: '',
    account: '',
    amount: '',
    expenses: null,
    expense: [],
    errors: [],
    isLoadingExpenses: false,
    isLoadingExpense: true,
};

export default (state = INITIAL_STATE, action) =>
{
    switch (action.type)
    {
        case Types.CLEAR_DATA_EXPENSE:
            return { ...state, ...INITIAL_STATE };

        /** POST **/

        case Types.POST_EXPENSE_SUCCESS:
            return { ...state, expense: action.payload };

        case Types.POST_EXPENSE_FAILED:
            return { ...state, errors: action.payload };

        /** PUT **/

        case Types.PUT_DATA_EXPENSE:
            return { ...state, [action.payload.prop]: action.payload.value };

        case Types.PUT_DATA_EXPENSE_FAIL:
            return { ...state, errors: action.payload };

        case Types.PUT_DATA_EXPENSE_SUCCESS:
            return { ...state, expense: action.payload };

        /** GET **/

        case Types.GET_EXPENSES_SUCCESS:
            return { ...state, expenses: action.payload };

        case Types.GET_EXPENSES_FAILED:
            return { ...state, errors: action.payload };

        case Types.GET_EXPENSE_DETAILS_SUCCESS:
            return { ...state, expense: action.payload };

        case Types.GET_EXPENSE_DETAILS_FAILED:
            return { ...state, errors: action.payload };

        /** DELETE **/

        case Types.DELETE_EXPENSE_SUCCESS:
            return { ...state, expense: action.payload };

        case Types.DELETE_EXPENSE_FAIL:
            return { ...state, errors: action.payload };

        default:
            return state;
    }
};

