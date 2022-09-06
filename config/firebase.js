import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const firebaseConfig = {
    // firebase config here
    apiKey: "AIzaSyCWH3B7hh9NEjD_1RELHLSAEXfuEgZoKYQ",
    authDomain: "chatty-40e7d.firebaseapp.com",
    projectId: "chatty-40e7d",
    storageBucket: "chatty-40e7d.appspot.com",
    messagingSenderId: "684160792714",
    appId: "1:684160792714:web:3f134390547ef396765573"
}

if (!firebase.app.length) {
    firebase.initializeApp(firebaseConfig);
}

export default () => {
    return { firebase, auth, firestore, storage };
};