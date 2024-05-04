import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmQhJLKcI8SycnYcp3UzV58ALMpFSuGYg",
    authDomain: "xando-c1ac7.firebaseapp.com",
    databaseURL: "https://xando-c1ac7-default-rtdb.firebaseio.com",
    projectId: "xando-c1ac7",
    storageBucket: "xando-c1ac7.appspot.com",
    messagingSenderId: "1026128888542",
    appId: "1:1026128888542:web:963bc8c33e4c7e8555384f",
    measurementId: "G-VW9MV3WH36"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase authentication
const auth = getAuth(app);

// Initialize Google authentication provider
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export { auth, provider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, db };
