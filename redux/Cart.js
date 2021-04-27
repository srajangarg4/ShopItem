import * as ActionTypes from './ActionTypes';

export const cart = (state =
    {
        cart: [],
        errMess: null
    }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_CART:
            return { ...state, cart: action.payload };
        case ActionTypes.ADD_TO_CART:
            return { ...state, cart: state.cart.concat(action.payload) };
        case ActionTypes.UPDATE_IN_CART:
            return { ...state, cart: action.payload };
        case ActionTypes.REMOVE_FROM_CART:
            return { ...state, cart: state.cart.filter((product) => product.id !== action.payload) };
        case ActionTypes.REMOVE_CART:
            return { ...state, cart: [] }
        case ActionTypes.CART_FAILED:
            return { ...state };
        default:
            return state;
    }
};