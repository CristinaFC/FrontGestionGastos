import Types from './Types';

const INITIAL_STATE = {
    name: '',
    icon: '',
    type: '',
    categories: [],
    initCategories: [],
    category: [],
    errors: [],
    isLoadingCategories: false,
    isLoadingCategory: false,
};

export default (state = INITIAL_STATE, action) =>
{
    switch (action.type)
    {
        case Types.CLEAR_DATA_CATEGORY:
            return { ...state, ...INITIAL_STATE };

        /** POST **/

        case Types.POST_CATEGORY_SUCCESS:
            return { ...state, category: action.payload };

        case Types.POST_CATEGORY_FAILED:
            return { ...state, errors: action.payload };

        /** PUT **/

        case Types.PUT_DATA_CATEGORY:
            return { ...state, [action.payload.prop]: action.payload.value };

        case Types.PUT_DATA_CATEGORY_FAIL:
            return { ...state, errors: action.payload };

        case Types.PUT_DATA_CATEGORY_SUCCESS:
            return { ...state, category: action.payload };

        /** GET **/

        case Types.GET_CATEGORIES_SUCCESS:
            return { ...state, categories: action.payload };

        case Types.GET_CATEGORIES_FAILED:
            return { ...state, errors: action.payload };

        case Types.GET_INIT_CATEGORIES_SUCCESS:
            return { ...state, initCategories: action.payload };

        case Types.GET_INIT_CATEGORIES_FAILED:
            return { ...state, errors: action.payload };

        case Types.GET_CATEGORY_DETAILS_SUCCESS:
            return { ...state, category: action.payload };

        case Types.GET_CATEGORY_DETAILS_FAILED:
            return { ...state, errors: action.payload };

        /** DELETE **/

        case Types.DELETE_CATEGORY_SUCCESS:
            return { ...state, category: action.payload };

        case Types.DELETE_CATEGORY_FAIL:
            return { ...state, errors: action.payload };

        default:
            return state;
    }
};

