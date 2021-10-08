import { LOGIN_ACTION, LOGOUT_ACTION } from '../actions/auth';
export const AUTH_STATE_KEY = 'AUTH_STATE_KEY';

let initialState = {
    loggedIn: false,
    token: null,
    activeUntil: null,
};

export const auth = (state = initialState, action) => {
    if (!action) {
        return state;
    }

    console.log(`[INFO] payload: ${JSON.stringify(action.payload)}`);
    console.log(`[INFO] received ${action.type} action @ reducer/auth...`);
    switch (action.type) {
        case LOGIN_ACTION:
            localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(action.payload));
            return action.payload;
        case LOGOUT_ACTION:
            localStorage.removeItem(AUTH_STATE_KEY);
            return initialState;
        default:
            if (localStorage.getItem(AUTH_STATE_KEY) !== null) {
                const _state = JSON.parse(localStorage.getItem(AUTH_STATE_KEY));

                // if the state is valid, return, it, otherwise fallback to default and clear the localStorage
                const activeUntil = new Date(_state.activeUntil).toISOString();
                const currentTime = (new Date()).toISOString();
                console.log(`activeUntil is ${activeUntil} and current time ${currentTime}`);
                if (activeUntil >= currentTime) {
                    return _state;
                } else {
                    // remove the storage locally
                    localStorage.removeItem(AUTH_STATE_KEY);
                }
            }

            return initialState;
    }
}
