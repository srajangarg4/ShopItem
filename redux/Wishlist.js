import * as ActionTypes from './ActionTypes';

export const wishlist = (state =
    {
        wishlist: [],
        errMess: null
    }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_WISHLIST:
            return { ...state, wishlist: action.payload };
        case ActionTypes.ADD_TO_WISHLIST:
            return { ...state, wishlist: state.wishlist.concat(action.payload) };
        case ActionTypes.REMOVE_FROM_WISHLIST:
            return { ...state, wishlist: state.wishlist.filter((product) => product.id !== action.payload) };
        case ActionTypes.REMOVE_WISHLIST:
            return { ...state, wishlist: [], errMess: null };
        case ActionTypes.WISHLIST_FAILED:
            return { ...state, errMess: action.payload };
        default:
            return state;
    }
};