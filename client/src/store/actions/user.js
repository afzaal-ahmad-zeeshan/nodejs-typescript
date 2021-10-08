// labels
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_DEPOSIT = 'UPDATE_DEPOSIT';
export const CLEAR_USER = 'CLEAR_USER';

// dispatch-helpers
export const updateUser = ({ user }) => {
    return {
        type: UPDATE_USER,
        payload: {
            ...user
        }
    }
}

export const updateDeposit = ({ deposit }) => {
    return {
        type: UPDATE_DEPOSIT,
        payload: {
            deposit
        }
    }
}

export const clearUser = () => {
    return {
        type: CLEAR_USER,
    }
}
