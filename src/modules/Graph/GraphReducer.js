import Types from './Types';

const INITIAL_STATE = {
    errors: null,
    incomes: [],
    expenses: [],
    isLoadingIncomes: false,
    isLoadingExpenses: false,
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

        case Types.GET_INCOME_GRAPHS_SUCCESS:
            console.log('1')
            return { ...state, incomes: action.payload };

        case Types.GET_INCOME_GRAPHS_FAILED:
            console.log('2')

            return { ...state, errors: action.payload };

        case Types.GET_EXPENSE_GRAPHS_SUCCESS:
            console.log('3')

            return { ...state, expenses: action.payload };

        case Types.GET_EXPENSE_GRAPHS_FAILED:
            console.log('4')

            return { ...state, errors: action.payload };

        /** DELETE **/


        default:
            return state;
    }
};

