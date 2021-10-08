// labels
export const LOGIN_ACTION = 'LOGIN_ACTION';
export const LOGOUT_ACTION = 'LOGOUT_ACTION';

// dispatch-helpers
export const login = ({ token, username, loggedIn, activeUntil }) => {
    return {
        type: LOGIN_ACTION,
        payload: {
            token,
            loggedIn,
            activeUntil,
        }
    }
}

export const logout = () => {
    return {
        type: LOGOUT_ACTION,
    }
}
