import Types from './Types';

const INITIAL_STATE = {
    authToken: '',
    refreshToken: '',
    isLogged: false,
    isLoading: false,
    formErrors: [],
    email: '',
    password: ''
};

export default (state = INITIAL_STATE, action) =>
{

    switch (action.type)
    {
        case Types.CLEAR_DATA_LOGIN:
            return { ...state, ...INITIAL_STATE };

        case Types.POST_LOGIN_SUCCESS:
            return { ...state, authToken: action.payload }

        case Types.POST_LOGIN_FAILED:
            return { ...state, formErrors: action.payload }


        case Types.GET_LOGOUT_FAILED:
            return { ...state }

        case Types.GET_LOGOUT_SUCCESS:
            return { ...state }

        case Types.SET_DATA_LOGIN:
            return { ...state, [action.payload.prop]: action.payload.value };

        default:
            return state
    }
};

