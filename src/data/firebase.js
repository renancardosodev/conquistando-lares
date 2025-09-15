// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDMNROwKQf1WNOkyPZuBZm100v0cSaof4",
  authDomain: "pet-ongs.firebaseapp.com",
  databaseURL: "https://pet-ongs-default-rtdb.firebaseio.com",
  projectId: "pet-ongs",
  storageBucket: "pet-ongs.firebasestorage.app",
  messagingSenderId: "983403658255",
  appId: "1:983403658255:web:ce337f404ccde3b6f3b77a",
  measurementId: "G-453SFPXXYM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporta o storage e banco de dados para usar no app
export const storage = getStorage(app);
export const db = getFirestore(app);