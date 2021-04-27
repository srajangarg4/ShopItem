import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { products } from './Products';
import { categories } from './Categories';
import { cart } from './Cart';
import { user } from './User';
import { wishlist } from './Wishlist';
import logger from 'redux-logger';

export const ConfigureStore = () => {

    const store = createStore(
        combineReducers({
            products,
            categories,
            cart,
            user,
            wishlist
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}