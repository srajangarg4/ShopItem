import * as firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBixrN4XT9AkANmt2K-67Cb_Cpv7QaP4y8",
    authDomain: "shopitem-6799c.firebaseapp.com",
    databaseURL: "https://shopitem-6799c.firebaseio.com",
    projectId: "shopitem-6799c",
    storageBucket: "shopitem-6799c.appspot.com",
    messagingSenderId: "432345483809",
    appId: "1:432345483809:web:eb4a7212c0915ee1ad7160",
    measurementId: "G-ZPEZJY9NRH"
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;