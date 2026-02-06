// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_hIAypBdFBK4jQS8iiO4sb3pQPuG5W8U",
  authDomain: "energy-6db7a.firebaseapp.com",
  projectId: "energy-6db7a",
  storageBucket: "energy-6db7a.firebasestorage.app",
  messagingSenderId: "694359267431",
  appId: "1:694359267431:web:bf3797233c3c1b45159cc2",
  measurementId: "G-YTDYPT8DYT"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };