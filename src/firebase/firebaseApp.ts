// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtvekdZtkJRq_zUcUMtKIA7SS_1Lsw1YE",
  authDomain: "aktas-app.firebaseapp.com",
  projectId: "aktas-app",
  storageBucket: "aktas-app.appspot.com",
  messagingSenderId: "905648300756",
  appId: "1:905648300756:web:f8042508cc2571e99e1141",
  measurementId: "G-E2NTYNMMS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export default app;

export const auth = getAuth(app);