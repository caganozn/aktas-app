// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBW9w0VPbVrRXTMvVsyvkbT7_tmJyQh5VQ",
  authDomain: "aktas-cs-ia.firebaseapp.com",
  projectId: "aktas-cs-ia",
  storageBucket: "aktas-cs-ia.appspot.com",
  messagingSenderId: "336128287737",
  appId: "1:336128287737:web:49b52226e1690d4e621328",
  measurementId: "G-YP5RVY8KN1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export default app;

export const auth = getAuth(app);