// src/utils/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAqWDMUibV6IK6DwhLN0AZdc6NHNLEkgeM",
    authDomain: "phoneverify-798ca.firebaseapp.com",
    projectId: "phoneverify-798ca",
    storageBucket: "phoneverify-798ca.appspot.com",
    messagingSenderId: "763626106796",
    appId: "1:763626106796:web:253bba91d863c739721409"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };