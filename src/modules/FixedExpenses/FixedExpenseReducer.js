import Types from './Types';

const INITIAL_STATE = {
    date: new Date(),
    amount: '',
    account: '',
    category: '',
    description: '',
    period: 2,
    lastInsertion: '',
    nextInsertion: '',
    hasEndDate: '',
    endDate: '',
    active: '',
    fixedExpense: {},
    fixedExpenses: [],
    isLoadingFixedExpenses: true,
};

export default (state = INITIAL_STATE, action) =>
{
    switch (action.type)
    {
        case Types.CLEAR_DATA_FIXED_EXPENSE:
            return { ...state, ...INITIAL_STATE };

        /** POST **/

        case Types.POST_FIXED_EXPENSE_SUCCESS:
            return { ...state, fixedExpense: action.payload };

        case Types.POST_FIXED_EXPENSE_FAILED:
            return { ...state, errors: action.payload };

        /** PUT **/

        case Types.PUT_DATA_FIXED_EXPENSE:
            return { ...state, [action.payload.prop]: action.payload.value };

        case Types.PUT_DATA_EXPENSE_FAIL:
            return { ...state, errors: action.payload };

        case Types.PUT_DATA_EXPENSE_SUCCESS:
            return { ...state, fixedExpense: action.payload };

        /** GET **/

        case Types.GET_FIXED_EXPENSES_SUCCESS:
            return { ...state, fixedExpenses: action.payload };

        case Types.GET_FIXED_EXPENSES_FAILED:
            return { ...state, errors: action.payload };

        case Types.GET_FIXED_EXPENSE_DETAILS_SUCCESS:
            return { ...state, fixedExpense: action.payload };

        case Types.GET_FIXED_EXPENSE_DETAILS_FAILED:
            return { ...state, errors: action.payload };
        /** DELETE **/

        case Types.DELETE_EXPENSE_SUCCESS:
            return { ...state, fixedExpense: action.payload };

        case Types.DELETE_EXPENSE_FAIL:
            return { ...state, errors: action.payload };

        default:
            return state;
    }
};

