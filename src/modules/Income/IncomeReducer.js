import Types from './Types';

const INITIAL_STATE = {
    description: '',
    date: new Date(),
    category: '',
    account: '',
    amount: '',
    incomes: null,
    income: [],
    errors: [],
    isLoadingIncomes: false,
    isLoadingIncome: true,
};

export default (state = INITIAL_STATE, action) =>
{
    switch (action.type)
    {
        case Types.CLEAR_DATA_INCOME:
            return { ...state, ...INITIAL_STATE };

        /** POST **/

        case Types.POST_INCOME_SUCCESS:
            return { ...state, income: action.payload };

        case Types.POST_INCOME_FAILED:
            return { ...state, errors: action.payload };

        /** PUT **/

        case Types.PUT_DATA_INCOME:
            return { ...state, [action.payload.prop]: action.payload.value };

        case Types.PUT_DATA_INCOME_FAIL:
            return { ...state, errors: action.payload };

        case Types.PUT_DATA_INCOME_SUCCESS:
            return { ...state, income: action.payload };

        /** GET **/

        case Types.GET_INCOMES_SUCCESS:
            return { ...state, incomes: action.payload };

        case Types.GET_INCOMES_FAILED:
            return { ...state, errors: action.payload };

        case Types.GET_INCOME_DETAILS_SUCCESS:
            return { ...state, income: action.payload };

        case Types.GET_INCOME_DETAILS_FAILED:
            return { ...state, errors: action.payload };

        /** DELETE **/

        case Types.DELETE_INCOME_SUCCESS:
            return { ...state, income: action.payload };

        case Types.DELETE_INCOME_FAIL:
            return { ...state, errors: action.payload };

        default:
            return state;
    }
};

