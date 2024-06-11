import Types from './Types';

const INITIAL_STATE = {
    errors: null,
    incomes: [],
    expenses: [],
    data: [],
    isLoadingIncomes: false,
    isLoadingExpenses: false,
    isLoadingOverview: false
};

export default (state = INITIAL_STATE, action) =>
{
    switch (action.type)
    {
        case Types.CLEAR_DATA_GRAPH:
            return { ...state, ...INITIAL_STATE };

        /** POST **/


        /** PUT **/

        case Types.PUT_DATA_GRAPH:
            return { ...state, [action.payload.prop]: action.payload.value };

        /** GET **/

        case Types.GET_OVERVIEW_GRAPHS_SUCCESS:
            return { ...state, data: action.payload };

        case Types.GET_OVERVIEW_GRAPHS_FAILED:

            return { ...state, errors: action.payload };

        case Types.GET_INCOME_GRAPHS_SUCCESS:
            return { ...state, incomes: action.payload };

        case Types.GET_INCOME_GRAPHS_FAILED:

            return { ...state, errors: action.payload };

        case Types.GET_EXPENSE_GRAPHS_SUCCESS:

            return { ...state, expenses: action.payload };

        case Types.GET_EXPENSE_GRAPHS_FAILED:

            return { ...state, errors: action.payload };


        default:
            return state;
    }
};

