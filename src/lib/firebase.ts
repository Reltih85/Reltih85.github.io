import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKbOKHgsaFrqfOv7kOEor7HaxulT9itIk",
  authDomain: "portafolio-da187.firebaseapp.com",
  projectId: "portafolio-da187",
  storageBucket: "portafolio-da187.firebasestorage.app",
  messagingSenderId: "1022201684262",
  appId: "1:1022201684262:web:beacb292db6858bccfe1e7",
  measurementId: "G-TD3R2618PJ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);