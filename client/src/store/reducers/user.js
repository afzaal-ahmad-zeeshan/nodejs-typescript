import { UPDATE_USER, UPDATE_DEPOSIT, CLEAR_USER } from '../actions/user';
export const USER_STATE_KEY = 'USER_STATE_KEY';

let initialState = {
    user: null,
};

export const user = (state = initialState, action) => {
    if (!action) {
        return state;
    }

    console.log(`[INFO] payload: ${JSON.stringify(action.payload)}`);
    console.log(`[INFO] received ${action.type} action @ reducer/user...`);
    switch (action.type) {
        case UPDATE_USER:
            state.user = action.payload;
            localStorage.setItem(USER_STATE_KEY, JSON.stringify(state));
            return state;
        case UPDATE_DEPOSIT:
            state.user.deposit = action.payload.deposit;
            localStorage.setItem(USER_STATE_KEY, JSON.stringify(state));
            return state;
        case CLEAR_USER:
            localStorage.removeItem(USER_STATE_KEY);
            return initialState;
        default:
            if (localStorage.getItem(USER_STATE_KEY) !== null) {
                return JSON.parse(localStorage.getItem(USER_STATE_KEY));
            }
            return initialState;
    }
}
