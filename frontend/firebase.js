// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "foodtalab-d3dc7.firebaseapp.com",
    projectId: "foodtalab-d3dc7",
    storageBucket: "foodtalab-d3dc7.firebasestorage.app",
    messagingSenderId: "465593761745",
    appId: "1:465593761745:web:f518d31bc4e891bfffaaf0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };