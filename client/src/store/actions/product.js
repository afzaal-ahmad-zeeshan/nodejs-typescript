// labels
export const UPDATE_LIST = 'UPDATE_LIST';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

// dispatch-helpers
export const updateList = ({ items }) => {
    return {
        type: UPDATE_LIST,
        payload: items
    }
}

export const updateProduct = ({ productId, product }) => {
    return {
        type: UPDATE_PRODUCT,
        payload: {
            productId,
            product,
        }
    }
}
