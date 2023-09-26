import { combineReducers } from '@reduxjs/toolkit';

import AuthReducer from '../modules/Auth/AuthReducer';
import UserReducer from '../modules/User/UserReducer';
import CategoryReducer from '../modules/Category/CategoryReducer';
import AccountReducer from '../modules/Accounts/AccountReducer';
import ExpenseReducer from '../modules/Expense/ExpenseReducer';
import IncomeReducer from '../modules/Income/IncomeReducer';
import BalanceReducer from '../modules/Balance/BalanceReducer';
import GraphReducer from '../modules/Graph/GraphReducer';

const reducer = combineReducers({
    AuthReducer,
    UserReducer,
    CategoryReducer,
    AccountReducer,
    ExpenseReducer,
    IncomeReducer,
    BalanceReducer,
    GraphReducer
});

const rootReducer = (state, action) =>
{
    if (action.type === 'RESET_STATE')
    {
        this.state = undefined;
    }

    return reducer(state, action);
};



export default rootReducer;
