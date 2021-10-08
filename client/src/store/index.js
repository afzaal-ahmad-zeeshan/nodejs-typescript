import { createStore, combineReducers } from 'redux';

import { auth } from './reducers/auth';
import { user } from './reducers/user';
import { product } from './reducers/product';

let reducers = combineReducers({
    auth: auth,
    user: user,
    product: product,
});

export default createStore(reducers);
