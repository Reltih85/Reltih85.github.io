// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKbOKHgsaFrqfOv7kOEor7HaxulT9itIk",
  authDomain: "portafolio-da187.firebaseapp.com",
  projectId: "portafolio-da187",
  storageBucket: "portafolio-da187.firebasestorage.app",
  messagingSenderId: "1022201684262",
  appId: "1:1022201684262:web:beacb292db6858bccfe1e7",
  measurementId: "G-TD3R2618PJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// login anónimo temporal para poder usar reglas fácilmente
signInAnonymously(auth).catch(() => {});