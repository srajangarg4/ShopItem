import * as ActionTypes from './ActionTypes';

export const categories = (state =
    {
        isLoading: true,
        categories: [],
        errMess: null
    }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_CATEGORIES:
            return { ...state, isLoading: false, errMess: null, categories: state.categories.concat(action.payload) };
        case ActionTypes.CATEGORIES_LOADING:
            return { ...state, isLoading: true, errMess: null };
        case ActionTypes.CATEGORIES_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };
        default:
            return state;
    }
}