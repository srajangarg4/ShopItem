import * as ActionTypes from './ActionTypes';
import firebase from '../firebase/ConfigureFirebase';
import { ToastAndroid, Alert } from 'react-native';

const fetchProduct = {
    "Home": true,
    "Products": true,
    "outOfStock": true
}

var fetchCategory = true;

export const fetchProducts = (component = "Home") => (dispatch) => {

    var arr = [];

    if (component === 'Home' && fetchProduct.Home) {
        dispatch(productsLoading());
        return firebase.firestore().collection("Products").where("featured", "==", true).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var ss = doc.data();
                    arr.push(ss);
                })
                dispatch(addProducts(arr));
                fetchProduct.Home = false;
            },
                error => {
                    var errmess = Error(error.message);
                    throw errmess;
                })
            .catch(error => dispatch(productsFailed(error.message)));
    }
    else if (component === "Products" && fetchProduct.Products) {
        dispatch(productsLoading());
        return firebase.firestore().collection("Products").where("featured", "==", false).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var ss = doc.data();
                    arr.push(ss);
                })
                dispatch(addProducts(arr));
                fetchProduct.Products = false;
            }, error => { throw error; })
            .catch(error => dispatch(productsFailed(error.message)));
    }
}

export const productsLoading = () => ({
    type: ActionTypes.PRODUCTS_LOADING
})

export const addProducts = (arr) => ({
    type: ActionTypes.ADD_PRODUCTS,
    payload: arr
});

export const productsFailed = (errmess) => ({
    type: ActionTypes.PRODUCTS_FAILED,
    payload: errmess
})

/**
 * ================================ Categories Section Action Creators ===================================
 */

export const fetchCategories = () => (dispatch) => {

    var arr = [];
    if (fetchCategory) {
        dispatch(categoriesLoading());
        return firebase.firestore().collection('Categories').get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    arr.push(doc.data())
                })
                dispatch(addCategories(arr));
                fetchCategory = false;
            },
                error => {
                    var errmess = Error(error.message);
                    throw errmess;
                })
            .catch(error => dispatch(categoriesFailed(error.message)));
    }
}

export const categoriesLoading = () => ({
    type: ActionTypes.CATEGORIES_LOADING
})

export const addCategories = (arr) => ({
    type: ActionTypes.ADD_CATEGORIES,
    payload: arr
});

export const categoriesFailed = (errmess) => ({
    type: ActionTypes.CATEGORIES_FAILED,
    payload: errmess
})

/**
 * ================================ Cart Section Action Creators =================================
 */

export const addProductToCart = (obj) => (dispatch) => {
    if (firebase.auth().currentUser) {
        firebase.firestore().collection('Users').doc(firebase.auth().currentUser.phoneNumber).update({ cart: firebase.firestore.FieldValue.arrayUnion(obj) })
            .then(() => {
                dispatch(({ type: ActionTypes.ADD_TO_CART, payload: obj }));
                ToastAndroid.show('Product Added Successfully', ToastAndroid.LONG);
            })
            .catch(err => {
                dispatch(({ type: ActionTypes.CART_FAILED }));
                ToastAndroid.show('Error: ' + err.message, ToastAndroid.LONG);
            })
    }
    else {
        dispatch(({ type: ActionTypes.ADD_TO_CART, payload: obj }));
        ToastAndroid.show('Product Added Successfully', ToastAndroid.LONG);
    }
}
export const removeProductFromCart = (item) => (dispatch) => {
    if (firebase.auth().currentUser) {
        firebase.firestore().collection('Users').doc(firebase.auth().currentUser.phoneNumber).update({ cart: firebase.firestore.FieldValue.arrayRemove({ id: item.id, product: item.product, quantity: item.quantity }) })
            .then(() => {
                dispatch(({ type: ActionTypes.REMOVE_FROM_CART, payload: item.id }));
                ToastAndroid.show('Product Removed Successfully', ToastAndroid.LONG);
            })
            .catch(err => {
                dispatch(({ type: ActionTypes.CART_FAILED }));
                ToastAndroid.show('Error: ' + err.message, ToastAndroid.LONG);
            })
    }
    else {
        dispatch(({ type: ActionTypes.REMOVE_FROM_CART, payload: item.id }));
        ToastAndroid.show('Product Removed Successfully', ToastAndroid.LONG);
    }
}
export const updateProductInCart = (arr) => (dispatch) => {
    if (firebase.auth().currentUser) {
        firebase.firestore().collection('Users').doc(firebase.auth().currentUser.phoneNumber).update({ cart: arr })
            .then(() => {
                dispatch(({ type: ActionTypes.UPDATE_IN_CART, payload: arr }));
                ToastAndroid.show('Updated Product Successfully', ToastAndroid.LONG);
            })
            .catch(err => {
                dispatch(({ type: ActionTypes.CART_FAILED }));
                ToastAndroid.show('Error: ' + err.message, ToastAndroid.LONG);
            })
    }
    else {
        dispatch(({ type: ActionTypes.UPDATE_IN_CART, payload: arr }));
        ToastAndroid.show('Updated Product Successfully', ToastAndroid.LONG);
    }
}

