import { UPDATE_LIST, UPDATE_PRODUCT } from '../actions/product';

let initialState = {
    items: null,
};

export const product = (state = initialState, action) => {
    if (!action) {
        return state;
    }

    console.log(`[INFO] payload: ${JSON.stringify(action.payload)}`);
    console.log(`[INFO] received ${action.type} action @ reducer/product...`);
    switch (action.type) {
        case UPDATE_LIST:
            state.items = action.payload.items;
            return state;
        case UPDATE_PRODUCT:
            const index = state.items.findIndex(i => i.id === action.payload.productId);
            state.items[index] = action.payload.product;
            return initialState;
        default:
            return initialState;
    }
}
