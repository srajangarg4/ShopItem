import * as ActionTypes from './ActionTypes';

export const user = (state = null, action) => {
    switch (action.type) {
        case ActionTypes.USER_SIGNIN:
            state = action.payload;
            return state;
        case ActionTypes.USER_SIGNOUT:
            state = null;
            return state;
        case ActionTypes.UPDATE_USER:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
};