/**
 * =============================== Wishlist Section Action Creators ========================================
 */
export const addProductToWishlist = (obj) => (dispatch) => dispatch(({ type: ActionTypes.ADD_TO_WISHLIST, payload: obj }));
export const removeProductFromWishlist = (productId) => (dispatch) => dispatch(({ type: ActionTypes.REMOVE_FROM_WISHLIST, payload: productId }));

/**
 * =============================== User Section Action Creators ======================================
 */

export const updateUser = (obj) => (dispatch) => {
    dispatch(({ type: ActionTypes.UPDATE_USER, payload: obj }));
}

export const signOutUser = () => dispatch => Alert.alert('Logout', 'Are you sure?',
    [{ text: 'No' }, {
        text: 'Yes', onPress: () => {
            firebase.auth().signOut().then(() => {
                ToastAndroid.show('You Logged Out Successfully', ToastAndroid.LONG);
            }).catch(err => ToastAndroid.show('Error: ' + err.message, ToastAndroid.LONG))
        }
    }], { cancelable: false })

export const fetchUser = () => (dispatch) => {
    if (firebase.auth().currentUser) {
        dispatch(({ type: ActionTypes.USER_SIGNIN, payload: firebase.auth().currentUser }));
        firebase.firestore().collection('Users').doc(firebase.auth().currentUser.phoneNumber).get()
            .then(doc => {
                var temp = doc.data();
                var arr = [];
                dispatch(({ type: ActionTypes.ADD_CART, payload: temp.cart }));
                dispatch(({ type: ActionTypes.ADD_WISHLIST, payload: temp.wishlist }));
                /*
                dispatch(({ type: ActionTypes.ADD_ADDRESS, payload: temp.address }));
                dispatch(({ type: ActionTypes.ADD_ORDERS, payload: temp.orders }));*/
            }).catch(err => console.log(err));
    }
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            dispatch(({ type: ActionTypes.USER_SIGNIN, payload: firebase.auth().currentUser }));
            firebase.firestore().collection('Users').doc(firebase.auth().currentUser.phoneNumber).get()
                .then(doc => {
                    var temp = doc.data();
                    dispatch(({ type: ActionTypes.ADD_CART, payload: temp.cart }));
                    dispatch(({ type: ActionTypes.ADD_WISHLIST, payload: temp.wishlist }));
                    /*
                    dispatch(({ type: ActionTypes.ADD_ADDRESS, payload: temp.address }));
                    dispatch(({ type: ActionTypes.ADD_ORDERS, payload: temp.orders }));*/
                })
                .catch(err => console.log(err));
        }
        else {
            dispatch(({ type: ActionTypes.USER_SIGNOUT }));
        }
    })
}