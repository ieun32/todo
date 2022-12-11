// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjmsYYUGBcnXOpcvt-IAG0Z1SocJvW0lU",
  authDomain: "todo-2bd65.firebaseapp.com",
  projectId: "todo-2bd65",
  storageBucket: "todo-2bd65.appspot.com",
  messagingSenderId: "778953829948",
  appId: "1:778953829948:web:18f5b0a3900e35a98d5d39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app,{
    experimentalForceLongPolling:true,
});

export {db};