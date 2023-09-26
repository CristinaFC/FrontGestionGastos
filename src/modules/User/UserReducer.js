import Types from './Types';

const INITIAL_STATE = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    formErrors: [],
    errors: [],
    user: [],
    isLoading: false
};

export default (state = INITIAL_STATE, action) =>
{
    switch (action.type)
    {
        case Types.CLEAR_DATA_USER:
            return { ...state, ...INITIAL_STATE };

        /** PUT **/
        case Types.PUT_DATA_USER:
            return { ...state, [action.payload.prop]: action.payload.value };

        case Types.PUT_DATA_CATEGORY_FAIL:
            return { ...state, errors: action.payload };

        case Types.PUT_DATA_CATEGORY_SUCCESS:
            return { ...state, user: action.payload };

        /** GET **/
        case Types.GET_USER_FAILED:
            return { ...state, errors: action.payload };

        case Types.GET_USER_SUCCESS:
            return { ...state, user: action.payload };

        /** POST **/
        case Types.POST_USER_SUCCESS:
            return { ...state, payload: action.payload };

        case Types.POST_USER_FAILED:
            return { ...state, errors: action.payload };

        /** DELETE **/

        case Types.DELETE_USER_FAIL:
            return { ...state, errors: action.payload };

        case Types.DELETE_USER_SUCCESS:
            return { ...state, user: action.payload };

        default:
            return state;
    }
};

